import "./Order-Header.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import LogoutModal from "./LogoutModal"; // ✅ import existing modal

function OrderHeader({
  currentPage,
  onBack,
  onMenuClick,
  onOrdersClick,
  onBillingClick,
  onProfileClick,
}) {
  const [firstName, setFirstName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const fullName = docSnap.data().fullname || "";
            const first = fullName.trim().split(" ")[0]; // get first name
            setFirstName(first);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setFirstName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutModal(false);
      onBack();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <header className="order-header">
        <div className="order-header__container">
          <div
            className="order-header__logo"
            onClick={onBack}
            style={{ cursor: "pointer" }}
          >
            <img src="Image/Norys-Logo.png" alt="No Logo Found" />
          </div>

          <nav>
            <ul className="order-header__nav-list">
              <li>
                <a
                  href="#"
                  className={`order-header__nav-link ${
                    currentPage === "menu"
                      ? "order-header__nav-link--active"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    onMenuClick();
                  }}
                >
                  <img
                    className="order-header__nav-icon"
                    src="./Image/menu-icon.png"
                    alt=""
                  />{" "}
                  Menu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`order-header__nav-link ${
                    currentPage === "orders"
                      ? "order-header__nav-link--active"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    onOrdersClick();
                  }}
                >
                  <img
                    className="order-header__nav-icon"
                    src="./Image/tray-icon.png"
                    alt=""
                  />{" "}
                  Orders
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`order-header__nav-link ${
                    currentPage === "billing"
                      ? "order-header__nav-link--active"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    onBillingClick();
                  }}
                >
                  <img
                    className="order-header__nav-icon"
                    src="./Image/bill-icon.png"
                    alt=""
                  />{" "}
                  Billing
                </a>
              </li>
            </ul>
          </nav>

          <div className="order-header__actions">
            <div
              className="order-header__user"
              onClick={onProfileClick}
              style={{ cursor: "pointer" }}
            >
              <img
                className="order-header__nav-icon"
                src="./Image/user-icon.png"
                alt=""
              />
              <span>{firstName || "User"}</span> {/* ✅ fixed variable */}
            </div>

            <button
              className="order-header__logout-btn"
              onClick={() => setShowLogoutModal(true)}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}

export default OrderHeader;
