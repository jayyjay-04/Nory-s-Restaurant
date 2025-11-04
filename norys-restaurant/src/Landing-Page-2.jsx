import "./Landing-Page-2.css";

function LandingPageMain2() {
  return (
    <div id="menu" className="landing2">
      <div className="landing2__text">
        <h1>Popular Dishes You Can’t Miss</h1>

        <p>
          Discover a mouthwatering selection of must-try favorites — from
          timeless classics to local specialties — that will satisfy every
          craving.
        </p>
      </div>

      <div className="landing2__images">
        <div className="landing2__image-section">
          <img
            className="landing2__image"
            src="Image/pancit-alanganin02.png"
            alt="No Image Found"
          />
          <h2>Pancit Alanganin</h2>
        </div>

        <div className="landing2__image-section">
          <img
            className="landing2__image"
            src="Image/pancit-palabok02.png"
            alt="No Image Found"
          />
          <h2>Pancit Palabok</h2>
        </div>

        <div className="landing2__image-section">
          <img
            className="landing2__image"
            src="Image/pancit-guisado02.png"
            alt="No Image Found"
          />
          <h2>Pancit Guisado</h2>
        </div>

        <div className="landing2__image-section">
          <img
            className="landing2__image"
            src="Image/pancit-mami02.png"
            alt="No Image Found"
          />
          <h2>
            Pancit <br /> Mami
          </h2>
        </div>
      </div>
    </div>
  );
}

export default LandingPageMain2;
