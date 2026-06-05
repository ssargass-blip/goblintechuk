export default function Home() {
  const deals = [
    {
      title: "RTX 5070 Ti",
      price: "£699",
      store: "Amazon UK",
      category: "Graphics Card",
    },
    {
      title: "Samsung 990 Pro 2TB",
      price: "£109",
      store: "Ebuyer",
      category: "SSD",
    },
    {
      title: "LG OLED 55”",
      price: "£799",
      store: "Currys",
      category: "TV",
    },
  ];

  return (
    <main
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

        <nav style={{ display: "flex", gap: "25px", color: "#c7c7c7" }}>
          <span>Home</span>
          <span>Deals</span>
          <span>About</span>
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
          We hunt the best tech deals across the UK.
          GPUs, gaming, electronics and gadgets.
          No endless scrolling. No nonsense. just the best deals, handpicked by our goblins.
        </p>
      </section>

      <section style={{ padding: "20px 40px 60px" }}>
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

              <button
                style={{
                  background: "#8cff4f",
                  color: "#111",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                View Deal
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}