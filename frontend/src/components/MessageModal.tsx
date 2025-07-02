"use client";

interface MessageModalProps {
    message: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function MessageModal({ message, isOpen, onClose }: MessageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 text-center">
        <p className="text-gray-700 mb-6 text-lg">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}