import "./Landing-Page-3.css";

function LandingPageMain3() {
  return (
    <div id="about-us" className="landing3">
      <div className="landing3__text-wrapper">
        <div className="landing3__text1">
          <h1>Drop by and taste the difference!</h1>
        </div>

        <div className="landing3__text2">
          <p>
            Nory’s Restaurant in Bocaue, Bulacan is a well-loved local spot
            known for its home cooked meals and welcoming atmosphere.
          </p>
        </div>

        <div className="landing3__text3">
          <p>
            Its signature dish, Pancit Alanganin, is a creamy and flavorful
            version of pancit bihon. Described as “Alanganing sopas, alanganing
            pancit,” it was created by Felicidad Esguerra and passed down to her
            grand daughter, Gemma Cruz, keeping the tradition alive through
            generations.
          </p>
        </div>
      </div>

      <div className="landing3__image-wrapper">
        <div className="landing3__image-bg" />
        <img
          className="landing3__image-main"
          src="/Image/norys_house.png"
          alt="No Image Found"
        />
      </div>
    </div>
  );
}

export default LandingPageMain3;
