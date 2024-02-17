// AddToCartModal.js

import { useRouter } from "next/navigation";
import "./dong.css"

const AlertModal = ({ message,closeModal,router }) => {
  const routerr=useRouter()

  const handleConfirm = () => {
    
    closeModal();
    if(router){
    routerr.push(router)}
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <p>{message} </p>
          <button className="modal-confirm-btn" onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
