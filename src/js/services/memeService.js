// Meme generation logic
import API from './api.js';
import State from '../modules/state.js';

const MemeService = {
  // Generate a meme using OpenAI
  generateMeme: async function(prompt) {
    try {
      // Generate image
      const imageBase64 = await API.generateMemeImage(prompt);
      
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
      throw error;
    }
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
