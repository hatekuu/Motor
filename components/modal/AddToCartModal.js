// AddToCartModal.js
import React from 'react';
import "./dong.css"
const AddToCartModal = ({ productCode, closeModal }) => {
  const handleConfirm = () => {
    closeModal();
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <p>{productCode.message} </p>
          <button className="modal-confirm-btn" onClick={handleConfirm}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
