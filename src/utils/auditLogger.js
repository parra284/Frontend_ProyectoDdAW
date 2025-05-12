// Audit Logger for tracking system actions
import axios from 'axios';

const API_URL = 'https://back-db.vercel.app/api';

export const LogType = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  ACTION: 'ACTION'
};

export const LogAction = {
  PRODUCT_CREATED: 'PRODUCT_CREATED',
  PRODUCT_UPDATED: 'PRODUCT_UPDATED',
  PRODUCT_DELETED: 'PRODUCT_DELETED',
  STOCK_ADJUSTED: 'STOCK_ADJUSTED',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT'
};

/**
 * Log an action to the server's audit log system
 * @param {string} action - The action being performed (use LogAction enum)
 * @param {string} userId - The ID of the user performing the action
 * @param {string} details - Additional details about the action
 * @param {object} metadata - Any additional structured data to log
 * @returns {Promise<object>} - The response from the server
 */
export const logAuditEvent = async (action, userId, details = '', metadata = {}) => {
  try {
    const response = await axios.post(`${API_URL}/audit-logs`, {
      action,
      userId,
      details,
      metadata,
      timestamp: new Date().toISOString()
    });
    
    return response.data;
  } catch (error) {
    // Still log to console if API fails
    console.error('Failed to log audit event:', error);
    console.info('Audit event details:', { action, userId, details, metadata });
    
    // Store in localStorage as backup if API is unavailable
    const auditBackupLogs = JSON.parse(localStorage.getItem('auditBackupLogs') || '[]');
    auditBackupLogs.push({
      action,
      userId,
      details,
      metadata,
      timestamp: new Date().toISOString(),
      syncStatus: 'PENDING'
    });
    localStorage.setItem('auditBackupLogs', JSON.stringify(auditBackupLogs));
    
    return null;
  }
};

/**
 * Log product deletion to the audit system
 * @param {string} userId - The ID of the user performing the deletion
 * @param {object} product - The product being deleted
 * @param {string} reason - The reason for deletion
 * @returns {Promise<object>} The response from the server or null if logging failed
 */
export const logProductDeletion = async (userId, product, reason = '') => {
  // Add timestamp and more detailed information
  const timestamp = new Date().toISOString();
  const clientInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`
  };
  
  return logAuditEvent(
    LogAction.PRODUCT_DELETED,
    userId,
    `Product "${product.name}" (ID: ${product.id}) was deleted${reason ? `: ${reason}` : ''}`,
    {
      productId: product.id,
      productName: product.name,
      productSKU: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      reason,
      timestamp,
      clientInfo
    }
  );
};

export default {
  logAuditEvent,
  logProductDeletion,
  LogType,
  LogAction
};
