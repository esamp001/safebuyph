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
        } else {
          data.description = 'No description';
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
    // First try to find the details section specifically
    const detailsSection =
      mainContent.querySelector('div[data-ad-preview="message"]') ||
      mainContent.querySelector('div[data-adid]') ||
      mainContent.querySelector('div[data-pagelet="MarketplacePDP"] div[dir="auto"]');

    if (detailsSection) {
      const text = detailsSection.textContent.trim();
      console.log('Found details section:', text);

      // Skip if it's too short or contains sponsored content
      if (text && text.length >= 10 && !text.includes('Sponsored')) {
        // Clean up the description
        let cleanedText = text
          .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
          .replace(/Details/g, '') // Remove "Details" prefix
          .replace(/Condition:/g, 'Condition: ') // Format condition
          .replace(/Rfs:/g, 'Reason for selling: ') // Format RFS
          .replace(/Brand:/g, 'Brand: ') // Format brand
          .replace(/Specs:/g, 'Specifications: ') // Format specs
          .trim();

        if (cleanedText) {
          console.log('Found valid description:', cleanedText);
          return cleanedText;
        }
      }
    }

    // If we couldn't find the details section, try the fallback method
    const descriptionElements = mainContent.querySelectorAll(
      'div[class*="x1lliihq"], div[class*="x1heor9g"], div[class*="x193iq5w"]'
    );

    let fullDescription = '';
    let structuredData = {
      condition: '',
      brand: '',
      specifications: [],
      otherDetails: [],
    };

    for (const element of descriptionElements) {
      const text = element.textContent.trim();
      console.log('Found potential description text:', text);

      // Skip invalid elements
      if (
        !text ||
        text.length < 10 ||
        text.includes('Marketplace') ||
        text.includes('Browse') ||
        text.includes('Notifications') ||
        text.includes('Menu') ||
        text.includes('See more') ||
        text.includes('See less') ||
        text.includes('PHP') ||
        text.includes('Sponsored') || // Skip sponsored content
        text.match(/^[₱]?\d+([,.]\d+)?/) ||
        element.closest('button')
      ) {
        continue;
      }

      // Extract structured data
      if (text.toLowerCase().includes('condition:')) {
        structuredData.condition = text.split('condition:')[1].trim();
      } else if (text.toLowerCase().includes('brand:')) {
        structuredData.brand = text.split('brand:')[1].trim();
      } else if (
        text.toLowerCase().includes('specs:') ||
        text.toLowerCase().includes('specifications:')
      ) {
        const specs = text.split(/specs:|specifications:/i)[1].trim();
        structuredData.specifications = specs.split(',').map((spec) => spec.trim());
      } else if (
        text.toLowerCase().includes('rfs:') ||
        text.toLowerCase().includes('reason for selling:')
      ) {
        structuredData.otherDetails.push(
          'Reason for selling: ' + text.split(/rfs:|reason for selling:/i)[1].trim()
        );
      } else {
        // Add to full description if it's not a structured field
        if (!fullDescription.includes(text)) {
          fullDescription += (fullDescription ? '\n\n' : '') + text;
        }
      }
    }

    // Clean up the full description
    fullDescription = fullDescription
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .replace(/Details/g, '') // Remove "Details" prefix
      .replace(/Condition:/g, 'Condition: ') // Format condition
      .replace(/Rfs:/g, 'Reason for selling: ') // Format RFS
      .replace(/Brand:/g, 'Brand: ') // Format brand
      .replace(/Specs:/g, 'Specifications: ') // Format specs
      .trim();

    // Combine structured data with full description
    let finalDescription = fullDescription;

    // Add structured data if available
    if (structuredData.condition) {
      finalDescription = `Condition: ${structuredData.condition}\n\n${finalDescription}`;
    }
    if (structuredData.brand) {
      finalDescription = `Brand: ${structuredData.brand}\n\n${finalDescription}`;
    }
    if (structuredData.specifications.length > 0) {
      finalDescription = `Specifications:\n${structuredData.specifications.join('\n')}\n\n${finalDescription}`;
    }
    if (structuredData.otherDetails.length > 0) {
      finalDescription = `${structuredData.otherDetails.join('\n')}\n\n${finalDescription}`;
    }

    // Remove any duplicate sections
    finalDescription = finalDescription
      .split('\n\n')
      .filter((section, index, self) => self.indexOf(section) === index)
      .join('\n\n')
      .trim();

    if (finalDescription) {
      console.log('Found valid description:', finalDescription);
      return finalDescription;
    }
  }

  console.log('No description found, returning default message');
  return 'No description';
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

function injectButtonsToMarketplaceImages() {
  // Select all images that represent items (update selector as needed)
  const images = document.querySelectorAll('img.x168nmei');
  images.forEach((img) => {
    // Find the clickable parent (usually an <a> tag)
    const parent = img.closest('a');
    if (!parent) return;

    // Prevent duplicate buttons
    if (parent.querySelector('.safebuyph-btn')) return;

    // Try to extract the title from the alt attribute
    const title = img.alt || '';
    const image = img.src;
    const url = parent.href;

    // Create the button
    const btn = document.createElement('button');
    btn.textContent = 'Buy this item on SafeBuy PH';
    btn.className = 'safebuyph-btn';
    btn.style = `
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 9999;
      background: linear-gradient(90deg, #1eafd0 60%, #0b92bc 100%);
      color: #fff;
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(30,175,208,0.15), 0 1.5px 4px rgba(0,0,0,0.10);
      transition: background 0.2s, transform 0.1s;
      outline: none;
    `;
    btn.onmouseover = () => {
      btn.style.background = 'linear-gradient(90deg, #0b92bc 60%, #1eafd0 100%)';
      btn.style.transform = 'scale(1.05)';
    };
    btn.onmouseout = () => {
      btn.style.background = 'linear-gradient(90deg, #1eafd0 60%, #0b92bc 100%)';
      btn.style.transform = 'scale(1)';
    };

    // Make parent position:relative so button overlays correctly
    parent.style.position = 'relative';

    // On click, open SafeBuy PH with the item data
    btn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const data = encodeURIComponent(JSON.stringify({ title, image, url }));
      window.open(`http://localhost:5173/transaction/new?data=${data}`, '_blank');
    };

    // Append the button to the parent container
    parent.appendChild(btn);
  });
}

// Run on page load and when the DOM changes (for infinite scroll)
injectButtonsToMarketplaceImages();
const observer = new MutationObserver(injectButtonsToMarketplaceImages);
observer.observe(document.body, { childList: true, subtree: true });
