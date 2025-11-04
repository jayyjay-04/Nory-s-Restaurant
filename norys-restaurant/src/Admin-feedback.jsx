import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./Admin-Feedback.css";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all feedback messages
  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "feedback"));
      const feedbackData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbacks(feedbackData);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete feedback
  const handleResolve = async (id) => {
    try {
      await deleteDoc(doc(db, "feedback", id));
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="admin-feedback__container">
      <h2 className="admin-feedback__title">Customer Feedback</h2>

      {loading ? (
        <p>Loading feedback...</p>
      ) : feedbacks.length === 0 ? (
        <p className="admin-feedback__empty">All messages are cleared.</p>
      ) : (
        <div className="admin-feedback__list">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="admin-feedback__card">
              <div className="admin-feedback__card-header">
                <h4>{fb.name}</h4>
                <span className="admin-feedback__date">
                  {fb.timestamp
                    ? new Date(fb.timestamp.seconds * 1000).toLocaleDateString(
                        "en-GB"
                      )
                    : new Date().toLocaleDateString("en-GB")}
                </span>
              </div>
              <p>{fb.message}</p>
              <button
                className="admin-feedback__resolve-btn"
                onClick={() => handleResolve(fb.id)}
              >
                Resolve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminFeedback;
