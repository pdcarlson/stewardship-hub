// /src/components/ui/Modal.jsx
// (create this new file in the 'ui' folder)
// a generic modal component that can be used anywhere.
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // effect to handle closing the modal with the 'escape' key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    // backdrop: updated classes for blur effect
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* modal content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;