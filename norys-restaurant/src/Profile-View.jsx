import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import "./Profile-View.css";
import PropTypes from "prop-types";
import LoginModal from "./LoginModal";

function ProfileView({ onBack }) {
  const [profile, setProfile] = useState(null);
  const [editableProfile, setEditableProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("No user is logged in.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setEditableProfile({ ...data });
        } else {
          setError("No profile data found.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditChange = (field, value) => {
    if (isEditing) {
      setEditableProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("No user logged in.");
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, editableProfile);
      setProfile(editableProfile);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    const user = auth.currentUser;

    if (!user) {
      alert("No user logged in.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      alert("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePasswordModal(false);
    } catch (err) {
      console.error("Password update error:", err);
      alert("Failed to change password. Please check your current password.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile data found.</p>;

  return (
    <div className="profile-view__container">
      <div className="profile-view__content">
        <h1 className="profile-view__title">ACCOUNT SETTINGS</h1>

        <div className="profile-view__form-container">
          <form onSubmit={(e) => e.preventDefault()}>
            <h4>Account Information</h4>

            <div className="profile-view__form-input-display">
              <p>FULLNAME</p>
              <input
                type="text"
                value={editableProfile.fullname || ""}
                readOnly={!isEditing}
                onChange={(e) => handleEditChange("fullname", e.target.value)}
              />
            </div>

            <div className="profile-view__form-input-display">
              <p>CONTACT NUMBER</p>
              <input
                type="text"
                value={editableProfile.phone || ""}
                readOnly={!isEditing}
                onChange={(e) => handleEditChange("phone", e.target.value)}
              />
            </div>

            <div className="profile-view__form-input-display">
              <p>HOME ADDRESS</p>
              <input
                type="text"
                value={editableProfile.address || ""}
                readOnly={!isEditing}
                onChange={(e) => handleEditChange("address", e.target.value)}
              />
            </div>

            <div className="profile-view__form-input-display">
              <p>LANDMARK</p>
              <input
                type="text"
                value={editableProfile.landmark || ""}
                readOnly={!isEditing}
                onChange={(e) => handleEditChange("landmark", e.target.value)}
              />
            </div>

            <div className="profile-view__form-input-display email-with-links">
              <p>EMAIL ADDRESS</p>
              <div className="email-input-container">
                <input
                  type="email"
                  value={editableProfile.email || ""}
                  readOnly
                />
                <div className="email-links">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowChangePasswordModal(true);
                    }}
                  >
                    Change Password
                  </a>
                </div>
              </div>
            </div>

            <div className="profile-view__actions">
              {!isEditing ? (
                <>
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                  <button type="button" onClick={onBack} className="back-btn">
                    Back
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="save-btn"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setEditableProfile({ ...profile });
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="login-modal__overlay">
          <div className="login-modal__content">
            <button
              className="login-modal__close"
              onClick={() => setShowChangePasswordModal(false)}
            >
              ✕
            </button>

            <div className="login-modal__header">
              <h2 className="login-modal__title">Change Password</h2>
            </div>

            <form
              className="change-password__form"
              onSubmit={handlePasswordChange}
            >
              {["currentPassword", "newPassword", "confirmPassword"].map(
                (field, index) => (
                  <div key={index} className="password-input-wrapper">
                    <input
                      className="login-modal__input"
                      type={
                        passwordData[`${field}Visible`] ? "text" : "password"
                      }
                      placeholder={
                        field === "currentPassword"
                          ? "Current Password"
                          : field === "newPassword"
                          ? "New Password"
                          : "Confirm New Password"
                      }
                      value={passwordData[field]}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      required
                    />
                    <span
                      className="toggle-password"
                      onClick={() =>
                        setPasswordData((prev) => ({
                          ...prev,
                          [`${field}Visible`]: !prev[`${field}Visible`],
                        }))
                      }
                    >
                      {passwordData[`${field}Visible`] ? "Hide" : "Show"}
                    </span>
                  </div>
                )
              )}

              <button type="submit" className="login-modal__login-btn">
                Save Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

ProfileView.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ProfileView;
