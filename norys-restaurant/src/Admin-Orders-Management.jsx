import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import "./Admin-Orders-Management.css";

function AdminOrdersManagement() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const orders = snapshot.docs.map((docSnap) => ({
        id: docSnap.id, // Firestore internal doc ID (kept for actions)
        ...docSnap.data(),
      }));

      setPendingOrders(orders.filter((o) => o.status === "pending"));
      setCompletedOrders(orders.filter((o) => o.status === "completed"));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleComplete = async (docId) => {
    try {
      await updateDoc(doc(db, "orders", docId), {
        status: "completed",
        completedAt: new Date(),
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteDoc(doc(db, "orders", docId));
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleClearCompleted = async () => {
    if (!window.confirm("Clear all completed orders?")) return;
    try {
      const batch = writeBatch(db);
      completedOrders.forEach((order) => {
        batch.delete(doc(db, "orders", order.id));
      });
      await batch.commit();
      fetchOrders();
    } catch (error) {
      console.error("Error clearing completed orders:", error);
    }
  };

  const calculateTotalSales = () =>
    completedOrders.reduce(
      (sum, order) =>
        sum +
        (order.items?.reduce(
          (total, item) => total + item.price * item.qty,
          0
        ) || 0),
      0
    );

  const renderTableRows = (orders, type) =>
    orders.map((order) => (
      <tr key={order.id}>
        <td>{order.orderId || "N/A"}</td>
        <td>{order.shipping?.name || "N/A"}</td>
        <td>
          ₱
          {order.items?.reduce((sum, item) => sum + item.price * item.qty, 0) ||
            0}
        </td>
        <td>
          {order.shipping?.mode
            ? order.shipping.mode.charAt(0).toUpperCase() +
              order.shipping.mode.slice(1)
            : "N/A"}
        </td>
        <td>
          <button
            className="admin-orders__view-btn"
            onClick={() => setSelectedOrder(order)}
          >
            View
          </button>
        </td>
        <td>
          {type === "pending" ? (
            <>
              <button
                className="admin-orders__done-btn"
                onClick={() => handleComplete(order.id)}
              >
                Done
              </button>
              <button
                className="admin-orders__delete-btn"
                onClick={() => handleDelete(order.id)}
              >
                Delete
              </button>
            </>
          ) : (
            <button
              className="admin-orders__delete-btn"
              onClick={() => handleDelete(order.id)}
            >
              Delete
            </button>
          )}
        </td>
      </tr>
    ));

  return (
    <div className="admin-orders__container">
      <div className="admin-orders__section">
        <h2>PENDING ORDERS</h2>
        <div className="admin-orders__table-wrapper">
          <table className="admin-orders__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Type</th>
                <th>Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              ) : pendingOrders.length > 0 ? (
                renderTableRows(pendingOrders, "pending")
              ) : (
                <tr>
                  <td colSpan="6">No pending orders.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-orders__section">
        <h2>COMPLETED ORDERS</h2>
        <div className="admin-orders__table-wrapper">
          <table className="admin-orders__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Type</th>
                <th>Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.length > 0 ? (
                renderTableRows(completedOrders, "completed")
              ) : (
                <tr>
                  <td colSpan="6">No completed orders.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {completedOrders.length > 0 && (
          <div className="admin-orders__footer">
            <button
              className="admin-orders__clear-btn"
              onClick={handleClearCompleted}
            >
              Clear All
            </button>
            <div className="admin-orders__total">
              TOTAL SALES : ₱{calculateTotalSales()}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {selectedOrder && (
        <div className="admin-orders__modal">
          <div className="admin-orders__modal-content">
            <h2>
              {selectedOrder.orderId || "N/A"} -{" "}
              {selectedOrder.shipping?.mode
                ? selectedOrder.shipping.mode.toUpperCase()
                : "N/A"}
            </h2>
            <hr />
            <p>
              <strong>Customer Name:</strong>{" "}
              {selectedOrder.shipping?.name || "N/A"}
            </p>
            <p>
              <strong>Mobile number:</strong>{" "}
              {selectedOrder.shipping?.phone
                ? `(+63) ${selectedOrder.shipping.phone}`
                : "N/A"}
            </p>

            {/* Show Address and Landmark only if mode is 'delivery' */}
            {selectedOrder.shipping?.mode === "delivery" && (
              <>
                <p>
                  <strong>Address:</strong>{" "}
                  {[
                    selectedOrder.shipping.street,
                    selectedOrder.shipping.barangay,
                    selectedOrder.shipping.municipality,
                  ]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </p>
                <p>
                  <strong>Landmark:</strong>{" "}
                  {selectedOrder.shipping?.landmark || "N/A"}
                </p>
              </>
            )}

            <p>
              <strong>Orders:</strong>
              <br />
              {selectedOrder.items?.map((item, index) => (
                <span key={index}>
                  {item.name} - {item.qty}x
                  <br />
                </span>
              ))}
            </p>

            <button
              className="admin-orders__close-btn"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrdersManagement;
