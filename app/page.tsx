"use client";

import { useEffect, useState } from "react";

type Deal = {
  title: string;
  price: string;
  category: string;
  quality: string;
  source: string;
  link: string;
  image: string;
  timestamp: string;
};

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    "All",
    "GPUs",
    "SSDs",
    "Gaming",
    "TVs",
    "Laptops",
    "Accessories",
    "Hardware",
    "Other",
  ];

  useEffect(() => {
    async function loadDeals() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/deals.json");

        if (!response.ok) {
          throw new Error(`Failed to load deals.json (${response.status})`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("deals.json must contain an array of deals");
        }

        setDeals(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load deals.json"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDeals();
  }, []);

  const filteredDeals =
    activeCategory === "All"
      ? deals
      : deals.filter((deal) => deal.category === activeCategory);

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
        <img
          src="/goblin-logo.png"
          alt="GoblinTechUK logo"
          style={{
            height: "70px",
            width: "auto",
          }}
        />

        <nav style={{ display: "flex", gap: "25px" }}>
          <a href="#home" style={navLinkStyle}>
            Home
          </a>
          <a href="#deals" style={navLinkStyle}>
            Deals
          </a>
          <a href="#about" style={navLinkStyle}>
            About
          </a>
        </nav>
      </header>

      <section
        style={{
          padding: "90px 40px",
          backgroundImage:
            "linear-gradient(90deg, rgba(15,17,21,0.95), rgba(15,17,21,0.55)), url('/goblin-wallpaper.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p style={{ color: "#8cff4f", fontWeight: "bold" }}>
          UK TECH DEAL HUNTER
        </p>

        <h1 style={{ fontSize: "4rem", margin: "10px 0" }}>
          Deals found by goblins.
          <br />
          Sorted so you don&apos;t have to.
        </h1>

        <p style={{ color: "#aaa", fontSize: "1.2rem", maxWidth: "650px" }}>
          We hunt the best tech deals across the UK. GPUs, gaming, electronics
          and gadgets. No endless scrolling. No nonsense. Just the best deals,
          handpicked by our goblins.
        </p>
      </section>

      <section id="deals" style={{ padding: "50px 40px 60px" }}>
        <h2 style={{ marginBottom: "20px" }}>Latest Deals</h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                background:
                  activeCategory === category ? "#8cff4f" : "#1a1d24",
                color: activeCategory === category ? "#111" : "#c7c7c7",
                border: "1px solid #2d313a",
                borderRadius: "999px",
                padding: "10px 16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p style={{ color: "#aaa", fontSize: "1.1rem" }}>
            Loading latest deals...
          </p>
        ) : error ? (
          <p style={{ color: "#ff6b6b", fontSize: "1.1rem" }}>{error}</p>
        ) : filteredDeals.length === 0 ? (
          <p style={{ color: "#aaa", fontSize: "1.1rem" }}>
            The goblins are still hunting...
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredDeals.map((deal) => (
              <div
                key={`${deal.source}-${deal.link}-${deal.timestamp}`}
                style={{
                  background: "#1a1d24",
                  padding: "25px",
                  borderRadius: "16px",
                  border: "1px solid #2d313a",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <span style={{ color: "#8cff4f", fontWeight: "bold" }}>
                    {deal.category}
                  </span>

                  <span
                    style={{
                      background: "#263319",
                      color: "#8cff4f",
                      borderRadius: "999px",
                      padding: "4px 10px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {deal.quality}
                  </span>
                </div>

                {deal.image ? (
                  <img
                    src={deal.image}
                    alt={deal.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "contain",
                      background: "#0f1115",
                      borderRadius: "10px",
                      border: "1px solid #2d313a",
                      marginBottom: "18px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "180px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#0f1115",
                      color: "#777",
                      borderRadius: "10px",
                      border: "1px solid #2d313a",
                      marginBottom: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    No image
                  </div>
                )}

                <h3 style={{ fontSize: "1.4rem", marginBottom: "15px" }}>
                  {deal.title}
                </h3>

                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    marginBottom: "15px",
                  }}
                >
                  {deal.price}
                </p>

                <p style={{ color: "#aaa", marginBottom: "20px" }}>
                  {deal.source}
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
        )}
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
          <a href="#about" style={navLinkStyle}>
            About
          </a>
          <a href="#contact" style={navLinkStyle}>
            Contact
          </a>
          <a href="#affiliate" style={navLinkStyle}>
            Affiliate Disclosure
          </a>
          <a href="#privacy" style={navLinkStyle}>
            Privacy Policy
          </a>
        </div>

        <p>&copy; 2026 GoblinTechUK</p>
      </footer>
    </main>
  );
}
