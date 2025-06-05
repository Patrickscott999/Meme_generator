// Create view for generating new memes
import State from '../modules/state.js';
import Components from './components.js';
import MemeService from '../services/memeService.js';
import ChatService from '../services/chatService.js';
import Editor from './editor.js';

const Create = {
  // Initialize create view
  init: function(container) {
    this.container = container;
    this.isIdeaMode = false;
    
    // Render interface
    this.render();
    
    return this;
  },
  
  // Render create interface
  render: function() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    
    const currentMeme = State.get('currentMeme');
    
    // Main container
    const createContainer = document.createElement('div');
    createContainer.className = 'create-container';
    
    // Create card for inputs
    const inputCard = Components.card();
    inputCard.innerHTML = `<h2>Create a New Meme</h2>`;
    
    // Mode toggle
    const modeToggle = document.createElement('div');
    modeToggle.className = 'mode-toggle';
    modeToggle.style.display = 'flex';
    modeToggle.style.marginBottom = '1rem';
    
    const directBtn = Components.button('Direct Mode', 'btn mode-btn', () => {
      this.isIdeaMode = false;
      directBtn.classList.add('active');
      ideaBtn.classList.remove('active');
      inputForm.style.display = 'block';
      ideaForm.style.display = 'none';
    });
    
    const ideaBtn = Components.button('Get Ideas', 'btn mode-btn', () => {
      this.isIdeaMode = true;
      ideaBtn.classList.add('active');
      directBtn.classList.remove('active');
      inputForm.style.display = 'none';
      ideaForm.style.display = 'block';
    });
    
    directBtn.classList.add('active');
    
    modeToggle.appendChild(directBtn);
    modeToggle.appendChild(ideaBtn);
    
    // Direct input form
    const inputForm = document.createElement('form');
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.generateMeme(promptInput.value);
    });
    
    const promptInput = Components.input('text', 'prompt', 'Describe the meme you want to create');
    const promptGroup = Components.formGroup('Meme Description', promptInput);
    
    const generateBtn = Components.button('Generate Meme', 'btn btn-primary', null);
    generateBtn.type = 'submit';
    generateBtn.style.marginTop = '1rem';
    
    inputForm.appendChild(promptGroup);
    inputForm.appendChild(generateBtn);
    
    // Idea form
    const ideaForm = document.createElement('form');
    ideaForm.style.display = 'none';
    ideaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.getMemeIdea(ideaInput.value);
    });
    
    const ideaInput = Components.input('text', 'ideaPrompt', 'What kind of meme are you looking for?');
    const ideaGroup = Components.formGroup('Meme Idea Request', ideaInput);
    
    const getIdeaBtn = Components.button('Get Meme Ideas', 'btn btn-primary', null);
    getIdeaBtn.type = 'submit';
    getIdeaBtn.style.marginTop = '1rem';
    
    ideaForm.appendChild(ideaGroup);
    ideaForm.appendChild(getIdeaBtn);
    
    // Add elements to input card
    inputCard.appendChild(modeToggle);
    inputCard.appendChild(inputForm);
    inputCard.appendChild(ideaForm);
    
    createContainer.appendChild(inputCard);
    
    // Results section (only show if we have a current meme)
    if (currentMeme) {
      const resultContainer = document.createElement('div');
      resultContainer.className = 'result-container';
      resultContainer.style.marginTop = '2rem';
      
      // Initialize editor with current meme
      const editorContainer = document.createElement('div');
      editorContainer.className = 'editor-container';
      
      const editor = Editor.init(editorContainer, currentMeme);
      
      // Handle save meme event
      editorContainer.addEventListener('save-meme', (e) => {
        MemeService.saveMeme(e.detail);
        Components.toast('Meme saved to gallery!', 'success');
      });
      
      resultContainer.appendChild(editorContainer);
      createContainer.appendChild(resultContainer);
    }
    
    this.container.appendChild(createContainer);
    
    // Add loading indicator reference
    this.loadingElement = document.getElementById('loading');
  },
  
  // Generate meme from prompt
  generateMeme: async function(prompt) {
    if (!prompt) {
      Components.toast('Please enter a description', 'error');
      return;
    }
    
    try {
      // Show loading indicator
      this.loadingElement.classList.remove('hidden');
      
      // Generate meme
      const meme = await MemeService.generateMeme(prompt);
      
      // Re-render with new meme
      this.render();
      
    } catch (error) {
      console.error('Error generating meme:', error);
      Components.toast('Error generating meme. Please check your API key.', 'error');
    } finally {
      // Hide loading indicator
      this.loadingElement.classList.add('hidden');
    }
  },
  
  // Get meme idea from assistant
  getMemeIdea: async function(prompt) {
    if (!prompt) {
      Components.toast('Please enter what kind of meme you\'re looking for', 'error');
      return;
    }
    
    try {
      // Show loading indicator
      this.loadingElement.classList.remove('hidden');
      
      // Get meme idea
      const memeIdea = await ChatService.getMemeIdea(prompt);
      
      // Generate meme from idea
      await this.generateMeme(memeIdea.imageDescription);
      
    } catch (error) {
      console.error('Error getting meme idea:', error);
      Components.toast('Error getting meme idea. Please check your API key.', 'error');
    } finally {
      // Hide loading indicator
      this.loadingElement.classList.add('hidden');
    }
  }
};

export default Create;
