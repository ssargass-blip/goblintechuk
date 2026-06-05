export default function Home() {
  const deals = [
    {
      title: "RTX 5070 Ti",
      price: "£699",
      store: "Amazon UK",
      category: "Graphics Card",
      link: "https://www.amazon.co.uk/",
    },
    {
      title: "Samsung 990 Pro 2TB",
      price: "£109",
      store: "Ebuyer",
      category: "SSD",
      link: "https://www.ebuyer.com/",
    },
    {
      title: "LG OLED 55”",
      price: "£799",
      store: "Currys",
      category: "TV",
      link: "https://www.currys.co.uk/",
    },
  ];

  const navLinkStyle = {
    color: "#c7c7c7",
    textDecoration: "none",
  };

  return (
    <main
      id="home"
      style={{
        minHeight: "100vh",
        background: "#0f1115",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "25px 40px",
          borderBottom: "1px solid #2a2d35",
        }}
      >
        <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
          🧌 GoblinTechUK
        </div>

        <nav style={{ display: "flex", gap: "25px" }}>
          <a href="#home" style={navLinkStyle}>Home</a>
          <a href="#deals" style={navLinkStyle}>Deals</a>
          <a href="#about" style={navLinkStyle}>About</a>
        </nav>
      </header>

      <section style={{ padding: "60px 40px 30px" }}>
        <p style={{ color: "#8cff4f", fontWeight: "bold" }}>
          UK TECH DEAL HUNTER
        </p>

        <h1 style={{ fontSize: "4rem", margin: "10px 0" }}>
          Deals found by goblins.
          <br />
          Sorted so you don't have to.
        </h1>

        <p style={{ color: "#aaa", fontSize: "1.2rem", maxWidth: "650px" }}>
          We hunt the best tech deals across the UK. GPUs, gaming, electronics
          and gadgets. No endless scrolling. No nonsense. Just the best deals,
          handpicked by our goblins.
        </p>
      </section>

      <section id="deals" style={{ padding: "20px 40px 60px" }}>
        <h2 style={{ marginBottom: "20px" }}>Latest Deals</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {deals.map((deal, index) => (
            <div
              key={index}
              style={{
                background: "#1a1d24",
                padding: "25px",
                borderRadius: "16px",
                border: "1px solid #2d313a",
              }}
            >
              <p style={{ color: "#8cff4f", marginBottom: "10px" }}>
                {deal.category}
              </p>

              <h3 style={{ fontSize: "1.4rem", marginBottom: "15px" }}>
                {deal.title}
              </h3>

              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                {deal.price}
              </p>

              <p style={{ color: "#aaa", marginBottom: "20px" }}>
                {deal.store}
              </p>

              <a
                href={deal.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#8cff4f",
                  color: "#111",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                View Deal
              </a>
            </div>
          ))}
        </div>
      </section>

      <section
        id="about"
        style={{
          padding: "50px 40px",
          borderTop: "1px solid #2d313a",
        }}
      >
        <h2>About GoblinTechUK</h2>
        <p style={{ color: "#aaa", maxWidth: "800px", lineHeight: "1.8" }}>
          GoblinTechUK tracks technology, gaming and electronics deals across
          the United Kingdom. The goal is simple: find useful bargains, remove
          the junk, and save people from endless scrolling.
        </p>
      </section>

      <section
        id="contact"
        style={{
          padding: "50px 40px",
          borderTop: "1px solid #2d313a",
        }}
      >
        <h2>Contact</h2>
        <p style={{ color: "#aaa", maxWidth: "800px", lineHeight: "1.8" }}>
          For now, GoblinTechUK is under construction. A contact email and
          social links will be added soon.
        </p>
      </section>

      <section
        id="affiliate"
        style={{
          padding: "50px 40px",
          borderTop: "1px solid #2d313a",
        }}
      >
        <h2>Affiliate Disclosure</h2>
        <p style={{ color: "#aaa", maxWidth: "800px", lineHeight: "1.8" }}>
          Some links on GoblinTechUK may become affiliate links. This means we
          may earn a small commission if you buy through them, at no extra cost
          to you.
        </p>
      </section>

      <section
        id="privacy"
        style={{
          padding: "50px 40px",
          borderTop: "1px solid #2d313a",
        }}
      >
        <h2>Privacy Policy</h2>
        <p style={{ color: "#aaa", maxWidth: "800px", lineHeight: "1.8" }}>
          GoblinTechUK does not currently collect personal data. If analytics,
          forms, cookies or affiliate tracking are added later, this section
          will be updated.
        </p>
      </section>

      <footer
        style={{
          borderTop: "1px solid #2d313a",
          padding: "30px 40px",
          color: "#aaa",
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong style={{ color: "white" }}>GoblinTechUK</strong>
          <p style={{ marginTop: "8px" }}>Built for UK tech deal hunters.</p>
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <a href="#about" style={navLinkStyle}>About</a>
          <a href="#contact" style={navLinkStyle}>Contact</a>
          <a href="#affiliate" style={navLinkStyle}>Affiliate Disclosure</a>
          <a href="#privacy" style={navLinkStyle}>Privacy Policy</a>
        </div>

        <p>© 2026 GoblinTechUK</p>
      </footer>
    </main>
  );
}