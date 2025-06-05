const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const { PrismaClient } = require('../generated/prisma');
const auth = require('../middleware/auth');

// Initialize Prisma client
const prisma = new PrismaClient();

// Handle Prisma connection errors
prisma.$on('error', (e) => {
  console.error('Prisma Error:', e);
});

router.post('/extract', auth, async (req, res) => {
  let browser;
  try {
    const { url } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { facebookId: true },
    });

    if (!user?.facebookId) {
      return res.status(401).json({ error: 'Facebook authentication required' });
    }

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

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Check if we're on a login page
    const isLoginPage = await page.evaluate(() => {
      return document.querySelector('input[name="email"]') !== null;
    });

    if (isLoginPage) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'This listing requires Facebook authentication',
      });
    }

    // Extract data with multiple selector attempts
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
          '[data-ad-preview="image"] img',
          '.marketplace-listing-image img',
        ]),
        title: getElementText([
          'h1',
          '[data-ad-preview="title"]',
          '.marketplace-listing-title',
          '[data-testid="marketplace_listing_title"]',
        ]),
        description: getElementText([
          'div[data-ad-preview="message"]',
          '.marketplace-listing-description',
          '[data-testid="marketplace_listing_description"]',
        ]),
        price: getElementText([
          'span[data-ad-preview="price"]',
          '.marketplace-listing-price',
          '[data-testid="marketplace_listing_price"]',
        ])?.replace(/[^0-9]/g, ''),
      };
    });

    // Log the extracted data for debugging
    console.log('Extracted data:', data);

    // Validate that we got at least some data
    if (!data.title && !data.price) {
      throw new Error('Could not extract required data from the listing');
    }

    await browser.close();
    res.json(data);
  } catch (error) {
    console.error('Error extracting marketplace data:', error);
    if (browser) await browser.close();
    res.status(500).json({
      error: 'Failed to extract data from Facebook Marketplace',
      details: error.message,
    });
  } finally {
    // Ensure Prisma connection is properly closed
    await prisma.$disconnect();
  }
});

module.exports = router;
