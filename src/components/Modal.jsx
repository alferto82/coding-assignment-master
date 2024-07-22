// src/components/Modal.js
import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/modal.scss'; // Crea un archivo de estilos para el modal

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // Asegúrate de que este div exista en tu HTML
  );
};

export default Modal;
