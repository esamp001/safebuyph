const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.post('/extract', async (req, res) => {
  let browser;
  try {
    const { url } = req.body;

    if (!url.includes('facebook.com/marketplace')) {
      return res.status(400).json({ error: 'Invalid Facebook Marketplace URL' });
    }

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Check for login page
    const isLoginPage = await page.evaluate(() => {
      return document.querySelector('input[name="email"]') !== null;
    });

    if (isLoginPage) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'This listing requires Facebook authentication',
      });
    }

    // Try multiple selectors for each element
    const data = await page.evaluate(() => {
      const getElementText = (selectors) => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) return element.textContent.trim();
        }
        return null;
      };

      const getImageSrc = (selectors) => {
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) return element.src;
        }
        return null;
      };

      return {
        image: getImageSrc([
          'img[src*="scontent"]',
          'img[src*="marketplace"]',
          'img[src*="facebook"]',
        ]),
        title: getElementText(['h1', '[data-ad-preview="title"]', '.marketplace-listing-title']),
        description: getElementText([
          'div[data-ad-preview="message"]',
          '.marketplace-listing-description',
        ]),
        price: getElementText([
          'span[data-ad-preview="price"]',
          '.marketplace-listing-price',
        ])?.replace(/[^0-9]/g, ''),
      };
    });

    await browser.close();
    res.json(data);
  } catch (error) {
    console.error('Error extracting marketplace data:', error);
    if (browser) await browser.close();
    res.status(500).json({
      error: 'Failed to extract data from Facebook Marketplace',
      details: error.message,
    });
  }
});

module.exports = router;
