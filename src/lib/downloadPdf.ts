/**
 * Helper function to trigger a clean PDF download.
 * Handles base64 data URLs (converts to binary Blob first to bypass browser target="_blank" restrictions)
 * and normal HTTP/HTTPS web links.
 */
export const triggerPdfDownload = (url: string, filename = 'South_India_Travel_Guide.pdf') => {
  if (!url) {
    alert('No PDF document URL provided.');
    return;
  }

  const safeFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;

  // Case 1: Data URL (uploaded base64 PDF)
  if (url.startsWith('data:application/pdf') || url.startsWith('data:')) {
    try {
      const parts = url.split(',');
      const base64Data = parts.length > 1 ? parts[1] : parts[0];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 5000);
    } catch (err) {
      console.error('Error generating PDF blob for download:', err);
      // Fallback: Open in window or fallback download anchor
      const link = document.createElement('a');
      link.href = url;
      link.download = safeFilename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } else {
    // Case 2: Direct HTTP/HTTPS Web URL
    try {
      // Fetch as blob to force download instead of navigating
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error('Network response failed');
          return res.blob();
        })
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = safeFilename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        })
        .catch(() => {
          // Fallback if CORS or direct link
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.download = safeFilename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    } catch (e) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
