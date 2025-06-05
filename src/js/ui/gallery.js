// Gallery view for saved memes
import State from '../modules/state.js';
import Components from './components.js';

const Gallery = {
  // Initialize the gallery with a container
  init: function(container) {
    this.container = container;
    
    // Subscribe to savedMemes state changes
    State.subscribe('savedMemes', () => {
      this.render();
    });
    
    // Initial render
    this.render();
    
    return this;
  },
  
  // Render the gallery
  render: function() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    
    const savedMemes = State.get('savedMemes');
    
    if (savedMemes.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <h3>No memes saved yet</h3>
        <p>Create your first meme by clicking the Create button above!</p>
      `;
      this.container.appendChild(emptyState);
      return;
    }
    
    // Create gallery grid
    const gallery = document.createElement('div');
    gallery.className = 'meme-gallery';
    gallery.style.display = 'grid';
    gallery.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    gallery.style.gap = '1rem';
    
    // Sort memes by creation date, newest first
    const sortedMemes = [...savedMemes].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Add memes to gallery
    sortedMemes.forEach(meme => {
      const memeCard = this.createMemeCard(meme);
      gallery.appendChild(memeCard);
    });
    
    this.container.appendChild(gallery);
  },
  
  // Create a card for a single meme
  createMemeCard: function(meme) {
    const card = Components.card();
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    
    // Meme container with relative positioning
    const memeContainer = document.createElement('div');
    memeContainer.style.position = 'relative';
    memeContainer.style.marginBottom = '0.5rem';
    
    // Meme image
    const img = document.createElement('img');
    img.src = `data:image/png;base64,${meme.imageData}`;
    img.alt = meme.caption || 'Meme';
    img.style.width = '100%';
    img.style.borderRadius = '4px';
    
    // Meme text overlay
    const overlay = document.createElement('div');
    overlay.textContent = meme.caption || '';
    overlay.style.position = 'absolute';
    overlay.style.left = `${meme.textSettings.position.x}%`;
    overlay.style.top = `${meme.textSettings.position.y}%`;
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.fontFamily = meme.textSettings.font;
    overlay.style.fontSize = meme.textSettings.size;
    overlay.style.color = meme.textSettings.color;
    overlay.style.WebkitTextStroke = `1px ${meme.textSettings.strokeColor}`;
    overlay.style.pointerEvents = 'none';
    overlay.style.textAlign = 'center';
    
    memeContainer.appendChild(img);
    memeContainer.appendChild(overlay);
    
    // Card footer with actions
    const footer = document.createElement('div');
    footer.className = 'card-footer';
    footer.style.display = 'flex';
    footer.style.justifyContent = 'space-between';
    footer.style.marginTop = 'auto';
    
    // Created date
    const date = document.createElement('small');
    date.textContent = new Date(meme.createdAt).toLocaleDateString();
    date.style.opacity = '0.7';
    
    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.style.display = 'flex';
    actions.style.gap = '0.5rem';
    
    // Edit button
    const editBtn = Components.button('Edit', 'btn btn-small', () => {
      // Set current meme and trigger edit event
      State.set('currentMeme', meme);
      this.container.dispatchEvent(new CustomEvent('edit-meme', { detail: meme }));
    });
    editBtn.style.padding = '0.25rem 0.5rem';
    editBtn.style.fontSize = '0.8rem';
    
    // Share button
    const shareBtn = Components.button('Share', 'btn btn-small', () => {
      this.container.dispatchEvent(new CustomEvent('share-meme', { detail: meme }));
    });
    shareBtn.style.padding = '0.25rem 0.5rem';
    shareBtn.style.fontSize = '0.8rem';
    
    // Delete button
    const deleteBtn = Components.button('Delete', 'btn btn-small', () => {
      if (confirm('Are you sure you want to delete this meme?')) {
        this.container.dispatchEvent(new CustomEvent('delete-meme', { detail: meme }));
      }
    });
    deleteBtn.style.padding = '0.25rem 0.5rem';
    deleteBtn.style.fontSize = '0.8rem';
    deleteBtn.style.backgroundColor = '#dc3545';
    deleteBtn.style.color = 'white';
    
    actions.appendChild(editBtn);
    actions.appendChild(shareBtn);
    actions.appendChild(deleteBtn);
    
    footer.appendChild(date);
    footer.appendChild(actions);
    
    card.appendChild(memeContainer);
    card.appendChild(footer);
    
    return card;
  }
};

export default Gallery;
