// Meme editing functionality
import State from '../modules/state.js';
import Components from './components.js';

const Editor = {
  // Initialize the editor with a meme
  init: function(container, meme) {
    this.container = container;
    this.meme = meme;
    
    // Create editor interface
    this.render();
    
    return this;
  },
  
  // Render the editor
  render: function() {
    if (!this.container || !this.meme) return;
    
    this.container.innerHTML = '';
    
    // Create image preview
    const preview = document.createElement('div');
    preview.className = 'meme-preview';
    preview.style.position = 'relative';
    preview.style.marginBottom = '1rem';
    
    // Create image element
    const img = document.createElement('img');
    img.src = `data:image/png;base64,${this.meme.imageData}`;
    img.alt = 'Meme preview';
    img.style.width = '100%';
    img.style.maxHeight = '500px';
    img.style.objectFit = 'contain';
    
    // Create text overlay
    const textOverlay = document.createElement('div');
    textOverlay.className = 'text-overlay';
    textOverlay.textContent = this.meme.caption || '';
    textOverlay.style.position = 'absolute';
    textOverlay.style.left = `${this.meme.textSettings.position.x}%`;
    textOverlay.style.top = `${this.meme.textSettings.position.y}%`;
    textOverlay.style.transform = 'translate(-50%, -50%)';
    textOverlay.style.fontFamily = this.meme.textSettings.font;
    textOverlay.style.fontSize = this.meme.textSettings.size;
    textOverlay.style.color = this.meme.textSettings.color;
    textOverlay.style.WebkitTextStroke = `1px ${this.meme.textSettings.strokeColor}`;
    textOverlay.style.userSelect = 'none';
    textOverlay.style.textAlign = 'center';
    
    // Make text draggable
    this.makeDraggable(textOverlay, preview);
    
    preview.appendChild(img);
    preview.appendChild(textOverlay);
    
    // Create controls
    const controls = document.createElement('div');
    controls.className = 'editor-controls';
    
    // Caption input
    const captionGroup = Components.formGroup('Caption', Components.input('text', 'caption', 'Enter caption', this.meme.caption));
    captionGroup.querySelector('input').addEventListener('input', (e) => {
      this.meme.caption = e.target.value;
      textOverlay.textContent = e.target.value;
    });
    
    controls.appendChild(captionGroup);
    
    // Font controls (simplified for now)
    const fontGroup = Components.formGroup('Font', Components.input('text', 'font', 'Font name', this.meme.textSettings.font));
    fontGroup.querySelector('input').addEventListener('input', (e) => {
      this.meme.textSettings.font = e.target.value;
      textOverlay.style.fontFamily = e.target.value;
    });
    
    controls.appendChild(fontGroup);
    
    // Color input
    const colorGroup = Components.formGroup('Text Color', Components.input('color', 'color', '', this.meme.textSettings.color));
    colorGroup.querySelector('input').addEventListener('input', (e) => {
      this.meme.textSettings.color = e.target.value;
      textOverlay.style.color = e.target.value;
    });
    
    controls.appendChild(colorGroup);
    
    // Save button
    const saveButton = Components.button('Save Meme', 'btn btn-primary', () => {
      // Event will be handled by parent component
      const saveEvent = new CustomEvent('save-meme', { detail: this.meme });
      this.container.dispatchEvent(saveEvent);
    });
    
    controls.appendChild(saveButton);
    
    this.container.appendChild(preview);
    this.container.appendChild(controls);
  },
  
  // Make an element draggable
  makeDraggable: function(element, container) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDrag, { passive: false });
    
    function startDrag(e) {
      if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
      } else {
        initialX = e.clientX;
        initialY = e.clientY;
      }
      
      if (e.target === element) {
        isDragging = true;
      }
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
    }
    
    const that = this;
    
    function drag(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      
      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }
      
      // Calculate position as percentage of container
      const containerRect = container.getBoundingClientRect();
      const newPositionX = ((element.offsetLeft + currentX + element.offsetWidth / 2) / containerRect.width) * 100;
      const newPositionY = ((element.offsetTop + currentY + element.offsetHeight / 2) / containerRect.height) * 100;
      
      // Update position
      element.style.left = `${newPositionX}%`;
      element.style.top = `${newPositionY}%`;
      
      // Update meme object
      that.meme.textSettings.position.x = newPositionX;
      that.meme.textSettings.position.y = newPositionY;
      
      // Reset for next drag
      initialX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      initialY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    }
    
    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    }
  }
};

export default Editor;
