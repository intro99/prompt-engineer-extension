// ChatGPT Button Extension - content.js

// Function to create and add our custom button
function addCustomButton() {
  console.log("ChatGPT Button Extension: Attempting to add button...");
  
  // Check if button already exists to avoid duplicates
  if (document.getElementById('chatgpt-custom-button')) {
    console.log("Button already exists");
    return;
  }
  
  // Find the ChatGPT input area using the new selectors
  const inputArea = document.querySelector('div._prosemirror-parent_11fu7_1');
  if (!inputArea) {
    console.log("ChatGPT input area not found. Will retry later.");
    return false;
  }
  
  // Find the parent container where we'll insert our button
  let buttonContainer = inputArea.closest('form');
  if (!buttonContainer) {
    buttonContainer = inputArea.closest('div.flex');
  }
  if (!buttonContainer) {
    buttonContainer = inputArea.parentElement;
  }
  
  if (!buttonContainer) {
    console.log("Couldn't find a suitable container for the button");
    return false;
  }
  
  // Find the send button container to position our button next to it
  const sendButtonContainer = buttonContainer.querySelector('button[type="submit"]')?.parentElement ||
                              buttonContainer.querySelector('button')?.parentElement;
  
  if (!sendButtonContainer) {
    console.log("Send button container not found");
    return false;
  }
  
  // Create our custom button
  const customButton = document.createElement('button');
  customButton.id = 'chatgpt-custom-button';
  customButton.textContent = 'Ask More';
  customButton.title = 'Get additional information';
  
  // Style our button to match ChatGPT's design
  customButton.style.backgroundColor = '#10a37f'; // ChatGPT green
  customButton.style.color = 'white';
  customButton.style.border = 'none';
  customButton.style.borderRadius = '4px';
  customButton.style.padding = '8px 12px';
  customButton.style.margin = '0 8px';
  customButton.style.cursor = 'pointer';
  customButton.style.fontSize = '14px';
  customButton.style.fontWeight = 'bold';
  customButton.style.display = 'inline-flex';
  customButton.style.alignItems = 'center';
  customButton.style.justifyContent = 'center';
  
  // Add hover effect
  customButton.addEventListener('mouseover', () => {
    customButton.style.backgroundColor = '#0e8c6d'; // Darker green on hover
  });
  customButton.addEventListener('mouseout', () => {
    customButton.style.backgroundColor = '#10a37f'; // Back to normal
  });
  
  // Add button functionality
  customButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get the current input text from the ProseMirror div
    const proseMirror = document.querySelector('#prompt-textarea');
    const currentText = proseMirror ? proseMirror.textContent : '';
    
    // Append our custom text to the current input
    const enhancedText = currentText + (currentText ? ' ' : '') + 
      "testing text";
    
    // Update the ProseMirror content
    if (proseMirror) {
      proseMirror.textContent = enhancedText;
      
      // Dispatch an input event to make ChatGPT recognize the change
      const inputEvent = new Event('input', { bubbles: true });
      proseMirror.dispatchEvent(inputEvent);
      
      // Focus the input area
      proseMirror.focus();
    }
  });
  
  // Insert our button before the send button
  try {
    sendButtonContainer.parentElement.insertBefore(customButton, sendButtonContainer);
    console.log("Custom button added successfully");
    return true;
  } catch (e) {
    console.error("Failed to add custom button:", e);
    return false;
  }
}

// Function to observe DOM changes and add button when the interface loads
function observeForInputArea() {
  console.log("Setting up mutation observer for ChatGPT interface");
  
  // Create an observer instance
  const observer = new MutationObserver((mutations) => {
    // Check if our button exists
    if (!document.getElementById('chatgpt-custom-button')) {
      // Try to add our button
      const added = addCustomButton();
      
      // If button was added successfully, we can disconnect the observer
      // But better to keep it running as ChatGPT is a SPA and elements can be removed/added
    }
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also try to add the button immediately
  addCustomButton();
}

// Execute once the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeForInputArea);
} else {
  // If DOMContentLoaded has already fired, run immediately
  observeForInputArea();
}

// Also try after a short delay since ChatGPT loads dynamically
setTimeout(addCustomButton, 1000);
setTimeout(addCustomButton, 3000); 