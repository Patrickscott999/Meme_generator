// Main application entry point

// Import modules
import State from './modules/state.js';
import Gallery from './ui/gallery.js';
import Create from './ui/create.js';
import Settings from './ui/settings.js';
import MemeService from './services/memeService.js';
import Sharing from './modules/sharing.js';
import Components from './ui/components.js';

// Main app container
let appContainer;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('MemeGen AI application initialized');
  
  // Get app container
  appContainer = document.getElementById('app');
  
  // Setup navigation
  setupNavigation();
  
  // Set initial view based on URL hash or default to home
  const initialView = window.location.hash.substring(1) || 'home';
  navigateTo(initialView);
  
  // Update URL hash on navigation
  window.addEventListener('hashchange', () => {
    const view = window.location.hash.substring(1);
    navigateTo(view);
    
    // Update active nav state
    updateActiveNav(view);
  });
});

// Setup navigation handlers
function setupNavigation() {
  const navItems = document.querySelectorAll('#main-nav .nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      
      // Update URL hash which will trigger navigation
      window.location.hash = view;
    });
  });
}

// Update active navigation item
function updateActiveNav(view) {
  const navItems = document.querySelectorAll('#main-nav .nav-item');
  navItems.forEach(item => {
    if (item.dataset.view === view) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Handle view navigation
function navigateTo(view) {
  console.log(`Navigating to ${view} view`);
  
  // Clear app container
  while (appContainer.firstChild) {
    if (!appContainer.firstChild.id || appContainer.firstChild.id !== 'loading') {
      appContainer.removeChild(appContainer.firstChild);
    }
  }
  
  // Update state
  State.set('currentView', view);
  
  // Render appropriate view
  switch (view) {
    case 'home':
      renderHomeView();
      break;
    case 'create':
      renderCreateView();
      break;
    case 'settings':
      renderSettingsView();
      break;
    default:
      renderHomeView();
  }
}

// Render home view (Gallery)
function renderHomeView() {
  const container = document.createElement('div');
  container.className = 'view home-view';
  
  const header = document.createElement('h2');
  header.textContent = 'Your Meme Gallery';
  container.appendChild(header);
  
  appContainer.appendChild(container);
  
  // Initialize gallery
  const gallery = Gallery.init(container);
  
  // Handle gallery events
  container.addEventListener('edit-meme', (e) => {
    // Navigate to create view with selected meme
    window.location.hash = 'create';
  });
  
  container.addEventListener('share-meme', (e) => {
    handleShareMeme(e.detail);
  });
  
  container.addEventListener('delete-meme', (e) => {
    MemeService.deleteMeme(e.detail.id);
  });
}

// Render create view
function renderCreateView() {
  const container = document.createElement('div');
  container.className = 'view create-view';
  
  appContainer.appendChild(container);
  
  // Initialize create component
  Create.init(container);
}

// Render settings view
function renderSettingsView() {
  const container = document.createElement('div');
  container.className = 'view settings-view';
  
  appContainer.appendChild(container);
  
  // Initialize settings
  Settings.init(container);
}

// Handle sharing a meme
function handleShareMeme(meme) {
  const shareOptions = document.createElement('div');
  shareOptions.className = 'share-options card';
  shareOptions.style.position = 'fixed';
  shareOptions.style.top = '50%';
  shareOptions.style.left = '50%';
  shareOptions.style.transform = 'translate(-50%, -50%)';
  shareOptions.style.padding = '1.5rem';
  shareOptions.style.zIndex = '1000';
  shareOptions.style.backgroundColor = 'white';
  shareOptions.style.boxShadow = '0 0 20px rgba(0,0,0,0.2)';
  
  shareOptions.innerHTML = `
    <h3>Share Meme</h3>
    <p>Choose how you want to share your meme:</p>
  `;
  
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '10px';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.fontSize = '24px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.body.removeChild(shareOptions);
  });
  
  // Share options
  const optionsContainer = document.createElement('div');
  optionsContainer.style.display = 'flex';
  optionsContainer.style.flexDirection = 'column';
  optionsContainer.style.gap = '0.75rem';
  optionsContainer.style.marginTop = '1rem';
  
  // Download option
  const downloadBtn = Components.button('Download Image', 'btn btn-primary', () => {
    Sharing.downloadMeme(meme);
    document.body.removeChild(overlay);
    document.body.removeChild(shareOptions);
    Components.toast('Meme downloaded!', 'success');
  });
  
  // Copy to clipboard option
  const clipboardBtn = Components.button('Copy to Clipboard', 'btn', async () => {
    try {
      await Sharing.copyToClipboard(meme);
      document.body.removeChild(overlay);
      document.body.removeChild(shareOptions);
      Components.toast('Meme copied to clipboard!', 'success');
    } catch (error) {
      Components.toast('Error copying to clipboard', 'error');
    }
  });
  
  // Share option (Web Share API)
  const shareBtn = Components.button('Share...', 'btn', async () => {
    try {
      await Sharing.shareMeme(meme);
      document.body.removeChild(overlay);
      document.body.removeChild(shareOptions);
    } catch (error) {
      Components.toast('Error sharing meme', 'error');
    }
  });
  
  // Add buttons to container
  optionsContainer.appendChild(downloadBtn);
  optionsContainer.appendChild(clipboardBtn);
  optionsContainer.appendChild(shareBtn);
  
  // Add elements to share options
  shareOptions.appendChild(closeBtn);
  shareOptions.appendChild(optionsContainer);
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  overlay.style.zIndex = '999';
  overlay.addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.body.removeChild(shareOptions);
  });
  
  // Add to document
  document.body.appendChild(overlay);
  document.body.appendChild(shareOptions);
}
