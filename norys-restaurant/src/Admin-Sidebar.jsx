import "./Admin-Sidebar.css";

function AdminSidebar({ setCurrentPage, currentPage }) {
  return (
    <div className="admin-sidebar__container">
      <div className="admin-sidebar__content">
        {/* Orders */}
        <button
          className={`sidebar__btn ${currentPage === "orders" ? "active" : ""}`}
          onClick={() => setCurrentPage("orders")}
        >
          <img src="Image/orders-icon.png" alt="Orders" />
        </button>

        {/* Menu Management */}
        <button
          className={`sidebar__btn ${currentPage === "menu" ? "active" : ""}`}
          onClick={() => setCurrentPage("menu")}
        >
          <img src="Image/Menu-icon01.png" alt="Menu" />
        </button>

        {/* Feedback / Messages */}
        <button
          className={`sidebar__btn ${
            currentPage === "feedback" ? "active" : ""
          }`}
          onClick={() => setCurrentPage("feedback")}
        >
          <img src="Image/message-icon.png" alt="Feedback" />
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
