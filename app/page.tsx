"use client";

import { useState } from "react";

export default function Home() {
  const deals = [
    {
      title: "RTX 5070 Ti",
      price: "£699",
      oldPrice: "£799",
      discount: "-13%",
      store: "Amazon UK",
      category: "GPUs",
      tag: "Hot Deal",
      postedAt: "Today",
      link: "https://www.amazon.co.uk/",
    },
    {
      title: "Samsung 990 Pro 2TB",
      price: "£109",
      oldPrice: "£149",
      discount: "-27%",
      store: "Ebuyer",
      category: "SSDs",
      tag: "Fast Storage",
      postedAt: "Today",
      link: "https://www.ebuyer.com/",
    },
    {
      title: "LG OLED 55”",
      price: "£799",
      oldPrice: "£999",
      discount: "-20%",
      store: "Currys",
      category: "TVs",
      tag: "Big Screen",
      postedAt: "Today",
      link: "https://www.currys.co.uk/",
    },
  ];

  const categories = [
    "All",
    "GPUs",
    "SSDs",
    "Gaming",
    "TVs",
    "Laptops",
    "Accessories",
  ];

  const [activeCategory, setActiveCategory] = useState("All");

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
          Sorted so you don't have to.
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

        {filteredDeals.length === 0 ? (
          <p style={{ color: "#aaa", fontSize: "1.1rem" }}>
            No deals found. The goblins are still hunting.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredDeals.map((deal, index) => (
              <div
                key={index}
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
                    {deal.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.4rem", marginBottom: "15px" }}>
                  {deal.title}
                </h3>

                <p
                  style={{
                    color: "#777",
                    textDecoration: "line-through",
                    marginBottom: "5px",
                  }}
                >
                  {deal.oldPrice}
                </p>

                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  {deal.price}
                </p>

                <p style={{ color: "#8cff4f", marginBottom: "15px" }}>
                  {deal.discount}
                </p>

                <p style={{ color: "#aaa", marginBottom: "8px" }}>
                  {deal.store}
                </p>

                <p style={{ color: "#777", marginBottom: "20px" }}>
                  Posted: {deal.postedAt}
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

        <p>© 2026 GoblinTechUK</p>
      </footer>
    </main>
  );
}