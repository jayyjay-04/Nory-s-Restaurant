// LogoutModal.js
import React from "react";

function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className="logout-modal__overlay" onClick={onClose}>
      <div
        className="logout-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="logout-modal__close-btn" onClick={onClose}>
          ×
        </button>
        <h2 className="logout-modal__title">Confirm Log out?</h2>
        <div className="logout-modal__actions">
          <button
            className="logout-modal__btn logout-modal__btn--confirm"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
