import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";
import { useState } from "react";
import "./Login-RegisterModalStyle.css";

function LoginModal({ onClose, onSwitchToRegister, defaultStep = 1 }) {
  const [step, setStep] = useState(defaultStep);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    resetEmail: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("Logged in as:", userCredential.user.email);
      alert("Login successful");
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, formData.resetEmail);
      alert("Reset email sent. Check your inbox.");
      setStep(1);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="login-modal__overlay">
      <div className="login-modal__content">
        <button
          className="login-modal__close"
          onClick={() => {
            setStep(1);
            onClose();
          }}
        >
          ✕
        </button>

        <div className="login-modal__header">
          <h2 className="login-modal__title">
            {step === 1 ? "Sign In" : "Forgot Password"}
          </h2>
        </div>

        <div className="login-modal__body">
          {step === 1 && (
            <form className="login-modal__form" onSubmit={handleLogin}>
              <input
                className="login-modal__input"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange("email")}
                required
              />

              <div className="password-input-wrapper">
                <input
                  className="login-modal__input"
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

              <div className="login-modal__options">
                <a
                  href="#"
                  className="login-modal__forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                >
                  Forgot Password?
                </a>
              </div>
              <button type="submit" className="login-modal__login-btn">
                Login
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="login-modal__form" onSubmit={handleSendResetCode}>
              <input
                className="login-modal__input"
                type="email"
                placeholder="Email Address"
                value={formData.resetEmail}
                onChange={handleChange("resetEmail")}
                required
              />
              <p className="forgot-password__paragraph">
                Enter your registered email address and we’ll send you a link to
                reset your password.
              </p>
              <button type="submit" className="login-modal__login-btn">
                Send Reset Link
              </button>
            </form>
          )}
        </div>

        <div className="login-modal__footer">
          {step === 1 ? (
            <div className="login-modal__register">
              Don’t have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchToRegister();
                }}
              >
                Sign Up
              </a>
            </div>
          ) : (
            <div className="login-modal__register">
              Remember your Password?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setStep(1);
                }}
              >
                Sign In
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
