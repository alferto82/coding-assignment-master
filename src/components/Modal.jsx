import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/modal.scss'; 

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" data-testid="modal-overlay">
      <div className="modal-content" data-testid="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') 
  );
};

export default Modal;
