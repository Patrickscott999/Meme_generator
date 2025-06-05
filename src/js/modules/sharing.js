// Sharing utilities for memes
const Sharing = {
  // Share meme as image download
  downloadMeme: function(meme) {
    if (!meme || !meme.imageData) {
      throw new Error('No valid meme to download');
    }
    
    // Create a temporary canvas to draw the meme with text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Create an image from the base64 data
    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Draw text
      if (meme.caption) {
        ctx.font = `${meme.textSettings.size} ${meme.textSettings.font}`;
        ctx.textAlign = 'center';
        ctx.fillStyle = meme.textSettings.color;
        
        // Position text based on percentage
        const x = canvas.width * (meme.textSettings.position.x / 100);
        const y = canvas.height * (meme.textSettings.position.y / 100);
        
        // Add stroke
        ctx.strokeStyle = meme.textSettings.strokeColor;
        ctx.lineWidth = 2;
        ctx.strokeText(meme.caption, x, y);
        
        // Add fill
        ctx.fillText(meme.caption, x, y);
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = `meme-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    // Set source to trigger load event
    img.src = `data:image/png;base64,${meme.imageData}`;
  },
  
  // Share meme to clipboard
  copyToClipboard: async function(meme) {
    if (!meme || !meme.imageData) {
      throw new Error('No valid meme to copy');
    }
    
    try {
      // Create a blob from base64
      const fetchResponse = await fetch(`data:image/png;base64,${meme.imageData}`);
      const blob = await fetchResponse.blob();
      
      // Copy to clipboard using Clipboard API
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      throw error;
    }
  },
  
  // Share meme through Web Share API
  shareMeme: async function(meme) {
    if (!meme || !meme.imageData) {
      throw new Error('No valid meme to share');
    }
    
    try {
      // Check if Web Share API is supported
      if (!navigator.share) {
        throw new Error('Web Share API not supported');
      }
      
      // Create a blob from base64
      const fetchResponse = await fetch(`data:image/png;base64,${meme.imageData}`);
      const blob = await fetchResponse.blob();
      
      // Create a File from the blob
      const file = new File([blob], 'meme.png', { type: 'image/png' });
      
      // Share the file
      await navigator.share({
        title: meme.caption || 'My Awesome Meme',
        text: 'Check out this meme I created!',
        files: [file]
      });
      
      return true;
    } catch (error) {
      console.error('Error sharing meme:', error);
      
      // Fallback to download if sharing fails
      if (error.message === 'Web Share API not supported') {
        this.downloadMeme(meme);
        return true;
      }
      
      throw error;
    }
  }
};

export default Sharing;
