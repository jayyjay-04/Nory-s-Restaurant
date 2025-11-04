import { useState } from "react";
import AdminHeader from "./Admin-Header";
import AdminSidebar from "./Admin-Sidebar";
import AdminOrdersManagement from "./Admin-Orders-Management";
import AdminMenuManagement from "./Admin-Menu-Management";
import AdminFeedback from "./Admin-feedback";
import "./Admin-Dashboard.css";

function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("orders");

  return (
    <div className="admin-dashboard__wrapper">
      <AdminHeader currentPage={currentPage} />

      <div className="admin-dashboard__content">
        <AdminSidebar
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />

        <div className="admin-dashboard__main">
          {currentPage === "orders" && <AdminOrdersManagement />}
          {currentPage === "menu" && <AdminMenuManagement />}
          {currentPage === "feedback" && <AdminFeedback />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
