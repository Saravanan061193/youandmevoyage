const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.safari.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.blogPost.deleteMany();
  console.log('Database cleared successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
