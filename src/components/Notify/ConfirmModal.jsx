// 📂 src/hooks/useConfirm.js
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        onConfirm();
      } else if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onConfirm, onCancel]);

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
      onClick={onCancel}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-[10px] rounded-[5px] shadow-2xl w-80 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <p className="text-lg font-bold mb-6 font-nunito">{message}</p>
          <div className="w-full flex gap-4 justify-center">
            <button
              onClick={onCancel}
              className="w-6/12 px-4 py-2 rounded-[5px] bg-gray-300 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="w-6/12 px-4 py-2 rounded-[5px] bg-primary text-white hover:bg-red-600"
            >
              Xác nhận
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
};

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  const confirm = ({ message, onConfirm, onCancel }) => {
    setConfirmState({ message, onConfirm, onCancel });
  };

  const handleConfirm = () => {
    confirmState.onConfirm && confirmState.onConfirm();
    setConfirmState({ message: "", onConfirm: null, onCancel: null });
  };

  const handleCancel = () => {
    confirmState.onCancel && confirmState.onCancel();
    setConfirmState({ message: "", onConfirm: null, onCancel: null });
  };

  return {
    confirm,
    ConfirmComponent: () =>
      confirmState.message ? (
        <ConfirmModal
          message={confirmState.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ) : null,
  };
};

// 👉 Cách dùng trong component:
// const { confirm, ConfirmComponent } = useConfirm();
// confirm({
//   message: "Bạn có chắc muốn đăng xuất?",
//   onConfirm: () => logoutUser(),
// });
// Sau đó nhớ render <ConfirmComponent /> ở cuối JSX.
