export function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{
        minHeight: "clamp(560px, 62vw, 860px)",
        padding: "40px",
        backgroundImage:
          "linear-gradient(90deg, rgba(15,17,21,0.32), rgba(15,17,21,0.08)), url('/goblin-wallpaper.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#050806",
      }}
    >
      <h1 className="sr-only">GoblinTechUK - UK Tech Deal Hunter</h1>
    </section>
  );
}
