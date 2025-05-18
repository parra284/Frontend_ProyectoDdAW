const MobilePanel = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-end mt-15">
      <div className="w-full max-w-sm bg-white h-full shadow-lg p-6 overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default MobilePanel;
