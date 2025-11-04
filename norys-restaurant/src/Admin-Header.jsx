import React, { useState } from "react";
import { auth } from "./firebase";
import "./Admin-Header.css";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal"; // ✅ import your existing modal

function AdminHeader({ currentPage }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ modal state

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setShowLogoutModal(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getHeaderText = () => {
    switch (currentPage) {
      case "orders":
        return "ORDERS MANAGEMENT";
      case "menu":
        return "MENU MANAGEMENT";
      case "feedback":
        return "FEEDBACKS";
      default:
        return "DASHBOARD";
    }
  };

  return (
    <>
      <div className="admin-header__container">
        <div className="admin-header__content">
          <img src="Image/Norys-Logo01.png" alt="Logo" className="admin-logo" />

          <h2>{getHeaderText()}</h2>

          <button
            className="logout-btn"
            onClick={() => setShowLogoutModal(true)} // ✅ open modal
          >
            Log out
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}

export default AdminHeader;
