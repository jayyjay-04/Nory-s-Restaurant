import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./Admin-Menu-Management.css";

function AdminMenuManagement() {
  const [selectedCategory, setSelectedCategory] = useState("Noodles");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ id: "", name: "", price: "" });

  const categories = [
    "Noodles",
    "Burgers & Sandwiches",
    "Lugaw",
    "Desserts",
    "Bilao",
  ];

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

  // Add new dish
  const handleAddDish = async () => {
    const name = prompt("Enter dish name:");
    const price = prompt("Enter dish price:");
    if (!name || !price) return;
    try {
      await addDoc(collection(db, "menu"), {
        name,
        price: Number(price),
        category: selectedCategory,
      });
      fetchDishes();
    } catch (error) {
      console.error("Error adding dish:", error);
    }
  };

  // Open modal for editing
  const handleEditDish = (dish) => {
    setEditData({ id: dish.id, name: dish.name, price: dish.price });
    setIsEditing(true);
  };

  // Save edited dish
  const handleSaveEdit = async () => {
    if (!editData.name || !editData.price) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      await updateDoc(doc(db, "menu", editData.id), {
        name: editData.name,
        price: Number(editData.price),
      });
      setIsEditing(false);
      fetchDishes();
    } catch (error) {
      console.error("Error updating dish:", error);
    }
  };

  // Delete dish
  const handleDeleteDish = async (dishId) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      await deleteDoc(doc(db, "menu", dishId));
      fetchDishes();
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  const filteredDishes = dishes.filter(
    (dish) => dish.category === selectedCategory
  );

  return (
    <div className="admin__menu-management-container">
      <div className="admin__menu-management-content">
        {/* Tabs */}
        <div className="menu__tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`menu__tab-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dishes list */}
        <div className="menu__list">
          {loading ? (
            <p>Loading...</p>
          ) : filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <div key={dish.id} className="menu__row">
                <div className="menu__item">
                  <span className="menu__name">{dish.name}</span>
                  <div className="menu__dots"></div>
                  <span className="menu__price">₱{dish.price}</span>
                </div>
                <div className="menu__actions">
                  <button
                    className="menu__edit"
                    onClick={() => handleEditDish(dish)}
                  >
                    <img src="Image/edit-icon.png" alt="edit" />
                  </button>
                  <button
                    className="menu__delete"
                    onClick={() => handleDeleteDish(dish.id)}
                  >
                    <img src="Image/delete-icon.png" alt="delete" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No dishes found in this category.</p>
          )}

          {/* Add new dish button */}
          <div className="menu__add" onClick={handleAddDish}>
            +
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="edit-modal__overlay">
          <div className="edit-modal__content">
            <div className="edit-modal__fields">
              <input
                type="text"
                placeholder="Edit Name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Edit Price"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
              />
            </div>
            <div className="edit-modal__buttons">
              <button
                className="clear-btn"
                onClick={() =>
                  setEditData({ ...editData, name: "", price: "" })
                }
              >
                Clear
              </button>
              <button className="save-btn" onClick={handleSaveEdit}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMenuManagement;
