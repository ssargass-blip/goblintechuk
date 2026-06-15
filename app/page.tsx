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

type SortOption = "newest" | "price-asc" | "price-desc" | "az" | "za";

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    "All",
    "GPUs",
    "SSDs",
    "Gaming",
    "Monitors",
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

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const getPriceNumber = (price: string) => {
    const match = price.match(/[0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?/);

    if (!match) {
      return Number.POSITIVE_INFINITY;
    }

    return Number(match[0].replace(/,/g, ""));
  };

  const filteredDeals = deals
    .filter((deal) => {
      const matchesCategory =
        activeCategory === "All" || deal.category === activeCategory;
      const matchesSearch =
        normalizedSearchQuery === "" ||
        deal.title.toLowerCase().includes(normalizedSearchQuery);

      return matchesCategory && matchesSearch;
    })
    .sort((firstDeal, secondDeal) => {
      if (sortOption === "price-asc") {
        return getPriceNumber(firstDeal.price) - getPriceNumber(secondDeal.price);
      }

      if (sortOption === "price-desc") {
        return getPriceNumber(secondDeal.price) - getPriceNumber(firstDeal.price);
      }

      if (sortOption === "az") {
        return firstDeal.title.localeCompare(secondDeal.title);
      }

      if (sortOption === "za") {
        return secondDeal.title.localeCompare(firstDeal.title);
      }

      return (
        new Date(secondDeal.timestamp).getTime() -
        new Date(firstDeal.timestamp).getTime()
      );
    });

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
      <style>{`
        @media (max-width: 767px) {
          .site-header {
            align-items: flex-start !important;
            flex-direction: column !important;
            gap: 18px !important;
            padding: 18px 16px !important;
          }

          .site-nav {
            gap: 18px !important;
            overflow-x: auto !important;
            width: 100% !important;
          }

          .hero-section {
            min-height: 58vh !important;
            padding: 28px 16px !important;
            background-size: cover !important;
            background-position: center top !important;
          }

          .hero-title {
            font-size: 2.45rem !important;
            line-height: 1.08 !important;
          }

          .hero-copy {
            font-size: 1rem !important;
          }

          .deals-section {
            padding: 36px 16px 48px !important;
          }

          .category-scroll {
            flex-wrap: nowrap !important;
            margin-left: -16px !important;
            margin-right: -16px !important;
            overflow-x: auto !important;
            padding: 0 16px 8px !important;
            scrollbar-width: none !important;
          }

          .category-scroll::-webkit-scrollbar {
            display: none !important;
          }

          .category-button {
            flex: 0 0 auto !important;
          }

          .deal-controls {
            flex-direction: column !important;
          }

          .deal-search,
          .deal-sort {
            flex: 1 1 auto !important;
            max-width: none !important;
            width: 100% !important;
          }

          .deals-grid {
            grid-template-columns: 1fr !important;
          }

          .deal-card {
            padding: 18px !important;
          }

          .deal-meta {
            align-items: flex-start !important;
            flex-direction: column !important;
          }

          .deal-title {
            font-size: 1.12rem !important;
            line-height: 1.35 !important;
            overflow-wrap: anywhere !important;
          }

          .deal-price {
            font-size: 1.65rem !important;
          }

          .deal-image {
            height: 160px !important;
          }
        }
      `}</style>

      <header
        className="site-header"
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

        <nav className="site-nav" style={{ display: "flex", gap: "25px" }}>
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
        className="hero-section"
        style={{
          minHeight: "clamp(560px, 62vw, 860px)",
          padding: "40px",
          backgroundImage:
            "linear-gradient(90deg, rgba(15,17,21,0.32), rgba(15,17,21,0.08)), url('/goblin-wallpaper.png')",
          backgroundSize: "100% auto",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#0f1115",
        }}
      >
        <p style={{ color: "#8cff4f", fontWeight: "bold" }}>
          UK TECH DEAL HUNTER
        </p>
      </section>

      <section
        id="deals"
        className="deals-section"
        style={{ padding: "50px 40px 60px" }}
      >
        <h2 style={{ marginBottom: "20px" }}>Latest Deals</h2>

        <div
          className="category-scroll"
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          {categories.map((category) => (
            <button
              className="category-button"
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

        <div
          className="deal-controls"
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <input
            className="deal-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search deals..."
            aria-label="Search deals by product title"
            style={{
              flex: "1 1 280px",
              maxWidth: "520px",
              background: "#1a1d24",
              color: "white",
              border: "1px solid #2d313a",
              borderRadius: "12px",
              padding: "14px 16px",
              fontSize: "1rem",
              outline: "none",
            }}
          />

          <select
            className="deal-sort"
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value as SortOption)}
            aria-label="Sort deals"
            style={{
              flex: "0 1 220px",
              background: "#1a1d24",
              color: "white",
              border: "1px solid #2d313a",
              borderRadius: "12px",
              padding: "14px 16px",
              fontSize: "1rem",
              fontWeight: "bold",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
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
            className="deals-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredDeals.map((deal) => (
              <div
                className="deal-card"
                key={`${deal.source}-${deal.link}-${deal.timestamp}`}
                style={{
                  background: "#1a1d24",
                  padding: "25px",
                  borderRadius: "16px",
                  border: "1px solid #2d313a",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  className="deal-meta"
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
                      background: deal.quality.includes("GOOD PRICE")
                        ? "#263319"
                        : "#332b18",
                      color: deal.quality.includes("GOOD PRICE")
                        ? "#8cff4f"
                        : "#f3c969",
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
                    className="deal-image"
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
                    className="deal-image"
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

                <h3
                  className="deal-title"
                  style={{ fontSize: "1.4rem", marginBottom: "15px" }}
                >
                  {deal.title}
                </h3>

                <p
                  className="deal-price"
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#8cff4f",
                    marginBottom: "18px",
                  }}
                >
                  {deal.price}
                </p>

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      color: "#c7c7c7",
                      background: "#11141a",
                      border: "1px solid #2d313a",
                      borderRadius: "999px",
                      padding: "6px 10px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    {deal.source}
                  </span>

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
