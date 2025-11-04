import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPageFull from "./LandingPageFull";
import OrderDashboard from "./Order-Dashboard";
import AdminDashboard from "./Admin-Dashboard";
import ProfileView from "./Profile-View";
import LoginModal from "./LoginModal";
import AdminLogin from "./AdminLogin";
import AdminRoute from "./AdminRoute";
import { useAuth } from "./AuthContext";

function App() {
  const [showOrderPage, setShowOrderPage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();

  const handleOrderNow = () => {
    if (user) {
      setShowOrderPage(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleBackFromOrder = () => setShowOrderPage(false);
  const handleBackFromProfile = () => setShowProfile(false);

  return (
    <Routes>
      {/* Admin Login Route */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Protected Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Root Path - Landing + Order + Profile */}
      <Route
        path="/"
        element={
          <div>
            {showOrderPage ? (
              <OrderDashboard
                onBack={handleBackFromOrder}
                onProfileClick={() => setShowProfile(true)}
              />
            ) : showProfile ? (
              <ProfileView onBack={handleBackFromProfile} />
            ) : (
              <LandingPageFull onOrderNow={handleOrderNow} />
            )}

            {showLoginModal && (
              <LoginModal
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={() => setShowLoginModal(false)}
              />
            )}
          </div>
        }
      />
    </Routes>
  );
}

export default App;
