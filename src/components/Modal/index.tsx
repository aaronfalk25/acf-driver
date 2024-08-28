import React from "react";
import "./modal.css";

interface ModalProps {
    children: React.ReactNode;
    onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };

export default Modal;