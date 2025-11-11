import { defineConfig, Plugin, ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import puppeteer from 'puppeteer'

// Browser instance cache
let browserInstance: any = null;

async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  }
  return browserInstance;
}

const htmlMetaTagsPlugin = (): Plugin => ({
  name: 'html-meta-tags',
  transformIndexHtml(html, ctx) {
    // Get query parameters from the request
    const url = new URL(ctx.originalUrl || '/', 'http://localhost');
    const cfg = url.searchParams.get('cfg') || '';

    const protocol = 'http';
    const host = process.env.VITE_HOST || 'localhost:5173';
    const previewUrl = cfg
      ? `${protocol}://${host}/api/preview?cfg=${encodeURIComponent(cfg)}`
      : `${protocol}://${host}/api/preview`;

    const fullUrl = `${protocol}://${host}${ctx.originalUrl || '/'}`;

    // Replace placeholder meta tags with dynamic ones
    return html
      .replace(
        '<meta property="og:image" content="/preview.png" />',
        `<meta property="og:image" content="${previewUrl}" />`
      )
      .replace(
        '<meta property="og:url" content="https://yourdomain.com/" />',
        `<meta property="og:url" content="${fullUrl}" />`
      )
      .replace(
        '<meta name="twitter:image" content="/preview.png" />',
        `<meta name="twitter:image" content="${previewUrl}" />`
      );
  },
  configureServer(server: ViteDevServer) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url?.startsWith('/api/preview')) {
        try {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const cfg = url.searchParams.get('cfg') || '';
          const PORT = 5173;
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
            if (sidebar) (sidebar as HTMLElement).style.display = 'none';

            // Find and hide footer controls by checking computed styles
            const allDivs = document.querySelectorAll('div');
            allDivs.forEach(div => {
              const style = window.getComputedStyle(div);
              // Look for the controls bar (has backgroundColor #1a1d23, borderTop, and flex display)
              if (style.backgroundColor === 'rgb(26, 29, 35)' &&
                  style.borderTopWidth !== '0px' &&
                  style.display === 'flex' &&
                  style.padding === '15px') {
                (div as HTMLElement).style.display = 'none';
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
              (sceneContainer as HTMLElement).style.position = 'fixed';
              (sceneContainer as HTMLElement).style.top = '0';
              (sceneContainer as HTMLElement).style.left = '0';
              (sceneContainer as HTMLElement).style.width = '100vw';
              (sceneContainer as HTMLElement).style.height = '100vh';
            }

            // Make canvas wrapper fill entire space
            const canvasWrapper = document.querySelector('[style*="position: relative"]');
            if (canvasWrapper) {
              (canvasWrapper as HTMLElement).style.width = '100vw';
              (canvasWrapper as HTMLElement).style.height = '100vh';
            }

            // Ensure canvas element fills the wrapper
            const canvas = document.querySelector('canvas');
            if (canvas) {
              (canvas as HTMLElement).style.width = '100%';
              (canvas as HTMLElement).style.height = '100%';
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
          res.setHeader('Content-Type', 'image/png');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.end(screenshot);
        } catch (error) {
          console.error('Error generating preview:', error);
          res.statusCode = 500;
          res.end('Error generating preview');
        }
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), htmlMetaTagsPlugin()],
  worker: {
    format: 'es'
  },
  optimizeDeps: {
    include: ['tailwind-variants']
  },
  build: {
    commonjsOptions: {
      include: [/tailwind-variants/, /node_modules/]
    }
  }
})
