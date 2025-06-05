// Meme generation logic
import API from './api.js';
import State from '../modules/state.js';

const MemeService = {
  // Generate a meme using OpenAI
  generateMeme: async function(prompt) {
    try {
      // Check if in demo mode (no API key)
      const preferences = State.get('userPreferences');
      let imageBase64;
      
      if (!preferences.apiKey) {
        // Demo mode - use placeholder image
        imageBase64 = this.getPlaceholderImage();
      } else {
        // Real mode - generate with API
        imageBase64 = await API.generateMemeImage(prompt);
      }
      
      // Create meme object
      const meme = {
        id: Date.now().toString(),
        prompt: prompt,
        imageData: imageBase64,
        createdAt: new Date().toISOString(),
        caption: '',
        textSettings: {
          font: State.get('userPreferences').defaultFont,
          color: State.get('userPreferences').defaultColor,
          strokeColor: State.get('userPreferences').defaultStrokeColor,
          size: '36px',
          position: { x: 50, y: 50 } // Percentage of image
        }
      };
      
      // Set as current meme
      State.set('currentMeme', meme);
      
      return meme;
    } catch (error) {
      console.error('Error in generateMeme:', error);
      // Use placeholder in case of error
      return this.generatePlaceholderMeme(prompt);
    }
  },
  
  // Generate a placeholder meme for demo mode or errors
  generatePlaceholderMeme: function(prompt) {
    const meme = {
      id: Date.now().toString(),
      prompt: prompt,
      imageData: this.getPlaceholderImage(),
      createdAt: new Date().toISOString(),
      caption: 'Demo Caption',
      textSettings: {
        font: State.get('userPreferences').defaultFont,
        color: State.get('userPreferences').defaultColor,
        strokeColor: State.get('userPreferences').defaultStrokeColor,
        size: '36px',
        position: { x: 50, y: 50 }
      }
    };
    
    // Set as current meme
    State.set('currentMeme', meme);
    
    return meme;
  },
  
  // Get placeholder image for demo mode
  getPlaceholderImage: function() {
    // Simple gray placeholder with text
    return 'iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAMAAABOo35HAAAAaVBMVEUAAADd3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3Q8YUWAAAAInRSTlMA9+fPuIJkFALr083CQy4lDmoN4djSx7qvmZJpXlk4JhaMUFSw5AAAAtlJREFUeNrt3NluGkEQheFzumZfDIQkzmbL+79kLMuRbGRLBGa6q4r/e4L5fBmuaWbKGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxJmi9d/Ve0WzVXfHs1Kvi2a565bJb9UIYdTLZqxfKfpLJTr2Q2kkiB/VC6yeJHNULrZ8c1PM2SuMwnmc5SaOO5vykTdI4pPPMJmmcdCJJZKxTOUyka5N5JpLESafTSxI76Uy6JIuLzqaXJHbU+fSN+YyaJLGTzum0FDF7cl/QllnLjn1BGyTWsWNf0A6Sio59QVsmjY4d+4KeJI8d+4KeG+S51Fd0aMim11d0kU7jXl/RjYRa9/qK7mXU9fqKXmTVu9JXdC2zHjv3+t7jx9ht76q+TqAf2xVNbi5z+rElmnGpmStZdWu6kj+1a7imXRvd/0NUizX9KsfWlc03eVRb5HQcr+pK9RZZbMcdWu6weQ5t1ie+q08y27VPelpVFlsGGR31oJMUusf04X4V83G+3bR2fOgPSi9D/FH966wO/WWdQbiuqj/QLWmOlXVg9KhQRWv7Oy2eVIvte1ipIqTPw3P1oEcq9oBvt/gLfPWgOlPtbsulmZopVNOWbypFofZrtBk/V6mlP5n3J9lUqO9beB3a/0D1J6G9oQq3C3eLzuPDJPTFlx+Lhn6p0cNZFH5f4sOK4j9s8PA+c4LfBx0zfEYdL7y2jRteqqcIX37HDS9Jk4SXnmnCS8lE4aVisjBSmSy8VEwXXgomDC/5U4aX7EnDS+604SVz4vCSNXV4yZg8vKRPH16SpxdeEqcYXtKmGV6Sphpe0qUbXpKlHF5SpR1eEqUeXtKkH16SpB9eklQQXlJUEV4SVBJe4lUTXqJVFF5iVRVeIlUWXuJUF16iVBhe/qvC8PJPlYaXf6g0vPylavx8vfzRk3rx8jOtevHyM08qxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMaZ8vwCbHVat2KUYQgAAAABJRU5ErkJggg==';
  },
  
  // Save meme to gallery
  saveMeme: function(meme) {
    const savedMemes = [...State.get('savedMemes')];
    savedMemes.push(meme);
    State.set('savedMemes', savedMemes);
    return meme;
  },
  
  // Delete meme from gallery
  deleteMeme: function(memeId) {
    const savedMemes = State.get('savedMemes').filter(meme => meme.id !== memeId);
    State.set('savedMemes', savedMemes);
  }
};

export default MemeService;
