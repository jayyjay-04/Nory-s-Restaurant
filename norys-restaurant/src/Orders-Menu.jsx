import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import "./Orders-Menu.css";
import OrderSummary from "./Orders-Summary";

function OrdersMenu({ onBack, onProceedToBilling }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Listen to Firestore cart
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const cartRef = doc(db, "carts", user.uid);

    const unsubscribe = onSnapshot(
      cartRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setCartItems(data.items || []);
        } else {
          setCartItems([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching cart:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      const cartRef = doc(db, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        const data = cartSnap.data();
        const updatedItems = data.items.map((i) =>
          i.id === itemId ? { ...i, qty: newQty } : i
        );
        await updateDoc(cartRef, {
          items: updatedItems,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const cartRef = doc(db, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const data = cartSnap.data();
        const updatedItems = data.items.filter((item) => item.id !== itemId);

        if (updatedItems.length === 0) {
          await deleteDoc(cartRef);
        } else {
          await updateDoc(cartRef, {
            items: updatedItems,
            updatedAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (loading) return <p>Loading your cart...</p>;
  if (cartItems.length === 0) return <p>Your cart is empty.</p>;

  const grandTotal = calculateTotal(cartItems);

  return (
    <div className="orders-menu__container">
      <div className="orders-menu__content">
        <h1>O R D E R S</h1>
        <div className="orders-menu__main">
          <div className="orders-menu__list">
            {cartItems.map((item) => (
              <div key={item.id} className="orders-menu__item">
                <div className="orders-menu__item-details">
                  <h3>{item.name}</h3>
                  <div className="orders-menu__qty-controls">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.qty - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.qty + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="orders-menu__item-actions">
                  <span className="orders-menu__item-price">
                    ₱{item.price * item.qty}
                  </span>
                  <button
                    className="orders-menu__remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <OrderSummary
            orders={[{ id: "cart", items: cartItems }]}
            total={grandTotal}
            onProceedToBilling={() => onProceedToBilling(cartItems)}
          />
        </div>
      </div>
    </div>
  );
}

export default OrdersMenu;
