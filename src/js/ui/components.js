// Reusable UI components
const Components = {
  // Create a button element
  button: function(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className || 'btn';
    if (onClick) {
      button.addEventListener('click', onClick);
    }
    return button;
  },
  
  // Create an input element
  input: function(type, name, placeholder, value = '') {
    const input = document.createElement('input');
    input.type = type || 'text';
    input.name = name;
    input.placeholder = placeholder || '';
    input.value = value;
    input.className = 'form-input';
    return input;
  },
  
  // Create a form group (label + input)
  formGroup: function(labelText, inputElement) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const label = document.createElement('label');
    label.textContent = labelText;
    label.className = 'form-label';
    
    group.appendChild(label);
    group.appendChild(inputElement);
    
    return group;
  },
  
  // Create a card container
  card: function(content) {
    const card = document.createElement('div');
    card.className = 'card';
    
    if (content) {
      if (typeof content === 'string') {
        card.innerHTML = content;
      } else {
        card.appendChild(content);
      }
    }
    
    return card;
  },
  
  // Show a toast notification
  toast: function(message, type = 'success', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Show the toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Remove the toast after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, duration);
  }
};

export default Components;
