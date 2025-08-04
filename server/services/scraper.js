const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const pool = require('../config/database');

class WebScraper {
  constructor() {
    this.browser = null;
  }

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Scrape product prices from multiple stores
  async scrapeProductPrices(productName, stores = []) {
    try {
      await this.init();
      const results = [];

      for (const store of stores) {
        try {
          const storeResult = await this.scrapeStore(store, productName);
          if (storeResult) {
            results.push(storeResult);
          }
        } catch (error) {
          console.error(`Error scraping ${store.name}:`, error.message);
        }
      }

      return results;
    } catch (error) {
      console.error('Scraping error:', error);
      throw error;
    }
  }

  // Scrape individual store
  async scrapeStore(store, productName) {
    const page = await this.browser.newPage();
    
    try {
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Navigate to store search page
      const searchUrl = this.getSearchUrl(store.domain, productName);
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for search results to load
      await page.waitForSelector(this.getProductSelector(store.domain), { timeout: 10000 });
      
      // Extract product information
      const products = await page.evaluate((selector, storeName) => {
        const elements = document.querySelectorAll(selector);
        const results = [];
        
        elements.forEach((element, index) => {
          if (index < 5) { // Limit to first 5 results
            const priceElement = element.querySelector('[data-price], .price, .fiyat');
            const titleElement = element.querySelector('h3, .title, .urun-adi');
            const linkElement = element.querySelector('a');
            
            if (priceElement && titleElement) {
              const price = priceElement.textContent.trim().replace(/[^\d,.]/g, '');
              const title = titleElement.textContent.trim();
              const link = linkElement ? linkElement.href : '';
              
              results.push({
                store: storeName,
                title,
                price: parseFloat(price.replace(',', '.')),
                url: link
              });
            }
          }
        });
        
        return results;
      }, this.getProductSelector(store.domain), store.name);
      
      return products;
      
    } catch (error) {
      console.error(`Error scraping ${store.name}:`, error.message);
      return null;
    } finally {
      await page.close();
    }
  }

  // Get search URL for different stores
  getSearchUrl(domain, productName) {
    const searchTerm = encodeURIComponent(productName);
    
    switch (domain) {
      case 'trendyol.com':
        return `https://www.trendyol.com/sr?q=${searchTerm}`;
      case 'hepsiburada.com':
        return `https://www.hepsiburada.com/ara?q=${searchTerm}`;
      case 'amazon.com.tr':
        return `https://www.amazon.com.tr/s?k=${searchTerm}`;
      case 'n11.com':
        return `https://www.n11.com/arama?q=${searchTerm}`;
      case 'gittigidiyor.com':
        return `https://www.gittigidiyor.com/arama?k=${searchTerm}`;
      default:
        return `https://${domain}/search?q=${searchTerm}`;
    }
  }

  // Get product selector for different stores
  getProductSelector(domain) {
    switch (domain) {
      case 'trendyol.com':
        return '.p-card-wrppr';
      case 'hepsiburada.com':
        return '.productListContent-item';
      case 'amazon.com.tr':
        return '[data-component-type="s-search-result"]';
      case 'n11.com':
        return '.productItem';
      case 'gittigidiyor.com':
        return '.product-item';
      default:
        return '.product, .item, .card';
    }
  }

  // Update product prices in database
  async updateProductPrices(productId, prices) {
    try {
      for (const price of prices) {
        // Find or create store
        let storeId = await this.getOrCreateStore(price.store);
        
        // Update or insert price
        const upsertQuery = `
          INSERT INTO product_prices (product_id, store_id, price, product_url, last_updated)
          VALUES ($1, $2, $3, $4, NOW())
          ON CONFLICT (product_id, store_id)
          DO UPDATE SET 
            price = EXCLUDED.price,
            product_url = EXCLUDED.product_url,
            last_updated = NOW()
        `;
        
        await pool.query(upsertQuery, [
          productId,
          storeId,
          price.price,
          price.url
        ]);
      }
      
      console.log(`Updated prices for product ${productId}`);
    } catch (error) {
      console.error('Error updating product prices:', error);
      throw error;
    }
  }

  // Get or create store
  async getOrCreateStore(storeName) {
    try {
      // Try to find existing store
      let result = await pool.query(
        'SELECT id FROM stores WHERE name ILIKE $1',
        [storeName]
      );
      
      if (result.rows.length > 0) {
        return result.rows[0].id;
      }
      
      // Create new store
      result = await pool.query(
        'INSERT INTO stores (name, domain) VALUES ($1, $2) RETURNING id',
        [storeName, `${storeName.toLowerCase().replace(/\s+/g, '')}.com`]
      );
      
      return result.rows[0].id;
    } catch (error) {
      console.error('Error getting/creating store:', error);
      throw error;
    }
  }
}

// Export singleton instance
const scraper = new WebScraper();

// Graceful shutdown
process.on('SIGINT', async () => {
  await scraper.close();
  process.exit(0);
});

module.exports = scraper;