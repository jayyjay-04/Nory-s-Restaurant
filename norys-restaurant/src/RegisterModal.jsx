import { useState } from "react";
import "./Login-RegisterModalStyle.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

function RegisterModal({ onClose, onSwitchToLogin }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    landmark: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleFinish = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.fullname });

      await setDoc(doc(db, "users", user.uid), {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        landmark: formData.landmark,
        createdAt: new Date(),
      });

      alert("Account created successfully");
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="regis-modal__overlay">
      <div className="regis-modal__content">
        <button className="regis-modal__close" onClick={onClose}>
          ✕
        </button>

        <div className="regis-modal__header">
          <h2 className="regis-modal__title">Register to Order</h2>
        </div>

        <div className="regis-modal__body">
          {step === 1 && (
            <form className="regis-modal__form1" onSubmit={handleNext}>
              <h5 className="regis-modal__subtitle">Customer Information</h5>

              <input
                className="regis-modal__input"
                type="text"
                placeholder="Fullname"
                value={formData.fullname}
                onChange={handleChange("fullname")}
                required
              />

              <input
                className="regis-modal__input"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange("email")}
                required
              />

              <input
                className="regis-modal__input"
                type="tel"
                placeholder="Mobile Number (+63 912 345 6789)"
                value={formData.phone}
                onChange={handleChange("phone")}
                required
              />

              <div className="password-input-wrapper">
                <input
                  className="regis-modal__input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              <div className="password-input-wrapper">
                <input
                  className="regis-modal__input"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirm((prev) => !prev)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </span>
              </div>

              <button type="submit" className="regis-modal__next-btn">
                Next
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="regis-modal__form2" onSubmit={handleNext}>
              <h5 className="regis-modal__subtitle">Delivery Information</h5>

              <input
                className="regis-modal__input"
                type="text"
                placeholder="Complete Address"
                value={formData.address}
                onChange={handleChange("address")}
                required
              />

              <input
                className="regis-modal__input"
                type="text"
                placeholder="Landmark (Optional)"
                value={formData.landmark}
                onChange={handleChange("landmark")}
              />

              <button type="submit" className="regis-modal__next-btn">
                Next
              </button>
            </form>
          )}

          {step === 3 && (
            <>
              <h5 className="regis-modal__subtitle">Review & Confirm</h5>
              <div className="regis-modal__info-section">
                <p>
                  <b>Fullname:</b> {formData.fullname}
                </p>
                <p>
                  <b>Email:</b> {formData.email}
                </p>
                <p>
                  <b>Mobile:</b> {formData.phone}
                </p>
                <p>
                  <b>Address:</b> {formData.address}
                </p>
                <p>
                  <b>Landmark:</b> {formData.landmark || "N/A"}
                </p>
              </div>
              <button onClick={handleFinish} className="regis-modal__next-btn">
                Finish & Create Account
              </button>
            </>
          )}
        </div>

        <div className="regis-modal__footer">
          <div className="login-modal__register">
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
