import "./Landing-Page-6.css";

function LandingPageMain6() {
  return (
    <div id="location" className="landing6">
      <div className="landing6__text-wrapper">
        <div className="landing6__text-1">
          <h1>Location</h1>
        </div>

        <div className="landing6__text-2">
          <h2>Get in Touch</h2>
        </div>

        <div className="landing6__text-3">
          <p>
            You can easily find us using the map below. Just follow the
            directions to reach our place without hassle.
          </p>

          <hr className="landing6__divider" />

          <div className="landing6__text-4">
            <img
              className="landing6__icon"
              src="Image/Location-Icon.png"
              alt="Location Icon"
            />
            <p>16 T. Sandico, Bocaue, Bulacan</p>
          </div>
        </div>
      </div>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.5520569532296!2d120.92272351029642!3d14.794242885655791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ad65ef9bfa5d%3A0xc7a88ed336a7e883!2sNory&#39;s%20Restaurant!5e0!3m2!1sen!2sph!4v1759892153529!5m2!1sen!2sph"
        width="600"
        height="450"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Nory's Restaurant Map"
      ></iframe>
    </div>
  );
}

export default LandingPageMain6;
