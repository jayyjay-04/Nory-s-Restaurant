import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Order-Menu.css";

function OrderMenu({ onAddToOrder }) {
  const [selectedCategory, setSelectedCategory] = useState("Noodles");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "Noodles",
    "Burgers & Sandwiches",
    "Lugaw",
    "Desserts",
    "Bilao",
  ];

  // Fetch menu items from Firestore
  const fetchDishes = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "menu"));
      const menuData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDishes(menuData);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const filteredDishes = dishes.filter(
    (dish) => dish.category === selectedCategory
  );

  return (
    <div className="order-menu__container">
      <div className="order-menu__content">
        <h1 className="order-menu__title">M E N U</h1>

        <div className="order-menu__tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`order-menu__tab-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="order-menu__list">
          {loading ? (
            <p>Loading menu...</p>
          ) : filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <DishItem key={dish.id} dish={dish} onAddToOrder={onAddToOrder} />
            ))
          ) : (
            <p>No dishes available in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DishItem({ dish, onAddToOrder }) {
  const [qty, setQty] = useState(1);
  const [bilaoType, setBilaoType] = useState("Pancit Alanganin");

  const increase = () => setQty(qty + 1);
  const decrease = () => qty > 1 && setQty(qty - 1);

  const handleAdd = () => {
    const orderItem = {
      ...dish,
      ...(dish.category === "Bilao" ? { bilaoType } : {}),
    };
    onAddToOrder(orderItem, qty);
    setQty(1);
  };

  const bilaoOptions = [
    "Pancit Alanganin",
    "Pancit Guisado",
    "Pancit Palabok",
    "Pancit Canton",
    "Pancit Canton Guisado",
  ];

  return (
    <div className="order-menu__item">
      <div className="order-menu__item-left">
        <p className="order-menu__item-name">{dish.name}</p>

        {/* Dropdown for Bilao only */}
        {dish.category === "Bilao" && (
          <select
            value={bilaoType}
            onChange={(e) => setBilaoType(e.target.value)}
            className="bilao-type-select"
          >
            {bilaoOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="order-menu__item-center">
        <div className="order-menu__dots"></div>
      </div>

      <div className="order-menu__item-right">
        {/* Price first */}
        <span className="order-menu__item-price">₱{dish.price}</span>

        {/* Qty beside Add button */}
        <div className="order-menu__actions">
          <div className="order-menu__qty">
            <button onClick={decrease}>−</button>
            <span>{qty}</span>
            <button onClick={increase}>+</button>
          </div>
          <button className="order-menu__add-btn" onClick={handleAdd}>
            Add to order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderMenu;
