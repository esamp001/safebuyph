// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractData') {
    console.log('Content script received extractData request');

    // Function to attempt data extraction with retries
    const extractWithRetry = async (maxRetries = 3) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`Extraction attempt ${attempt} of ${maxRetries}`);

        // Wait for content to load
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));

        const data = {
          title: extractTitle(),
          price: extractPrice(),
          description: extractDescription(),
          image: extractImage(),
          url: window.location.href,
        };

        // Clean and validate the data
        if (data.title) {
          data.title = data.title.trim();
        }
        if (data.price) {
          // Remove any non-numeric characters except decimal point
          data.price = data.price.replace(/[^0-9.]/g, '');
          // If price is too long, it might be concatenated - try to fix it
          if (data.price.length > 10) {
            // Try to split the price if it looks concatenated
            const halfLength = Math.floor(data.price.length / 2);
            const firstHalf = data.price.slice(0, halfLength);
            const secondHalf = data.price.slice(halfLength);
            if (firstHalf === secondHalf) {
              data.price = firstHalf;
            }
          }
        }
        if (data.description) {
          // Clean up the description
          data.description = data.description
            .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
            .replace(/Details/g, '') // Remove "Details" prefix
            .replace(/Condition/g, 'Condition: ') // Format condition
            .replace(/Rfs:/g, 'Reason for selling: ') // Format RFS
            .trim();
        }
        if (data.image) {
          // Ensure the image URL is absolute and clean
          data.image = new URL(data.image, window.location.origin).href;
        }

        // Check if we got the essential data
        if (data.title && data.price) {
          console.log('Successfully extracted and cleaned data:', data);
          return data;
        }

        console.log(`Attempt ${attempt} failed, retrying...`);
      }
      return null;
    };

    // Execute the extraction with retries
    extractWithRetry().then((data) => {
      if (data) {
        sendResponse({
          success: true,
          data: data,
        });
      } else {
        sendResponse({
          success: false,
          error: 'Failed to extract data after multiple attempts',
        });
      }
    });

    return true; // Keep the message channel open for async response
  }
});

// Helper functions to extract data
function extractTitle() {
  console.log('Extracting title...');

  // First try the H1 element directly
  const h1Element = document.querySelector('h1');
  if (h1Element) {
    const text = h1Element.textContent.trim();
    console.log('Found title in H1:', text);

    // Validate that this is actually a listing title
    if (
      text &&
      text.length > 3 &&
      !text.includes('Marketplace') &&
      !text.includes('Browse') &&
      !text.includes('Notifications') &&
      !text.includes('Menu')
    ) {
      console.log('Found valid title in H1:', text);
      return text;
    }
  }

  // Try finding title in the main content area
  const mainContent =
    document.querySelector('[role="main"]') ||
    document.querySelector('[data-pagelet="MarketplacePDP"]');
  if (mainContent) {
    // Look for title elements with specific classes
    const titleElements = mainContent.querySelectorAll(
      'span[class*="x1lliihq"], span[class*="x1heor9g"], span[class*="x193iq5w"]'
    );

    for (const element of titleElements) {
      const text = element.textContent.trim();
      console.log('Found potential title text:', text);

      if (
        text &&
        text.length > 3 &&
        !text.includes('Marketplace') &&
        !text.includes('Browse') &&
        !text.includes('Notifications') &&
        !text.includes('Menu') &&
        !text.includes('PHP') && // Exclude price text
        !text.match(/^[₱]?\d+([,.]\d+)?/)
      ) {
        // Exclude price numbers
        console.log('Found valid title:', text);
        return text;
      }
    }
  }

  return null;
}

function extractPrice() {
  console.log('Extracting price...');

  // First try the exact class combination we know works
  const exactPriceSelector =
    'span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x676frb.x1lkfr7t.x1lbecb7.xk50ysn.xzsf02u';
  const exactPriceElement = document.querySelector(exactPriceSelector);

  if (exactPriceElement) {
    const text = exactPriceElement.textContent.trim();
    console.log('Found price with exact selector:', text);

    // Handle PHP prefix
    if (text.toUpperCase().startsWith('PHP')) {
      const price = text.replace(/^PHP/i, '').trim();
      console.log('Extracted price after removing PHP prefix:', price);
      return price.replace(/[^0-9]/g, '');
    }
  }

  // Try finding price in the main content area
  const mainContent =
    document.querySelector('[role="main"]') ||
    document.querySelector('[data-pagelet="MarketplacePDP"]');
  if (mainContent) {
    // Look for price elements with specific classes
    const priceElements = mainContent.querySelectorAll(
      'span[class*="x193iq5w"], span[class*="xeuugli"], span[class*="x1lliihq"]'
    );
    for (const element of priceElements) {
      const text = element.textContent.trim();
      console.log('Found potential price text:', text);

      if (text.toUpperCase().startsWith('PHP')) {
        const price = text.replace(/^PHP/i, '').trim();
        console.log('Found price with PHP prefix:', price);
        return price.replace(/[^0-9]/g, '');
      }
    }
  }

  return null;
}

function extractDescription() {
  console.log('Extracting description...');

  // Try finding description in the main content area
  const mainContent =
    document.querySelector('[role="main"]') ||
    document.querySelector('[data-pagelet="MarketplacePDP"]');
  if (mainContent) {
    // Look for description elements with specific classes
    const descriptionElements = mainContent.querySelectorAll(
      'div[class*="x1lliihq"], div[class*="x1heor9g"], div[class*="x193iq5w"]'
    );

    for (const element of descriptionElements) {
      const text = element.textContent.trim();
      console.log('Found potential description text:', text);

      // Validate that this is actually a description
      if (
        text &&
        text.length > 10 &&
        !text.includes('Marketplace') &&
        !text.includes('Browse') &&
        !text.includes('Notifications') &&
        !text.includes('Menu') &&
        !text.includes('See more') &&
        !text.includes('See less') &&
        !text.includes('PHP') && // Exclude price text
        !text.match(/^[₱]?\d+([,.]\d+)?/) && // Exclude price numbers
        !element.closest('button')
      ) {
        // Exclude button text
        console.log('Found valid description:', text);
        return text;
      }
    }
  }

  return null;
}

function extractImage() {
  console.log('Extracting image...');

  // Try finding image in the main content area
  const mainContent =
    document.querySelector('[role="main"]') ||
    document.querySelector('[data-pagelet="MarketplacePDP"]');
  if (mainContent) {
    // Look for image elements with specific classes or attributes
    const imageElements = mainContent.querySelectorAll(
      'img[src*="scontent"], img[src*="marketplace"], img[src*="fbcdn.net"]'
    );

    for (const element of imageElements) {
      const src = element.src;
      console.log('Found potential image src:', src);

      // Validate that this is actually a listing image
      if (
        src &&
        src.includes('fbcdn.net') &&
        !src.includes('profile') &&
        !src.includes('avatar') &&
        !src.includes('icon') &&
        !src.includes('emoji') &&
        !src.includes('sticker')
      ) {
        console.log('Found valid image:', src);
        // Get the highest resolution image by removing size parameters
        return src.split('?')[0];
      }
    }
  }

  return null;
}
