// Settings view component
import State from '../modules/state.js';
import Components from './components.js';
import API from '../services/api.js';

const Settings = {
  // Initialize settings with container
  init: function(container) {
    this.container = container;
    
    // Render settings
    this.render();
    
    return this;
  },
  
  // Render settings interface
  render: function() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    
    const preferences = State.get('userPreferences');
    
    // Create settings form
    const form = document.createElement('form');
    form.className = 'settings-form';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveSettings();
    });
    
    // Create settings card
    const card = Components.card();
    card.innerHTML = `
      <h2>Settings</h2>
      <p>Configure your meme generator preferences</p>
    `;
    
    // API Key input
    const apiKeyInput = Components.input('password', 'apiKey', 'Enter your OpenAI API key', preferences.apiKey || '');
    const apiKeyGroup = Components.formGroup('OpenAI API Key', apiKeyInput);
    
    // Warning about API key
    const apiWarning = document.createElement('small');
    apiWarning.textContent = 'Your API key is stored locally in your browser.';
    apiWarning.style.color = '#dc3545';
    apiWarning.style.display = 'block';
    apiWarning.style.marginTop = '0.25rem';
    
    apiKeyGroup.appendChild(apiWarning);
    
    // Default font
    const fontInput = Components.input('text', 'defaultFont', 'Default font', preferences.defaultFont);
    const fontGroup = Components.formGroup('Default Font', fontInput);
    
    // Text color
    const colorInput = Components.input('color', 'defaultColor', '', preferences.defaultColor);
    const colorGroup = Components.formGroup('Default Text Color', colorInput);
    
    // Stroke color
    const strokeInput = Components.input('color', 'defaultStrokeColor', '', preferences.defaultStrokeColor);
    const strokeGroup = Components.formGroup('Default Stroke Color', strokeInput);
    
    // Submit button
    const submitBtn = Components.button('Save Settings', 'btn btn-primary', null);
    submitBtn.type = 'submit';
    
    // Clear storage button
    const clearStorageBtn = Components.button('Clear Saved Data', 'btn', () => {
      if (confirm('Are you sure you want to clear all saved memes and settings? This cannot be undone.')) {
        localStorage.clear();
        State.set('savedMemes', []);
        State.set('userPreferences', {
          defaultFont: 'Impact',
          defaultColor: '#ffffff',
          defaultStrokeColor: '#000000'
        });
        Components.toast('All saved data cleared!', 'success');
        this.render();
      }
    });
    clearStorageBtn.style.backgroundColor = '#dc3545';
    clearStorageBtn.style.color = 'white';
    clearStorageBtn.style.marginLeft = '1rem';
    
    // Add form elements
    form.appendChild(card);
    form.appendChild(apiKeyGroup);
    form.appendChild(fontGroup);
    form.appendChild(colorGroup);
    form.appendChild(strokeGroup);
    
    const buttonGroup = document.createElement('div');
    buttonGroup.style.display = 'flex';
    buttonGroup.style.marginTop = '1.5rem';
    buttonGroup.appendChild(submitBtn);
    buttonGroup.appendChild(clearStorageBtn);
    
    form.appendChild(buttonGroup);
    
    this.container.appendChild(form);
  },
  
  // Save settings
  saveSettings: function() {
    const apiKeyInput = this.container.querySelector('[name="apiKey"]');
    const fontInput = this.container.querySelector('[name="defaultFont"]');
    const colorInput = this.container.querySelector('[name="defaultColor"]');
    const strokeInput = this.container.querySelector('[name="defaultStrokeColor"]');
    
    const preferences = {
      ...State.get('userPreferences'),
      apiKey: apiKeyInput.value,
      defaultFont: fontInput.value,
      defaultColor: colorInput.value,
      defaultStrokeColor: strokeInput.value
    };
    
    // Update state
    State.set('userPreferences', preferences);
    
    // Update API key in the API service
    API.API_KEY = apiKeyInput.value;
    
    Components.toast('Settings saved!', 'success');
  }
};

export default Settings;
