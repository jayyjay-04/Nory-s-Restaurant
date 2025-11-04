import React from "react";
import "./Billing-Shipping.css";

function BillingShipping({
  shippingInfo,
  setShippingInfo,
  shippingMode,
  setShippingMode,
}) {
  return (
    <div className="shipping__container">
      <h3>Shipping Information</h3>

      <div className="shipping__mode-switch">
        <button
          type="button"
          onClick={() => setShippingMode("delivery")}
          className={shippingMode === "delivery" ? "active" : ""}
        >
          For Delivery
        </button>
        <button
          type="button"
          onClick={() => setShippingMode("pickup")}
          className={shippingMode === "pickup" ? "active" : ""}
        >
          For Pickup
        </button>
      </div>

      {shippingMode === "delivery" ? (
        <div className="shipping__delivery-form">
          <h4>Customer Information</h4>
          <form>
            <input
              type="text"
              placeholder="Full Name"
              value={shippingInfo.name || ""}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={shippingInfo.phone || ""}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, phone: e.target.value })
              }
            />
            <h4>Delivery Address</h4>
            <input
              type="text"
              placeholder="Street, Home No., Building"
              value={shippingInfo.street || ""}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, street: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Barangay"
              value={shippingInfo.barangay || ""}
              onChange={(e) =>
                setShippingInfo({
                  ...shippingInfo,
                  barangay: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Municipality"
              value={shippingInfo.municipality || ""}
              onChange={(e) =>
                setShippingInfo({
                  ...shippingInfo,
                  municipality: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Landmark (Optional)"
              value={shippingInfo.landmark || ""}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, landmark: e.target.value })
              }
            />
            <p>
              Please ensure your delivery details are accurate. Orders are
              available within Bocaue only.
            </p>
          </form>
        </div>
      ) : (
        <div className="shipping__pickup-form">
          <h4>Pickup Information</h4>
          <form>
            <input
              type="text"
              placeholder="Full Name"
              value={shippingInfo.name || ""}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={shippingInfo.phone || ""}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, phone: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Order ID"
              value={shippingInfo.orderId || ""}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, orderId: e.target.value })
              }
            />
            <p>
              Please pick up your order at our store within the scheduled time.
              Present your order ID upon claiming.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default BillingShipping;
