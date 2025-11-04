import "./Orders-Summary.css";

function OrderSummary({ orders, total, onProceedToBilling }) {
  const items = orders.flatMap((order) => order.items);

  return (
    <div className="order-summary__container">
      <div className="order-summary__details">
        <h3>Order Summary</h3>
        <p className="order-summary__dish-count">
          {items.length} {items.length === 1 ? "dish item" : "dish items"}
        </p>

        <div className="order-summary__items-list">
          {items.map((item) => (
            <div key={item.id} className="order-summary__item">
              <span>
                {item.name}{" "}
                <span className="order-summary__qty">x{item.qty}</span>
              </span>
              <span>₱{item.price * item.qty}</span>
            </div>
          ))}
        </div>

        <hr />
        <div className="order-summary__total">
          <strong>Total:</strong>
          <strong>₱{total}</strong>
        </div>

        <button
          className="order-summary__proceed-btn"
          onClick={onProceedToBilling}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default OrderSummary;
