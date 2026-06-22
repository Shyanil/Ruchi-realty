/* ============================================================
   Ruchi Realty — App composer + Tweaks (v2)
   ============================================================ */
const { useEffect: uEA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "customCursor": true,
  "motion": true,
  "carouselSpeed": 64,
  "accent": "#bed747"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  uEA(() => {
    document.documentElement.style.setProperty("--marquee-dur", `${t.carouselSpeed}s`);
  }, [t.carouselSpeed]);

  uEA(() => {
    document.body.classList.toggle("no-motion", !t.motion);
  }, [t.motion]);

  uEA(() => {
    // arriving from another page with a #hash — scroll once content exists
    if (window.location.hash) {
      const h = window.location.hash;
      setTimeout(() => window.smoothTo && smoothTo(h), 80);
    }
  }, []);

  uEA(() => {
    document.documentElement.style.setProperty("--rr-lime", t.accent);
  }, [t.accent]);

  const scrollToContact = () =>
    document.querySelector("#contact").scrollIntoView({ behavior: t.motion ? "smooth" : "auto" });

  return (
    <React.Fragment>
      {t.customCursor ? <CustomCursor /> : null}
      <Nav onContact={scrollToContact} />
      <main>
        <Hero />
        <Intro />
        <Projects />
        <About />
        <WhyChoose />
        <Testimonials />
        <Awards />
        <Press />
        <Blog />
        <Contact />
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Feel" />
        <TweakToggle label="Custom cursor" value={t.customCursor} onChange={(v) => setTweak("customCursor", v)} />
        <TweakToggle label="Motion & reveals" value={t.motion} onChange={(v) => setTweak("motion", v)} />
        <TweakSection label="Awards" />
        <TweakSlider label="Carousel speed" value={t.carouselSpeed} min={30} max={120} step={4} unit="s"
          onChange={(v) => setTweak("carouselSpeed", v)} />
        <TweakSection label="Brand accent" />
        <TweakColor label="Highlight" value={t.accent}
          options={["#bed747", "#4ab969", "#a8782a", "#2e3192"]} onChange={(v) => setTweak("accent", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
