const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

router.post('/extract-data', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url.includes('facebook.com/marketplace')) {
      return res.status(400).json({ error: 'Invalid Facebook Marketplace URL' });
    }

    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set a user agent to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Wait for the content to load
    await page.waitForSelector('img[src*="scontent"]', { timeout: 5000 });

    // Get the page content
    const content = await page.content();
    const $ = cheerio.load(content);

    // Extract data
    const data = {
      image: $('img[src*="scontent"]').first().attr('src'),
      title: $('h1').first().text().trim(),
      description: $('div[data-ad-preview="message"]').text().trim(),
      price: $('span[data-ad-preview="price"]')
        .text()
        .trim()
        .replace(/[^0-9]/g, ''),
    };

    res.json(data);
  } catch (error) {
    console.error('Error extracting marketplace data:', error);
    res.status(500).json({ error: 'Failed to extract data from Facebook Marketplace' });
  }
});

module.exports = router;
