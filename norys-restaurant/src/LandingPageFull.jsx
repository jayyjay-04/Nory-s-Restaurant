import LandingMainHeader from "./Header";
import LandingPageMain from "./Landing-Page-1";
import LandingPageMain2 from "./Landing-Page-2";
import LandingPageMain3 from "./Landing-Page-3";
import LandingPageMain4 from "./Landing-Page-4";
import LandingPageMain5 from "./Landing-Page-5";
import LandingPageMain6 from "./Landing-Page-6";
import FooterMain1, { FooterMain2 } from "./Footer-1";

function LandingPageFull({ onOrderNow }) {
  // accept the prop
  return (
    <>
      <LandingMainHeader />
      <section>
        <LandingPageMain onOrderNow={onOrderNow} /> {/* pass prop here */}
      </section>
      <section>
        <LandingPageMain2 />
      </section>
      <section>
        <LandingPageMain3 />
      </section>
      <section>
        <LandingPageMain4 />
      </section>
      <section>
        <LandingPageMain5 />
      </section>
      <section>
        <LandingPageMain6 />
      </section>
      <section>
        <FooterMain1 />
      </section>
      <section>
        <FooterMain2 />
      </section>
    </>
  );
}

export default LandingPageFull;
