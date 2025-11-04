import "./Footer-1.css";

function FooterMain1() {
  return (
    <div className="footer1">
      <div className="footer1__container">
        {/* Left Section */}
        <div className="footer1__left">
          <img
            className="footer1__logo"
            src="Image/Norys-Logo01.png"
            alt="Nory's Logo"
          />

          <div className="vertical-line"></div>

          <div className="footer1__main-text">
            <h1>Made with love at Nory’s.</h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="footer1__right">
          {/* Open Hours */}
          <div className="footer1__info-block">
            <div className="footer1__info-title">
              <img
                className="footer1__icon"
                src="Image/clock-icon.png"
                alt="Clock Icon"
              />
              <h3>Open Hours</h3>
            </div>
            <div className="footer1__info-text">
              <p>Monday to Sunday</p>
              <p>6:00AM - 7:00PM</p>
            </div>
          </div>

          {/* Bulk Orders */}
          <div className="footer1__info-block">
            <div className="footer1__info-title">
              <img
                className="footer1__icon"
                src="Image/message-icon.png"
                alt="Message Icon"
              />
              <h3>For Bulk Orders:</h3>
            </div>

            <div className="footer1__bulk-orders">
              <div className="norys-qr-container">
                <img
                  className="norys-qr-code"
                  src="Image/norys-qr.png"
                  alt="QR Code"
                />
                <p>Scan this QR code</p>
              </div>

              <div className="footer1__info-text">
                <p>Reach us on Facebook! And send us a message.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FooterMain2() {
  return (
    <div className="footer2">
      <div className="footer2__text1">
        <p>Terms & Conditions | Privacy Policy</p>
        <p>© 2025 NORY’S. All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default FooterMain1;
export { FooterMain2 };
