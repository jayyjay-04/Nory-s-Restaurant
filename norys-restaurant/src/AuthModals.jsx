import { useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import LoginModal from "./LoginModal";
import RegisterMain1 from "./RegisterModal";
import "./Login-RegisterModalStyle.css";

function AuthModals() {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      <button onClick={() => setActiveModal("login")}>Login</button>
      <button onClick={() => setActiveModal("register")}>Sign Up</button>

      <SwitchTransition mode="out-in">
        <CSSTransition
          key={activeModal} // important for SwitchTransition
          timeout={300}
          classNames="modal-fade"
          unmountOnExit
        >
          <>
            {activeModal === "login" && (
              <LoginModal
                onClose={() => setActiveModal(null)}
                onSwitchToRegister={() => setActiveModal("register")}
              />
            )}
            {activeModal === "register" && (
              <RegisterMain1
                onClose={() => setActiveModal(null)}
                onSwitchToLogin={() => setActiveModal("login")}
              />
            )}
          </>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
}

export default AuthModals;
