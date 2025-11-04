import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import "./Order-Tray.css";

function OrderTray({ orders, onRemove, onProceed }) {
  const handleProceed = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      const cartRef = doc(db, "carts", user.uid);
      await setDoc(
        cartRef,
        {
          items: orders,
          userId: user.uid,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      onProceed(); // Move to OrdersMenu
    } catch (error) {
      console.error("Error saving to cart:", error);
      alert("Failed to proceed to order review.");
    }
  };

  return (
    <div className="order-tray__container">
      <div className="order-tray__content">
        <div className="order-tray__top">
          <img
            className="order-tray__logo-img"
            src="Image/Norys-Logo.png"
            alt="Logo"
          />
        </div>

        <hr />

        <div className="order-tray__bottom">
          <div className="order-tray__title">
            <h3>Order Tray</h3>
            <img
              className="order-tray__title-icon"
              src="Image/Mangkok.png"
              alt="Bowl Icon"
            />
          </div>

          <div
            className={`order-tray__order-view ${
              orders.length === 0 ? "empty" : ""
            }`}
          >
            {orders.length === 0 ? (
              <p>No orders yet</p>
            ) : (
              orders.map((item) => (
                <div key={item.id} className="order-tray__order-item">
                  <span>
                    {item.qty} x {item.name}{" "}
                    {item.category === "Bilao" && item.bilaoType
                      ? `(${item.bilaoType})`
                      : ""}
                  </span>
                  <span>
                    ₱{item.price * item.qty}{" "}
                    <button
                      className="order-tray__remove-btn"
                      onClick={() => onRemove(item.id)}
                    >
                      Remove
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>

          <hr />
          <button
            className="order-tray__submit-btn"
            type="button"
            disabled={orders.length === 0}
            onClick={handleProceed}
          >
            Go to Order Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderTray;
