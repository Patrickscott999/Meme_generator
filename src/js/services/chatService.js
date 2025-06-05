// Chat assistant functionality
import API from './api.js';
import State from '../modules/state.js';

const ChatService = {
  // Get meme idea based on user prompt
  getMemeIdea: async function(userPrompt) {
    try {
      // Add user message to chat history
      this.addMessageToHistory({
        role: 'user',
        content: userPrompt
      });
      
      // Get idea from API
      const memeIdea = await API.getMemeIdea(userPrompt);
      
      // Add assistant response to chat history
      this.addMessageToHistory({
        role: 'assistant',
        content: JSON.stringify(memeIdea)
      });
      
      return memeIdea;
    } catch (error) {
      console.error('Error getting meme idea:', error);
      throw error;
    }
  },
  
  // Add message to chat history
  addMessageToHistory: function(message) {
    const chatHistory = [...State.get('chatHistory')];
    chatHistory.push({
      ...message,
      timestamp: new Date().toISOString()
    });
    
    // Limit history length to last 20 messages
    if (chatHistory.length > 20) {
      chatHistory.shift();
    }
    
    State.set('chatHistory', chatHistory);
  },
  
  // Clear chat history
  clearHistory: function() {
    State.set('chatHistory', []);
  }
};

export default ChatService;
