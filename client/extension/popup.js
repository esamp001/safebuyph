document.addEventListener('DOMContentLoaded', function () {
  const importButton = document.getElementById('importButton');
  const statusDiv = document.getElementById('status');
  const previewDiv = document.getElementById('preview');

  // Check if user is logged in to SafeBuy PH
  async function checkSafeBuyLogin() {
    try {
      const response = await fetch('http://localhost:3000/api/auth/check', {
        credentials: 'include',
      });
      const data = await response.json();
      return data.isAuthenticated;
    } catch (error) {
      console.error('Login check error:', error);
      return false;
    }
  }

  // Function to show status messages
  function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
  }

  // Function to update preview
  function updatePreview(data) {
    console.log('Preview data:', data);
    previewDiv.innerHTML = `
      <h3>Preview:</h3>
      <p><strong>Title:</strong> ${data.title || 'Not found'}</p>
      <p><strong>Price:</strong> ${data.price ? '₱' + data.price : 'Not found'}</p>
      <p><strong>Description:</strong> ${data.description || 'Not found'}</p>
      ${data.image ? `<img src="${data.image}" style="max-width: 100%;">` : ''}
    `;
  }

  // Function to store data in extension storage
  async function storeData(data) {
    try {
      await chrome.storage.local.set({ safebuyData: data });
      console.log('Data stored in extension storage');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }

  // Handle import button click
  importButton.addEventListener('click', async () => {
    try {
      showStatus('Checking login status...', 'info');

      // Check if user is logged in
      const isLoggedIn = await checkSafeBuyLogin();

      if (!isLoggedIn) {
        showStatus('Please log in to SafeBuy PH first', 'error');
        // Redirect to login page
        chrome.tabs.create({ url: 'http://localhost:5173/login' });
        return;
      }

      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Check if we're on Facebook Marketplace
      if (!tab.url.includes('facebook.com/marketplace')) {
        showStatus('Please navigate to a Facebook Marketplace listing', 'error');
        return;
      }

      showStatus('Importing...', 'info');

      // Inject the content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js'],
      });

      // Wait a moment for the script to initialize
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Send message to content script to extract data
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractData' });

      if (response.success) {
        // Store the data in extension storage
        await storeData(response.data);

        // Update the preview
        updatePreview(response.data);
        showStatus('Data extracted successfully!', 'success');

        // Open SafeBuy in a new tab with the data
        const encodedData = encodeURIComponent(
          JSON.stringify({
            title: response.data.title,
            price: response.data.price,
            description: response.data.description,
            image: response.data.image,
            url: response.data.url,
          })
        );

        chrome.tabs.create({
          url: `http://localhost:5173/transaction/new?data=${encodedData}`,
        });
      } else {
        showStatus('Failed to extract data: ' + response.error, 'error');
      }
    } catch (error) {
      console.error('Extension error:', error);
      showStatus('Error: ' + error.message, 'error');
    }
  });
});
