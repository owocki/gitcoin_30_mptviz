import express from 'express';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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

// Preview image generation endpoint
app.get('/api/preview', async (req, res) => {
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
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Hide the sidebar and footer controls, make visualization full screen
    await page.evaluate(() => {
      // Hide sidebar
      const sidebar = document.querySelector('[style*="width: 320px"]');
      if (sidebar) sidebar.style.display = 'none';

      // Find and hide footer controls by checking computed styles
      const allDivs = document.querySelectorAll('div');
      allDivs.forEach(div => {
        const style = window.getComputedStyle(div);
        // Look for the controls bar (has backgroundColor #1a1d23, borderTop, and flex display)
        if (style.backgroundColor === 'rgb(26, 29, 35)' &&
            style.borderTopWidth !== '0px' &&
            style.display === 'flex' &&
            style.padding === '15px') {
          div.style.display = 'none';
        }
      });

      // Make the Scene component container full screen
      const sceneContainer = Array.from(document.querySelectorAll('div')).find(div => {
        const style = window.getComputedStyle(div);
        return style.display === 'flex' &&
               style.flexDirection === 'column' &&
               style.backgroundColor === 'rgb(10, 12, 16)';
      });

      if (sceneContainer) {
        sceneContainer.style.position = 'fixed';
        sceneContainer.style.top = '0';
        sceneContainer.style.left = '0';
        sceneContainer.style.width = '100vw';
        sceneContainer.style.height = '100vh';
      }

      // Make canvas wrapper fill entire space
      const canvasWrapper = document.querySelector('[style*="position: relative"]');
      if (canvasWrapper) {
        canvasWrapper.style.width = '100vw';
        canvasWrapper.style.height = '100vh';
      }

      // Ensure canvas element fills the wrapper
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
      }
    });

    // Wait a bit more for canvas to resize and re-render
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Trigger a resize event to make the renderer update
    await page.evaluate(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Wait for the resize to take effect
    await new Promise(resolve => setTimeout(resolve, 500));

    // Take screenshot of just the visualization
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

// Serve static files from dist
app.use(express.static(resolve(__dirname, 'dist')));

// Handle all routes with dynamic meta tags
app.get('*', async (req, res) => {
  try {
    const cfg = req.query.cfg || '';
    let html = fs.readFileSync(resolve(__dirname, 'dist/index.html'), 'utf-8');

    // Get the full URL for the preview image
    const protocol = req.protocol;
    const host = req.get('host');
    const previewUrl = cfg
      ? `${protocol}://${host}/api/preview?cfg=${encodeURIComponent(cfg)}`
      : `${protocol}://${host}/api/preview`;

    const fullUrl = `${protocol}://${host}${req.originalUrl}`;

    // Replace placeholder meta tags with dynamic ones
    html = html
      .replace(
        '<meta property="og:image" content="/preview.png">',
        `<meta property="og:image" content="${previewUrl}">`
      )
      .replace(
        '<meta property="og:url" content="https://yourdomain.com/">',
        `<meta property="og:url" content="${fullUrl}">`
      )
      .replace(
        '<meta name="twitter:image" content="/preview.png">',
        `<meta name="twitter:image" content="${previewUrl}">`
      );

    res.send(html);
  } catch (error) {
    console.error('Error serving HTML:', error);
    res.status(500).send('Error loading page');
  }
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  if (browserInstance) {
    await browserInstance.close();
  }
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Production server running at http://localhost:${PORT}`);
});
