import { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";

import OrderMenu from "./Order-Menu";
import OrderHeader from "./Order-Header";
import OrderTray from "./Order-Tray";
import OrdersMenu from "./Orders-Menu";
import BillingMenu from "./Billing-Menu";
import ProfileView from "./Profile-View";

function OrderDashboard({ onBack }) {
  const [orders, setOrders] = useState([{ id: "current", items: [] }]);
  const [activePage, setActivePage] = useState("menu");

  // --- Add to order tray ---
  const handleAddToOrder = (dish, qty) => {
    setOrders((prev) => {
      const currentOrder = prev[0];
      const existing = currentOrder.items.find((item) => item.id === dish.id);
      const updatedItems = existing
        ? currentOrder.items.map((item) =>
            item.id === dish.id ? { ...item, qty: item.qty + qty } : item
          )
        : [...currentOrder.items, { ...dish, qty }];
      return [{ ...currentOrder, items: updatedItems }];
    });
  };

  // --- Remove item ---
  const handleRemoveFromOrder = (id) => {
    setOrders((prev) => {
      const currentOrder = prev[0];
      const updatedItems = currentOrder.items.filter((item) => item.id !== id);
      return [{ ...currentOrder, items: updatedItems }];
    });
  };

  // --- Save order to Firestore (optional) ---
  const saveOrderToFirestore = async (orderItems) => {
    const user = auth.currentUser;
    if (!user || orderItems.length === 0) return null;

    try {
      const docRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: orderItems,
        status: "pending",
        createdAt: new Date(),
      });

      // Optional: clear Firestore cart
      await deleteDoc(doc(db, "carts", user.uid));

      console.log("Order saved:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving order:", error);
      return null;
    }
  };

  // --- Proceed from tray to review ---
  const handleProceedToReview = () => {
    if (orders[0].items.length === 0) {
      alert("No orders added!");
      return;
    }
    setActivePage("orders");
  };

  // --- From OrdersMenu → BillingMenu ---
  const handleProceedToBilling = (cartItems) => {
    if (!cartItems || cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    setOrders([{ id: "current", items: cartItems }]); // pass items to billing
    setActivePage("billing");
  };

  // --- After billing complete ---
  const handleCompleteBilling = () => {
    setOrders([{ id: "current", items: [] }]);
    setActivePage("menu");
  };

  // --- Render page based on activePage ---
  const renderContent = () => {
    switch (activePage) {
      case "menu":
        return (
          <>
            <OrderMenu onAddToOrder={handleAddToOrder} />
            <OrderTray
              orders={orders[0].items}
              onRemove={handleRemoveFromOrder}
              onProceed={handleProceedToReview}
            />
          </>
        );
      case "orders":
        return (
          <OrdersMenu
            onBack={() => setActivePage("menu")}
            onProceedToBilling={handleProceedToBilling}
          />
        );
      case "billing":
        return (
          <BillingMenu orders={orders} onComplete={handleCompleteBilling} />
        );
      case "profile":
        return <ProfileView onBack={() => setActivePage("menu")} />;
      default:
        return null;
    }
  };

  return (
    <>
      <OrderHeader
        currentPage={activePage} // <-- pass state to header
        onBack={onBack}
        onMenuClick={() => setActivePage("menu")}
        onOrdersClick={() => setActivePage("orders")}
        onBillingClick={() => setActivePage("billing")}
        onProfileClick={() => setActivePage("profile")}
      />
      <section style={{ display: "flex", gap: "20px", padding: "20px" }}>
        {renderContent()}
      </section>
    </>
  );
}

export default OrderDashboard;
