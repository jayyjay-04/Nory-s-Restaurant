import { useState, useEffect } from "react";
import "./Header.css";
import LoginModal from "./LoginModal";
import RegisterMain1 from "./RegisterModal";
import LogoutModal from "./LogoutModal";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function LandingMainHeader() {
  const [active, setActive] = useState("Home");
  const [activeModal, setActiveModal] = useState(null);
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: "Home", id: "home" },
    { name: "Menu", id: "menu" },
    { name: "About Us", id: "about-us" },
    { name: "Contact", id: "contact-us" },
    { name: "Location", id: "location" },
  ];

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            const fullName = userData.fullname || "";

            const nameParts = fullName.trim().split(" ");
            const first = nameParts[0];
            const last = nameParts[nameParts.length - 1];

            setFirstName(first);
            setLastName(last);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setFirstName("");
        setLastName("");
      }
    });

    return () => unsubscribe();
  }, []);

  // Scroll to section when clicking menu item
  const handleScroll = (id, name) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setActive(name);
  };

  // Detect active section while scrolling
  useEffect(() => {
    const sections = menuItems.map((item) => document.getElementById(item.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const menuItem = menuItems.find((item) => item.id === id);
            if (menuItem) setActive(menuItem.name);
          }
        });
      },
      { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [menuItems]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav className="header">
        <div className="header__container">
          {/* Logo */}
          <div className="header__logo">
            <img src="Image/Norys-Logo.png" alt="No Logo Found" />
          </div>

          {/* Navigation */}
          <ul className="header__nav-list">
            {menuItems.map(({ name, id }) => (
              <li key={name}>
                <button
                  type="button"
                  className={`header__nav-link ${
                    active === name ? "header__nav-link--active" : ""
                  }`}
                  onClick={() => handleScroll(id, name)}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>

          {/* User / Auth Buttons */}
          <div className="header__actions">
            {user ? (
              <>
                <div className="header__user">
                  <img
                    className="header__user-icon"
                    src="./Image/user-icon.png"
                    alt=""
                  />
                  <span>
                    {firstName && lastName
                      ? `${firstName} ${lastName}`
                      : "User"}
                  </span>
                </div>
                <button
                  className="header__account-btn"
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                className="header__account-btn"
                type="button"
                onClick={() => setActiveModal("login")}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {activeModal === "login" && (
        <LoginModal
          onClose={() => setActiveModal(null)}
          onSwitchToRegister={() => setActiveModal("register")}
        />
      )}

      {/* Register Modal */}
      {activeModal === "register" && (
        <RegisterMain1
          onClose={() => setActiveModal(null)}
          onSwitchToLogin={() => setActiveModal("login")}
        />
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}

export default LandingMainHeader;
