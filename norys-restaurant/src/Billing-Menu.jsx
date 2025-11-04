import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { deleteDoc } from "firebase/firestore";

import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import "./Billing-Menu.css";
import BillingShipping from "./Biling-Shipping";

function BillingMenu({ orders, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({});
  const [shippingMode, setShippingMode] = useState("delivery");
  const [paymentInfo, setPaymentInfo] = useState({ cash: undefined });
  const [orderId, setOrderId] = useState("");

  const steps = ["Order Summary", "Shipping Information", "Payment", "Receipt"];
  const totalSteps = steps.length;

  useEffect(() => {
    const generateOrderId = async () => {
      const ordersRef = collection(db, "orders");
      const snapshot = await getDocs(ordersRef);
      const count = snapshot.size + 1;
      const formatted = String(count).padStart(3, "0");
      setOrderId(`ORD-${formatted}`);
    };
    generateOrderId();
  }, []);

  const calculateTotal = (orders) =>
    orders
      .flatMap((order) => order.items)
      .reduce((sum, item) => sum + item.price * item.qty, 0);

  const total = calculateTotal(orders);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (currentStep === 2) {
        if (shippingMode === "delivery") {
          if (
            !shippingInfo.name ||
            !shippingInfo.phone ||
            !shippingInfo.street ||
            !shippingInfo.barangay ||
            !shippingInfo.municipality
          ) {
            alert("Please fill in all delivery fields.");
            return;
          }
        } else {
          if (
            !shippingInfo.name ||
            !shippingInfo.phone ||
            !shippingInfo.orderId
          ) {
            alert("Please fill in all pickup fields.");
            return;
          }
          if (shippingInfo.orderId.trim() !== orderId.trim()) {
            alert(`Invalid Order ID. Please enter the correct ID: ${orderId}`);
            return;
          }
        }
      }

      if (currentStep === 3) {
        const shippingFee = shippingMode === "delivery" ? 60 : 0;
        const grandTotal = total + shippingFee;
        if (!paymentInfo.cash || paymentInfo.cash < grandTotal) {
          alert(`Please provide enough cash (₱${grandTotal}) to proceed.`);
          return;
        }
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else if (onComplete) onComplete();
  };

  const handleComplete = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not authenticated.");
      return;
    }

    if (!orders || orders.length === 0 || orders[0].items.length === 0) {
      alert("No items to submit.");
      return;
    }

    try {
      const shippingFee = shippingMode === "delivery" ? 60 : 0;
      const grandTotal = total + shippingFee;

      const ordersRef = collection(db, "orders");
      const snapshot = await getDocs(ordersRef);
      const count = snapshot.size + 1;
      const formatted = String(count).padStart(3, "0");
      const newOrderId = `ORD-${formatted}`;

      await addDoc(ordersRef, {
        userId: user.uid,
        orderId: newOrderId,
        items: orders.flatMap((order) => order.items),
        shipping: { mode: shippingMode, ...shippingInfo },
        payment: paymentInfo,
        total: grandTotal,
        status: "pending",
        createdAt: new Date(),
      });

      alert(`Order ${newOrderId} submitted! Waiting for admin approval.`);

      const cartRef = doc(db, "carts", user.uid);
      await deleteDoc(cartRef);

      setShippingInfo({});
      setPaymentInfo({ cash: undefined });
      setShippingMode("delivery");
      setOrderId("");

      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error saving order:", error);
      alert(`Failed to save order: ${error.message}`);
    }
  };

  const renderStepContent = () => {
    const shippingFee = shippingMode === "delivery" ? 60 : 0;
    const grandTotal = total + shippingFee;

    switch (currentStep) {
      case 1:
        return (
          <div className="billing__order-summary">
            <h3>Order Summary</h3>
            <div className="billing__summary-bar">
              <h4>Order</h4>
              <h4>Quantity</h4>
              <h4>Unit Price</h4>
              <h4>Total</h4>
            </div>
            <div className="billing__orders-list">
              {orders
                .flatMap((order) => order.items)
                .map((item) => (
                  <div key={item.id} className="billing__order-item">
                    <span>{item.name}</span>
                    <span>{item.qty}</span>
                    <span>₱{item.price}</span>
                    <span>₱{item.price * item.qty}</span>
                  </div>
                ))}
            </div>
            <div className="billing__summary-footer">
              <div className="billing__order-id">
                <em>Order ID: {orderId}</em>
                <p>Please Take Note of Order-Id</p>
              </div>
              <div className="billing__sub-total">
                <h4>Total: ₱{total}</h4>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <BillingShipping
            shippingInfo={shippingInfo}
            setShippingInfo={setShippingInfo}
            shippingMode={shippingMode}
            setShippingMode={setShippingMode}
          />
        );

      case 3:
        return (
          <div className="billing__payment">
            <div className="payment-header">
              <div className="payment-header-text">
                <h3>CASH ONLY</h3>
                <p className="note">
                  We currently accept cash payments for all orders.
                </p>
              </div>
              <span className="pickup-label">For Pickup</span>
            </div>
            <hr className="divider" />

            <div className="payment-row">
              <span className="label">
                <strong>Sub Total Price:</strong>
              </span>
              <span className="value">₱{total.toFixed(2)}</span>
            </div>

            <div className="payment-row">
              <span className="label">
                <strong>Delivery Fee:</strong>
              </span>
              <span className="value">
                ₱
                {shippingMode === "delivery"
                  ? (60.0).toFixed(2)
                  : (0.0).toFixed(2)}
              </span>
            </div>

            <hr className="divider" />

            <div className="payment-grand-total">
              <span>
                <strong>Grand Total:</strong>
              </span>
              <span>
                <strong>
                  ₱{(total + (shippingMode === "delivery" ? 60 : 0)).toFixed(2)}
                </strong>
              </span>
            </div>

            <div className="cash-input-container">
              <label htmlFor="cash-input">
                <strong>Enter your cash amount:</strong>
              </label>
              <input
                id="cash-input"
                type="number"
                placeholder="₱0.00"
                min={0}
                step="0.01"
                value={paymentInfo.cash || ""}
                onChange={(e) =>
                  setPaymentInfo({ cash: Number(e.target.value) })
                }
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="billing__receipt">
            <h3>Receipt</h3>
            <div className="billing__orders-list">
              {orders
                .flatMap((order) => order.items)
                .map((item) => (
                  <div key={item.id} className="billing__order-item">
                    <span>{item.name}</span>
                    <span>{item.qty}</span>
                    <span>₱{item.price}</span>
                    <span>₱{item.qty * item.price}</span>
                  </div>
                ))}
            </div>

            <div className="receipt__row">
              <span className="label">Order ID:</span>
              <span className="value">{orderId}</span>
            </div>

            <div className="receipt__row">
              <span className="label">Order Total:</span>
              <span className="value">₱{total}</span>
            </div>

            <div className="receipt__row">
              <span className="label">Shipping:</span>
              <span className="value">
                {shippingMode === "delivery"
                  ? `${shippingInfo.street}, ${shippingInfo.barangay}, ${shippingInfo.municipality}`
                  : "Pickup"}
              </span>
            </div>

            {shippingMode === "delivery" && (
              <div className="receipt__row">
                <span className="label">Landmark:</span>
                <span className="value">{shippingInfo.landmark || "N/A"}</span>
              </div>
            )}

            <div className="receipt__row">
              <span className="label">Cash Provided:</span>
              <span className="value">₱{paymentInfo.cash}</span>
            </div>

            <div className="receipt__row">
              <span className="label">Change:</span>
              <span className="value">
                ₱
                {paymentInfo.cash -
                  (total + (shippingMode === "delivery" ? 60 : 0))}
              </span>
            </div>

            <div className="receipt__estimated-time">
              <p>
                <strong>Estimated Delivery Time:</strong>
              </p>
              <h2>45 Mins</h2>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="billing-menu__container">
      <div className="billing-menu__content">
        <h1>B I L L I N G</h1>
        <div className="billing__progress-bar">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`billing__step ${
                currentStep > index
                  ? "completed"
                  : currentStep === index + 1
                  ? "active"
                  : ""
              }`}
            >
              <span>
                {index + 1}. {step}
              </span>
            </div>
          ))}
        </div>

        {renderStepContent()}

        <div className="billing__navigation">
          <button className="back-btn" onClick={handleBack}>
            {currentStep === 1 ? "Back to Menu" : "Back"}
          </button>

          {currentStep < totalSteps && (
            <button onClick={handleNext}>Proceed to Payment</button>
          )}
          {currentStep === totalSteps && (
            <button onClick={handleComplete}>Complete Order</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BillingMenu;
