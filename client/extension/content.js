// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractData') {
    try {
      // Extract data from the page
      const data = {
        title: extractTitle(),
        price: extractPrice(),
        description: extractDescription(),
        image: extractImage(),
        url: window.location.href,
      };

      console.log('Extracted data:', data); // Debug log

      // Send the data back to popup
      sendResponse({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error('Extraction error:', error); // Debug log
      sendResponse({
        success: false,
        error: error.message,
      });
    }
  }
  return true; // Keep the message channel open for async response
});

// Helper functions to extract data
function extractTitle() {
  // Updated selectors for Facebook's current structure
  const selectors = [
    '[data-testid="marketplace_listing_title"]',
    'h1',
    '[data-ad-preview="title"]',
    'span[dir="auto"]', // Common Facebook text container
    '.x1lliihq', // Common Facebook class for text
  ];

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const text = element.textContent.trim();
      if (text && text !== 'Marketplace') {
        return text;
      }
    }
  }
  return null;
}

function extractPrice() {
  const selectors = [
    '[data-testid="marketplace_listing_price"]',
    '[data-ad-preview="price"]',
    'span[dir="auto"]', // Common Facebook text container
    '.x1lliihq', // Common Facebook class for text
  ];

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const text = element.textContent.trim();
      // Look for price patterns like "₱1,234" or "1,234"
      if (text.match(/[₱]?\d+([,.]\d+)?/)) {
        return text.replace(/[^0-9]/g, '');
      }
    }
  }
  return null;
}

function extractDescription() {
  const selectors = [
    '[data-testid="marketplace_listing_description"]',
    '[data-ad-preview="message"]',
    'div[dir="auto"]', // Common Facebook text container
    '.x1lliihq', // Common Facebook class for text
  ];

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const text = element.textContent.trim();
      if (text && text.length > 10) {
        // Basic validation for description
        return text;
      }
    }
  }
  return null;
}

function extractImage() {
  const selectors = [
    'img[src*="scontent"]',
    'img[src*="marketplace"]',
    '[data-ad-preview="image"] img',
    'img[src*="fbcdn.net"]',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      // Get the highest resolution image available
      const src = element.src;
      if (src) {
        // Remove size parameters from URL to get full resolution
        return src.split('?')[0];
      }
    }
  }
  return null;
}
