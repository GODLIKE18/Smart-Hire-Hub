import React from "react";

// Enhanced modal with overlay and accessibility improvements
const ResumeModal = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full overflow-hidden">
        <button
          onClick={onClose}
          aria-label="Close resume preview"
          className="absolute top-3 right-3 h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xl font-bold"
        >
          ×
        </button>
        <div className="max-h-[80vh] overflow-auto">
          <img
            src={imageUrl}
            alt="resume preview"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
