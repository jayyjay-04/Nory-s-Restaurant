import { useState } from "react";
import { db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";
import "./Landing-Page-5.css";

function LandingPageMain5() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) {
      alert("Please fill in both name and message.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "feedback"), {
        name,
        message,
        createdAt: new Date(),
      });
      alert("Thank you for your feedback!");
      setName("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-us" className="landing5">
      <div className="landing5__content-wrapper">
        <div className="landing5__text-wrapper">
          <div className="landing5__text1">
            <h1>Contact Us</h1>
          </div>

          <div className="landing5__text2">
            <p>
              Your feedback is highly valued, as it helps Nory’s Restaurant
              maintain the quality of our dishes and continually enhance
              customer satisfaction.
            </p>
          </div>
        </div>

        <div className="landing5__contact-info-wrapper">
          <div className="landing5__contact-info">
            <img
              className="landing5__contact-icon"
              src="Image/Email-Icon.png"
              alt="Email Icon"
            />
            <p>norysrestaurant@gmail.com</p>
          </div>

          <div className="landing5__contact-info">
            <img
              className="landing5__contact-icon"
              src="Image/Facebook-Icon.png"
              alt="Facebook Icon"
            />
            <p>Nory’s Restaurant</p>
          </div>

          <div className="landing5__contact-info">
            <img
              className="landing5__contact-icon"
              src="Image/Phone-Icon.png"
              alt="Phone Icon"
            />
            <p>+63 975 081 6062</p>
          </div>
        </div>
      </div>

      <div className="landing5__input-section">
        <input
          type="text"
          className="landing5__input1"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          name="message"
          className="landing5__input2"
          placeholder="Write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="landing5__button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default LandingPageMain5;
