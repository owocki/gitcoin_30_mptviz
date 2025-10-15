import express from 'express';
import { createServer as createViteServer } from 'vite';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5173;

// Cache for browser instance
let browserInstance = null;

async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  }
  return browserInstance;
}

async function startServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // Preview image generation endpoint - MUST be before Vite middleware
  app.use('/api/preview', async (req, res) => {
    try {
      const cfg = req.query.cfg || '';
      const baseUrl = `http://localhost:${PORT}`;
      const targetUrl = cfg ? `${baseUrl}/?cfg=${encodeURIComponent(cfg)}` : baseUrl;

      console.log(`Generating preview for: ${targetUrl}`);

      const browser = await getBrowser();
      const page = await browser.newPage();

      // Set viewport for Twitter card (1200x630)
      await page.setViewport({ width: 1200, height: 630 });

      // Navigate to the page
      await page.goto(targetUrl, {
        waitUntil: 'networkidle0',
        timeout: 10000
      });

      // Wait a bit for the canvas to render
      await page.waitForTimeout(2000);

      // Take screenshot
      const screenshot = await page.screenshot({
        type: 'png',
        encoding: 'binary'
      });

      await page.close();

      // Send the image
      res.set('Content-Type', 'image/png');
      res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(screenshot);
    } catch (error) {
      console.error('Error generating preview:', error);
      res.status(500).send('Error generating preview');
    }
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  if (browserInstance) {
    await browserInstance.close();
  }
  process.exit(0);
});

startServer();
