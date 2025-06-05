// OpenAI API integration
import State from '../modules/state.js';

const API = {
  API_KEY: '', // Will be set from user input in settings
  
  // Initialize the API with the key from localStorage if available
  init: function() {
    const preferences = State.get('userPreferences');
    if (preferences && preferences.apiKey) {
      this.API_KEY = preferences.apiKey;
    }
    return this;
  },
  
  // Generate image using OpenAI
  generateMemeImage: async function(prompt) {
    State.set('isGenerating', true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: prompt,
          tools: [{ type: "image_generation" }]
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error generating image');
      }
      
      const imageData = data.output
        .filter(output => output.type === "image_generation_call")
        .map(output => output.result);
        
      return imageData.length > 0 ? imageData[0] : null;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    } finally {
      State.set('isGenerating', false);
    }
  },
  
  // Get meme ideas using the chat assistant
  getMemeIdea: async function(userPrompt) {
    try {
      const memeIdeaSchema = {
        type: "object",
        properties: {
          topic: { type: "string" },
          caption: { type: "string" },
          imageDescription: { type: "string" },
          viralPotentialScore: { type: "integer" }
        },
        required: ["topic", "caption", "imageDescription"]
      };
      
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          input: [{
            role: "system",
            content: "You are a creative meme assistant. Generate funny, engaging meme ideas."
          }, {
            role: "user",
            content: userPrompt
          }],
          text: {
            format: {
              type: "json_schema",
              schema: memeIdeaSchema,
              strict: true
            }
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error getting meme idea');
      }
      
      return JSON.parse(data.output_text);
    } catch (error) {
      console.error('Error getting meme idea:', error);
      throw error;
    }
  }
};

export default API.init();
