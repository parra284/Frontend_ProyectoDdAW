import { showNotification } from "./NotificationSystem";

/**
 * Utility to manage stock notifications and alerts throughout the application
 */
class StockNotificationManager {
  constructor() {
    this.seenAlerts = new Set(); // Track already shown notifications
    this.lowStockThreshold = 10; // Default low stock threshold
    this.checkInterval = null;
  }

  /**
   * Start monitoring products for low stock alerts
   * @param {Function} fetchProductsCallback - Function to fetch the latest products
   * @param {number} intervalSeconds - How often to check (in seconds)
   */
  startMonitoring(fetchProductsCallback, intervalSeconds = 300) {
    // Clear any existing interval
    this.stopMonitoring();
    
    // Set up periodic checks
    this.checkInterval = setInterval(() => {
      this.checkStockLevels(fetchProductsCallback);
    }, intervalSeconds * 1000);
    
    // Do an initial check
    this.checkStockLevels(fetchProductsCallback);
    
    return () => this.stopMonitoring();
  }
  
  /**
   * Stop monitoring for low stock alerts
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
  
  /**
   * Check current stock levels and show alerts for low stock items
   * @param {Function} fetchProductsCallback - Function to fetch the latest products data
   */
  async checkStockLevels(fetchProductsCallback) {
    try {
      const products = await fetchProductsCallback();
      
      if (!products || products.length === 0) return;
      
      // Get products with low stock that haven't been notified yet
      const lowStockProducts = products.filter(product => {
        // Use product's threshold if available, otherwise use default
        const threshold = product.lowStockThreshold || this.lowStockThreshold;
        
        // Check if stock is low and we haven't already sent an alert for this product
        const isLow = product.stock > 0 && product.stock <= threshold;
        const alertKey = `${product.id}-${product.stock}`;
        const isNew = !this.seenAlerts.has(alertKey);
        
        if (isLow && isNew) {
          this.seenAlerts.add(alertKey);
          return true;
        }
        
        return false;
      });
      
      // Show alert if there are low stock products
      if (lowStockProducts.length > 0) {
        this.showLowStockAlert(lowStockProducts);
      }
      
      // Check for out of stock products
      const outOfStockProducts = products.filter(product => {
        const alertKey = `${product.id}-outofstock`;
        const isOutOfStock = product.stock === 0;
        const isNew = !this.seenAlerts.has(alertKey);
        
        if (isOutOfStock && isNew) {
          this.seenAlerts.add(alertKey);
          return true;
        }
        
        return false;
      });
      
      // Show alert if there are out of stock products
      if (outOfStockProducts.length > 0) {
        this.showOutOfStockAlert(outOfStockProducts);
      }
    } catch (error) {
      console.error("Error checking stock levels:", error);
    }
  }
  
  /**
   * Display a notification for products that are low in stock
   * @param {Array} lowStockProducts - Products with low stock levels
   */
  showLowStockAlert(lowStockProducts) {
    if (lowStockProducts.length === 1) {
      const product = lowStockProducts[0];
      showNotification(
        `Low Stock Alert: ${product.name}`,
        `Only ${product.stock} units remaining (threshold: ${product.lowStockThreshold || this.lowStockThreshold})`,
        'warning',
        8000
      );
    } else {
      showNotification(
        `Low Stock Alert: Multiple Products`,
        `${lowStockProducts.length} products have low stock levels`,
        'warning',
        8000
      );
    }
  }
  
  /**
   * Display a notification for products that are out of stock
   * @param {Array} outOfStockProducts - Products that are out of stock
   */
  showOutOfStockAlert(outOfStockProducts) {
    if (outOfStockProducts.length === 1) {
      const product = outOfStockProducts[0];
      showNotification(
        `Out of Stock: ${product.name}`,
        `Product is now out of stock and requires immediate attention`,
        'error',
        10000
      );
    } else {
      showNotification(
        `Out of Stock Alert: Multiple Products`,
        `${outOfStockProducts.length} products are now out of stock`,
        'error',
        10000
      );
    }
  }
  
  /**
   * Reset the alert history to allow notifications to show again
   */
  resetAlertHistory() {
    this.seenAlerts.clear();
  }
  
  /**
   * Update the default low stock threshold
   * @param {number} threshold - New threshold value
   */
  setLowStockThreshold(threshold) {
    if (typeof threshold === 'number' && threshold >= 0) {
      this.lowStockThreshold = threshold;
    }
  }
}

// Create a singleton instance
const stockNotificationManager = new StockNotificationManager();
export default stockNotificationManager;
