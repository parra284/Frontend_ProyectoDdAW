import React from 'react';

/**
 * Modal dialog for confirming product deletion
 * @param {Object} props - Component props
 * @param {Object} props.product - The product object to be deleted
 * @param {boolean} props.isOpen - Whether the modal is open or not
 * @param {Function} props.onConfirm - Function to call on confirmation with reason parameter
 * @param {Function} props.onCancel - Function to call on cancellation
 */
const DeleteConfirmationModal = ({ product, isOpen, onConfirm, onCancel }) => {
  const [reason, setReason] = React.useState('');
  const [otherReason, setOtherReason] = React.useState('');
  const [confirmText, setConfirmText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setReason('');
      setOtherReason('');
      setConfirmText('');
      setIsSubmitting(false);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Calculate final reason based on dropdown and other input
  const finalReason = reason === 'Other' ? `Other: ${otherReason}` : reason;
  
  // Check if user typed the correct confirmation text
  const isConfirmTextCorrect = product && confirmText === product.name;
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate a short delay for better UX
    setTimeout(() => {
      onConfirm(finalReason);
      setIsSubmitting(false);
    }, 500);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4 text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-lg font-bold">Delete Product?</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <p className="mb-4 text-gray-700">
            Are you sure you want to delete <span className="font-semibold">{product?.name}</span>?
            This action cannot be undone.
          </p>
          
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for deletion:
            </label>
            <select
              id="reason"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">-- Select reason --</option>
              <option value="Discontinued product">Discontinued product</option>
              <option value="Seasonal item no longer available">Seasonal item no longer available</option>
              <option value="Product replaced by newer model">Product replaced by newer model</option>
              <option value="Duplicate record">Duplicate record</option>
              <option value="Data entry error">Data entry error</option>
              <option value="Other">Other</option>
            </select>
              {reason === 'Other' && (
              <textarea
                className="w-full mt-2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="2"
                placeholder="Please specify the reason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                required={reason === 'Other'}
              ></textarea>
            )}
          </div>
          
          <div className="mb-5 mt-3">
            <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              To confirm deletion, type <span className="font-bold">{product?.name}</span>:
            </label>
            <input
              id="confirmation"
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${product?.name}" to confirm`}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
              disabled={
                !reason || 
                (reason === 'Other' && !otherReason) || 
                confirmText !== product?.name ||
                isSubmitting
              }
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Delete Forever
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
