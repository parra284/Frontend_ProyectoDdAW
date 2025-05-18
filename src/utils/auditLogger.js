// Audit Logger for tracking system actions
import apiClient from './apiClient';

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
  USER_LOGOUT: 'USER_LOGOUT',
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_UPDATED: 'ORDER_UPDATED',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  ORDER_PAYMENT_COMPLETED: 'ORDER_PAYMENT_COMPLETED'
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
    const response = await apiClient.post('/api/audit-logs', {
      action,
      userId,
      details,
      metadata,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw the error, just log it to the console
    // This way, if audit logging fails, it doesn't break the application
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

/**
 * Log stock adjustment to the audit system
 * @param {string} userId - The ID of the user performing the adjustment
 * @param {object} product - The product being adjusted
 * @param {number} quantity - The quantity changed (positive for additions, negative for subtractions)
 * @param {string} reason - The reason for adjustment
 * @returns {Promise<object>} The response from the server or null if logging failed
 */
export const logStockAdjustment = async (userId, product, quantity, reason = '') => {
  const adjustmentType = quantity >= 0 ? 'added to' : 'removed from';
  const absQuantity = Math.abs(quantity);
  const timestamp = new Date().toISOString();
  
  const details = `${absQuantity} units ${adjustmentType} product "${product.name}" (ID: ${product.id})${reason ? `: ${reason}` : ''}`;
  
  const clientInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`
  };
  
  return logAuditEvent(
    LogAction.STOCK_ADJUSTED,
    userId,
    details,
    {
      productId: product.id,
      productName: product.name,
      productSKU: product.sku || '',
      previousStock: product.stock,
      newStock: product.stock + quantity,
      quantity,
      reason,
      timestamp,
      clientInfo
    }
  );
};

/**
 * Log an order-related action
 * @param {string} userId - The ID of the user performing the action
 * @param {string} orderId - The ID of the order
 * @param {string} description - Description of the action
 * @param {object} metadata - Additional metadata about the action
 * @returns {Promise<object>} - The response from the server
 */
export const logOrderAction = async (userId, orderId, description, metadata = {}) => {
  try {
    const response = await apiClient.post('/api/audit-logs', {
      entityType: 'order',
      entityId: orderId,
      userId,
      action: 'order_action',
      description,
      metadata
    });
    return response.data;
  } catch (error) {
    console.error('Failed to log order action:', error);
    return null;
  }
};

/**
 * Log an order status change
 * @param {string} userId - The ID of the user performing the action
 * @param {string} orderId - The ID of the order
 * @param {string} previousStatus - The previous status
 * @param {string} newStatus - The new status
 * @returns {Promise<object>} - The response from the server
 */
export const logOrderStatusChange = async (userId, orderId, previousStatus, newStatus) => {
  const description = `Order status changed from ${previousStatus} to ${newStatus}`;
  return logOrderAction(userId, orderId, description, {
    action: 'status_change',
    previousStatus,
    newStatus,
    timestamp: new Date().toISOString()
  });
};

/**
 * Log an order cancellation
 * @param {string} userId - The ID of the user cancelling the order
 * @param {string} orderId - The ID of the order
 * @param {string} reason - The reason for cancellation
 * @returns {Promise<object>} - The response from the server
 */
export const logOrderCancellation = async (userId, orderId, reason = '') => {
  const description = reason ? `Order cancelled: ${reason}` : 'Order cancelled';
  return logOrderAction(userId, orderId, description, {
    action: 'order_cancelled',
    reason,
    timestamp: new Date().toISOString()
  });
};

export default {
  logAuditEvent,
  logProductDeletion,
  logStockAdjustment,
  logOrderAction,
  logOrderStatusChange,
  logOrderCancellation,
  LogType,
  LogAction
};
