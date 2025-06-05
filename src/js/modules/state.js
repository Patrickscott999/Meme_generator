// Simple state management module
const State = (function() {
  // Private state object
  const state = {
    currentMeme: null,
    savedMemes: [],
    userPreferences: {
      defaultFont: 'Impact',
      defaultColor: '#ffffff',
      defaultStrokeColor: '#000000'
    },
    isGenerating: false,
    chatHistory: [],
    currentView: 'home'
  };

  // Event listeners
  const listeners = {};

  return {
    // Get state
    get: function(key) {
      return key ? state[key] : {...state};
    },
    
    // Set state with notifications
    set: function(key, value) {
      state[key] = value;
      this.notify(key);
      
      // Save certain state to localStorage
      if (['savedMemes', 'userPreferences'].includes(key)) {
        this.persist(key);
      }
    },
    
    // Subscribe to state changes
    subscribe: function(key, callback) {
      if (!listeners[key]) listeners[key] = [];
      listeners[key].push(callback);
    },
    
    // Notify listeners
    notify: function(key) {
      if (listeners[key]) {
        listeners[key].forEach(callback => callback(state[key]));
      }
    },
    
    // Persist state to localStorage
    persist: function(key) {
      if (state[key]) {
        localStorage.setItem(`memeGenerator_${key}`, JSON.stringify(state[key]));
      }
    },
    
    // Load state from localStorage
    load: function() {
      ['savedMemes', 'userPreferences'].forEach(key => {
        const savedValue = localStorage.getItem(`memeGenerator_${key}`);
        if (savedValue) {
          try {
            state[key] = JSON.parse(savedValue);
          } catch (e) {
            console.error(`Error loading ${key} from localStorage`, e);
          }
        }
      });
    },
    
    // Initialize state
    init: function() {
      this.load();
      return this;
    }
  };
})();

export default State.init();
