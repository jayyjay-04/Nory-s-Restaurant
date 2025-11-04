import "./Landing-Page-1.css";

function LandingPageMain({ onOrderNow }) {
  return (
    <div id="home" className="landing">
      <div className="landing__content">
        {/* Hat Icon */}
        <div className="landing__hat">
          <img src="Image/hat-icon.png" alt="Chef Hat" />
        </div>

        <div className="landing__headline">
          <h1>
            You can find the
            <span className="landing__highlight"> Best Pancit</span> in town in
            very <span className="landing__highlight">Affordable Price</span>.
          </h1>
        </div>

        <div className="landing__subtext">
          <p>
            Experience Bocaue’s favorite, Pancit Alanganin, at Nory’s
            Restaurant.
          </p>
        </div>

        <div className="landing__button-wrapper">
          <button
            className="landing__button"
            type="button"
            onClick={onOrderNow}
          >
            Order Now
            <img src="Image/bowl-icon01.png" alt="" />
          </button>
        </div>
      </div>

      <div className="landing__image">
        <img
          className="landing__image-item"
          src="Image/Norys-Logo.png"
          alt="No Image Found"
        />
      </div>
    </div>
  );
}

export default LandingPageMain;
