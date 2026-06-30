"use client";

import { useEffect, useState } from "react";

type Deal = {
  title: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  category: string;
  quality: string;
  merchant?: string;
  source: string;
  link: string;
  image: string;
  timestamp: string;
  dealType?: string;
  offerId?: string;
  offerStartDate?: string;
  offerEndDate?: string;
  offerStatus?: string;
  description?: string;
};

type SortOption = "newest" | "price-asc" | "price-desc" | "az" | "za";

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedOfferGroup, setSelectedOfferGroup] = useState<string | null>(null);

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

  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 500);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const isOffer = (deal: Deal) =>
    deal.dealType === "offer" || deal.source.toLowerCase().includes("awin promotions");

  const isExpiredOffer = (deal: Deal) => {
    if (!isOffer(deal) || !deal.offerEndDate) {
      return false;
    }

    const expiry = new Date(deal.offerEndDate);

    if (Number.isNaN(expiry.getTime())) {
      return false;
    }

    return expiry.getTime() < Date.now();
  };

  const featuredOffers = deals.filter((deal) => isOffer(deal) && !isExpiredOffer(deal));
  const productDeals = deals.filter((deal) => !isOffer(deal));

  const offerGroups = [
    {
      title: "Acer Offers",
      offers: featuredOffers.filter(
        (offer) => offer.merchant?.trim().toLowerCase() === "acer"
      ),
    },
    {
      title: "Box.co.uk Offers",
      offers: featuredOffers.filter((offer) => {
        const merchant = offer.merchant?.trim().toLowerCase();
        const link = offer.link.toLowerCase();

        return (
          merchant === "box" ||
          merchant === "box.co.uk" ||
          link.includes("box.co.uk")
        );
      }),
    },
  ].filter((group) => group.offers.length > 0);

  const selectedOfferGroupData = offerGroups.find(
    (group) => group.title === selectedOfferGroup
  );

  const getPriceNumber = (price: string) => {
    const match = price.match(/[0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?/);

    if (!match) {
      return Number.POSITIVE_INFINITY;
    }

    return Number(match[0].replace(/,/g, ""));
  };

  const formatFoundTime = (timestamp: string) => {
    const foundAt = new Date(timestamp);

    if (Number.isNaN(foundAt.getTime())) {
      return "";
    }

    const now = new Date();
    const diffMs = now.getTime() - foundAt.getTime();
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

    if (foundAt.toDateString() === now.toDateString()) {
      if (diffMinutes < 60) {
        return diffMinutes <= 1 ? "Found just now" : `Found ${diffMinutes}m ago`;
      }

      const diffHours = Math.floor(diffMinutes / 60);
      return diffHours <= 1 ? "Found 1h ago" : `Found ${diffHours}h ago`;
    }

    const diffDays = Math.max(1, Math.floor(diffMinutes / 1440));

    if (diffDays === 1) {
      return "Found yesterday";
    }

    if (diffDays < 7) {
      return `Found ${diffDays}d ago`;
    }

    return foundAt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const formatOfferExpiry = (offerEndDate?: string) => {
    if (!offerEndDate) {
      return "";
    }

    const expiry = new Date(offerEndDate);

    if (Number.isNaN(expiry.getTime())) {
      return "";
    }

    return expiry.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDealUrl = (deal: Deal) => {
    const merchant = deal.merchant?.trim().toLowerCase();
    const link = deal.link || "";
    const isAcerDeal =
      merchant === "acer" || link.toLowerCase().includes("store.acer.com");
    const isBoxDeal =
      merchant === "box" ||
      merchant === "box.co.uk" ||
      link.toLowerCase().includes("box.co.uk");

    if (isAcerDeal) {
      return `https://www.awin1.com/cread.php?awinmid=12590&awinaffid=2936395&ued=${encodeURIComponent(
        link
      )}`;
    }

    if (isBoxDeal) {
      return `https://www.awin1.com/cread.php?awinmid=100685&awinaffid=2936395&ued=${encodeURIComponent(
        link
      )}`;
    }

    return link;
  };

  const filteredDeals = productDeals
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
            box-sizing: border-box !important;
            min-height: clamp(235px, 67vw, 340px) !important;
            padding: 16px !important;
            background-size: 100% auto !important;
            background-position: center top !important;
            background-repeat: no-repeat !important;
          }

          .hero-title {
            font-size: 2.45rem !important;
            line-height: 1.08 !important;
          }

          .hero-copy {
            font-size: 1rem !important;
          }

          .deals-section {
            padding: 28px 16px 48px !important;
          }

          .featured-pick {
            padding: 16px !important;
          }

          .featured-title {
            font-size: 1.08rem !important;
            overflow-wrap: anywhere !important;
          }

          .featured-price {
            font-size: 1.55rem !important;
          }

          .featured-offers-grid {
            gap: 10px !important;
            margin-bottom: 24px !important;
          }

          .featured-offer-card {
            border-left-width: 3px !important;
            border-radius: 12px !important;
            gap: 8px !important;
            min-height: auto !important;
            padding: 12px !important;
          }

          .featured-offer-title {
            font-size: 0.98rem !important;
            line-height: 1.22 !important;
          }

          .featured-offer-card p {
            font-size: 0.82rem !important;
            line-height: 1.35 !important;
          }

          .featured-offer-card a {
            padding: 9px 12px !important;
            font-size: 0.9rem !important;
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
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#0f1115",
        }}
      >
      </section>

      <section
        id="deals"
        className="deals-section"
        style={{ padding: "50px 40px 60px" }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "8px" }}>Featured Offers</h2>
          <p
            style={{
              color: "#9ba3af",
              lineHeight: "1.6",
              margin: 0,
              maxWidth: "760px",
            }}
          >
            Limited-time partner offers checked by GoblinTechUK. Offer details,
            prices and availability can change at the retailer.
          </p>
        </div>

        {isLoading ? (
          <p style={{ color: "#aaa", fontSize: "1.1rem", marginBottom: "30px" }}>
            Loading featured offers...
          </p>
        ) : error ? (
          <p style={{ color: "#ff6b6b", fontSize: "1.1rem", marginBottom: "30px" }}>
            {error}
          </p>
        ) : featuredOffers.length === 0 ? (
          <section
            className="featured-offers-panel"
            style={{
              background: "#12161d",
              border: "1px solid #31421f",
              borderLeft: "5px solid #8cff4f",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "34px",
            }}
          >
            <p style={{ color: "#aaa", fontSize: "1.1rem", margin: 0 }}>
              The goblins are still hunting...
            </p>
          </section>
        ) : selectedOfferGroupData ? (
          <div style={{ display: "grid", gap: "16px", marginBottom: "30px" }}>
            <button
              type="button"
              onClick={() => setSelectedOfferGroup(null)}
              style={{
                alignSelf: "start",
                background: "#1a1d24",
                border: "1px solid #31421f",
                borderRadius: "999px",
                color: "#8cff4f",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "bold",
                padding: "9px 14px",
              }}
            >
              Back to all offers
            </button>

            <section>
              <h3
                style={{
                  color: "#e8edf5",
                  fontSize: "1.15rem",
                  margin: "0 0 10px",
                }}
              >
                {selectedOfferGroupData.title}
              </h3>

              <div
                className="featured-offers-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "14px",
                }}
              >
                {selectedOfferGroupData.offers.map((offer) => (
                  <article
                    className="featured-offer-card"
                    key={`${offer.source}-${offer.link}-${offer.offerId || offer.timestamp}`}
                    style={{
                      background: "#12161d",
                      border: "1px solid #31421f",
                      borderLeft: "5px solid #8cff4f",
                      borderRadius: "16px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      minHeight: "150px",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#8cff4f",
                          fontSize: "0.78rem",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        Partner Offer
                      </span>

                      <span
                        style={{
                          background: "#263319",
                          color: "#8cff4f",
                          border: "1px solid #3f5f25",
                          borderRadius: "999px",
                          padding: "3px 8px",
                          fontSize: "0.74rem",
                          fontWeight: "bold",
                        }}
                      >
                        {offer.offerStatus || "Active"}
                      </span>
                    </div>

                    <h3
                      className="featured-offer-title"
                      style={{
                        fontSize: "1.05rem",
                        lineHeight: "1.25",
                        margin: 0,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {offer.title}
                    </h3>

                    {offer.description && (
                      <p
                        style={{
                          color: "#b6bdc8",
                          lineHeight: "1.4",
                          margin: 0,
                          fontSize: "0.9rem",
                        }}
                      >
                        {offer.description}
                      </p>
                    )}

                    <div style={{ marginTop: "auto" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          flexWrap: "wrap",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            color: "#c7c7c7",
                            background: "#0f1115",
                            border: "1px solid #2d313a",
                            borderRadius: "999px",
                            padding: "5px 9px",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                          }}
                        >
                          {offer.merchant || offer.source}
                        </span>

                        {formatOfferExpiry(offer.offerEndDate) && (
                          <span
                            style={{
                              background: "#332b18",
                              border: "1px solid #594719",
                              borderRadius: "999px",
                              color: "#f3c969",
                              padding: "5px 9px",
                              fontSize: "0.85rem",
                              fontWeight: "bold",
                            }}
                          >
                            Ends {formatOfferExpiry(offer.offerEndDate)}
                          </span>
                        )}
                      </div>

                      <a
                        href={getDealUrl(offer)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          background: "#8cff4f",
                          color: "#111",
                          borderRadius: "10px",
                          padding: "10px 14px",
                          fontWeight: "bold",
                          textDecoration: "none",
                        }}
                      >
                        View Offer
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div
            className="offer-partner-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginBottom: "30px",
            }}
          >
            {offerGroups.map((group) => (
              <button
                type="button"
                key={group.title}
                onClick={() => setSelectedOfferGroup(group.title)}
                style={{
                  background: "#12161d",
                  border: "1px solid #31421f",
                  borderLeft: "5px solid #8cff4f",
                  borderRadius: "16px",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
                  color: "white",
                  cursor: "pointer",
                  minHeight: "130px",
                  padding: "18px",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    color: "#8cff4f",
                    display: "block",
                    fontSize: "0.78rem",
                    fontWeight: "bold",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                  }}
                >
                  Partner Offers
                </span>

                <strong
                  style={{
                    display: "block",
                    fontSize: "1.25rem",
                    lineHeight: "1.2",
                    marginBottom: "10px",
                  }}
                >
                  {group.title}
                </strong>

                <span
                  style={{
                    color: "#b6bdc8",
                    display: "block",
                    fontSize: "0.92rem",
                    marginBottom: "16px",
                  }}
                >
                  {group.offers.length} active offer
                  {group.offers.length === 1 ? "" : "s"}
                </span>

                <span
                  style={{
                    color: "#8cff4f",
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                  }}
                >
                  View {group.title}
                </span>
              </button>
            ))}
          </div>
        )}

        <h2 style={{ marginBottom: "20px" }}>Product Deals</h2>

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
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
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

                <div style={{ marginBottom: "18px" }}>
                  {deal.oldPrice && (
                    <p
                      style={{
                        color: "#8b929d",
                        fontSize: "0.95rem",
                        fontWeight: "bold",
                        marginBottom: "4px",
                        textDecoration: "line-through",
                      }}
                    >
                      {deal.oldPrice}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      className="deal-price"
                      style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "#8cff4f",
                        margin: 0,
                      }}
                    >
                      {deal.price}
                    </p>

                    {deal.discount && (
                      <span
                        style={{
                          display: "inline-block",
                          background: "#263319",
                          color: "#8cff4f",
                          border: "1px solid #3f5f25",
                          borderRadius: "999px",
                          padding: "4px 9px",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        🔥 {deal.discount}
                      </span>
                    )}
                  </div>
                </div>

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

                  {formatFoundTime(deal.timestamp) && (
                    <span
                      style={{
                        color: "#8b929d",
                        fontSize: "0.82rem",
                        fontWeight: "bold",
                        marginTop: "-10px",
                      }}
                    >
                      {formatFoundTime(deal.timestamp)}
                    </span>
                  )}

                  <a
                    href={getDealUrl(deal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      background: "#8cff4f",
                      color: "#111",
                      borderRadius: "10px",
                      padding: "10px 14px",
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
          Email:{" "}
          <a href="mailto:hello@goblintechuk.uk" style={{ color: "#8cff4f" }}>
            hello@goblintechuk.uk
          </a>
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
          Some links on GoblinTechUK are affiliate links. If you buy through
          them, we may earn a small commission at no extra cost to you. We still
          aim to show useful UK tech deals first, not junk.
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
          <p style={{ marginTop: "8px" }}>
            Independent UK tech deal finder. Prices and availability may change.
          </p>
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

      {showBackToTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={scrollToTop}
          style={{
            position: "fixed",
            right: "18px",
            bottom: "18px",
            width: "48px",
            height: "48px",
            borderRadius: "999px",
            border: "1px solid #8cff4f",
            background: "#11141a",
            color: "#8cff4f",
            fontSize: "1.5rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
            zIndex: 50,
          }}
        >
          ↑
        </button>
      )}
    </main>
  );
}
