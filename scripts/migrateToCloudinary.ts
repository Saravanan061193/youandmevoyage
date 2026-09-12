import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function uploadToCloudinary(
  base64String: string,
  cloudName: string,
  uploadPreset: string
): Promise<string | null> {
  if (!base64String || !base64String.startsWith('data:image/')) {
    return null;
  }
  try {
    const formData = new FormData();
    formData.append('file', base64String);
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.secure_url;
    } else {
      const errText = await res.text();
      console.error(`Failed to upload to Cloudinary. Status: ${res.status}, Message: ${errText}`);
      return null;
    }
  } catch (error) {
    console.error('Cloudinary upload exception:', error);
    return null;
  }
}

async function migrate() {
  console.log('Starting migration script...');

  // 1. Get Cloudinary Config
  const settings = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: 'desc' } });
  if (!settings) {
    console.error('No SiteSettings found!');
    return;
  }

  const cloudName = settings.cloudinaryCloudName || 'zfvizmyg';
  const uploadPreset = settings.cloudinaryUploadPreset || 'voyage_uploads';

  if (!cloudName || !uploadPreset) {
    console.error('Cloudinary configuration is missing in SiteSettings.');
    return;
  }

  console.log(`Using Cloudinary Cloud Name: ${cloudName}, Preset: ${uploadPreset}`);

  // Helper to process string fields
  async function processString(val: string | null): Promise<string | null> {
    if (val && val.startsWith('data:image/')) {
      const url = await uploadToCloudinary(val, cloudName, uploadPreset);
      if (url) return url;
    }
    return val;
  }

  // 2. Migrate Destinations
  console.log('\n--- Migrating Destinations ---');
  const destinations = await prisma.destination.findMany();
  for (const dest of destinations) {
    let updated = false;
    let newImage = dest.image;

    if (dest.image.startsWith('data:image/')) {
      console.log(`Uploading image for Destination: ${dest.title}...`);
      const url = await uploadToCloudinary(dest.image, cloudName, uploadPreset);
      if (url) {
        newImage = url;
        updated = true;
      }
    }

    if (updated) {
      await prisma.destination.update({
        where: { id: dest.id },
        data: { image: newImage },
      });
      console.log(`Updated Destination: ${dest.title}`);
    }
  }

  // 3. Migrate Safaris (Journeys)
  console.log('\n--- Migrating Safaris (Journeys) ---');
  const safaris = await prisma.safari.findMany();
  for (const safari of safaris) {
    let updated = false;
    let newImage = safari.image;
    let newGallery = safari.gallery;

    if (safari.image && safari.image.startsWith('data:image/')) {
      console.log(`Uploading main image for Safari: ${safari.title}...`);
      const url = await uploadToCloudinary(safari.image, cloudName, uploadPreset);
      if (url) {
        newImage = url;
        updated = true;
      }
    }

    if (safari.gallery) {
      try {
        const parsedGallery = JSON.parse(safari.gallery);
        if (Array.isArray(parsedGallery)) {
          let galleryUpdated = false;
          for (let i = 0; i < parsedGallery.length; i++) {
            if (typeof parsedGallery[i] === 'string' && parsedGallery[i].startsWith('data:image/')) {
              console.log(`Uploading gallery image ${i} for Safari: ${safari.title}...`);
              const url = await uploadToCloudinary(parsedGallery[i], cloudName, uploadPreset);
              if (url) {
                parsedGallery[i] = url;
                galleryUpdated = true;
                updated = true;
              }
            }
          }
          if (galleryUpdated) {
            newGallery = JSON.stringify(parsedGallery);
          }
        }
      } catch (e) {}
    }

    if (updated) {
      await prisma.safari.update({
        where: { id: safari.id },
        data: { image: newImage, gallery: newGallery },
      });
      console.log(`Updated Safari: ${safari.title}`);
    }
  }

  // 4. Migrate Experiences
  console.log('\n--- Migrating Experiences ---');
  const experiences = await prisma.experience.findMany();
  for (const exp of experiences) {
    if (exp.image && exp.image.startsWith('data:image/')) {
      console.log(`Uploading image for Experience: ${exp.title}...`);
      const url = await uploadToCloudinary(exp.image, cloudName, uploadPreset);
      if (url) {
        await prisma.experience.update({
          where: { id: exp.id },
          data: { image: url },
        });
        console.log(`Updated Experience: ${exp.title}`);
      }
    }
  }

  // 5. Migrate Gallery Items
  console.log('\n--- Migrating Gallery Items ---');
  const galleryItems = await prisma.galleryItem.findMany();
  for (const item of galleryItems) {
    if (item.image && item.image.startsWith('data:image/')) {
      console.log(`Uploading image for GalleryItem: ${item.title || item.id}...`);
      const url = await uploadToCloudinary(item.image, cloudName, uploadPreset);
      if (url) {
        await prisma.galleryItem.update({
          where: { id: item.id },
          data: { image: url },
        });
        console.log(`Updated GalleryItem: ${item.title || item.id}`);
      }
    }
  }

  // 6. Migrate SiteSettings
  console.log('\n--- Migrating SiteSettings ---');
  let settingsUpdated = false;
  const updateData: any = {};

  const fieldsToCheck = [
    'heroImage',
    'aboutHeroImage',
    'aboutCompanyStoryImage',
    'aboutSustainabilityImage',
    'siteLogo',
    'siteFavicon',
  ];

  for (const field of fieldsToCheck) {
    if ((settings as any)[field] && (settings as any)[field].startsWith('data:image/')) {
      console.log(`Uploading SiteSettings ${field}...`);
      const url = await uploadToCloudinary((settings as any)[field], cloudName, uploadPreset);
      if (url) {
        updateData[field] = url;
        settingsUpdated = true;
      }
    }
  }

  if (settings.heroBanners) {
    try {
      const parsedBanners = JSON.parse(settings.heroBanners);
      if (Array.isArray(parsedBanners)) {
        let bannersUpdated = false;
        for (let i = 0; i < parsedBanners.length; i++) {
          if (parsedBanners[i].image && parsedBanners[i].image.startsWith('data:image/')) {
            console.log(`Uploading SiteSettings heroBanners image ${i}...`);
            const url = await uploadToCloudinary(parsedBanners[i].image, cloudName, uploadPreset);
            if (url) {
              parsedBanners[i].image = url;
              bannersUpdated = true;
              settingsUpdated = true;
            }
          }
        }
        if (bannersUpdated) {
          updateData.heroBanners = JSON.stringify(parsedBanners);
        }
      }
    } catch (e) {}
  }

  if (settings.siteExperiences) {
    try {
      const parsedExp = JSON.parse(settings.siteExperiences);
      if (Array.isArray(parsedExp)) {
        let expUpdated = false;
        for (let i = 0; i < parsedExp.length; i++) {
          if (parsedExp[i].image && parsedExp[i].image.startsWith('data:image/')) {
            console.log(`Uploading SiteSettings siteExperiences image ${i}...`);
            const url = await uploadToCloudinary(parsedExp[i].image, cloudName, uploadPreset);
            if (url) {
              parsedExp[i].image = url;
              expUpdated = true;
              settingsUpdated = true;
            }
          }
        }
        if (expUpdated) {
          updateData.siteExperiences = JSON.stringify(parsedExp);
        }
      }
    } catch (e) {}
  }

  if (settingsUpdated) {
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: updateData,
    });
    console.log('Updated SiteSettings');
  }

  console.log('\nMigration complete!');
  process.exit(0);
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
