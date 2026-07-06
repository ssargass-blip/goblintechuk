"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BackToTopButton } from "./components/BackToTopButton";
import { HeroSection } from "./components/HeroSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import type { Deal, SortOption } from "./types";

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedOfferGroup, setSelectedOfferGroup] = useState<string | null>(null);
  const [currentTimeMs] = useState(() => Date.now());

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
      setShowBackToTop(window.scrollY > 260);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    document.getElementById("product-deals-controls")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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

    return expiry.getTime() < currentTimeMs;
  };

  const getAwinMerchantId = (deal: Deal) => {
    const merchant = deal.merchant?.trim().toLowerCase();
    const link = (deal.link || "").toLowerCase();

    if (merchant === "acer" || link.includes("store.acer.com")) {
      return "12590";
    }

    if (merchant === "box" || merchant === "box.co.uk" || link.includes("box.co.uk")) {
      return "100685";
    }

    if (merchant === "aliexpress" || link.includes("aliexpress.")) {
      return "7035";
    }

    if (merchant === "amazon" || link.includes("amazon.co.uk")) {
      return "118045";
    }

    if (
      merchant === "stormforce gaming" ||
      merchant === "stormforce" ||
      link.includes("stormforcegaming.co.uk")
    ) {
      return "24882";
    }

    return null;
  };

  const isAffiliateDeal = (deal: Deal) => Boolean(getAwinMerchantId(deal));

  const featuredOffers = deals.filter(
    (deal) => isOffer(deal) && !isExpiredOffer(deal) && isAffiliateDeal(deal)
  );
  const productDeals = deals.filter(
    (deal) => !isOffer(deal) && isAffiliateDeal(deal)
  );

  const offerGroups = [
    {
      title: "Acer Offers",
      partnerName: "Acer UK",
      logo: "/images/partners/acer.webp",
      offers: featuredOffers.filter(
        (offer) => offer.merchant?.trim().toLowerCase() === "acer"
      ),
    },
    {
      title: "Box.co.uk Offers",
      partnerName: "Box.co.uk",
      logo: "/images/partners/box.webp",
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
    {
      title: "AliExpress Offers",
      partnerName: "AliExpress UK",
      logo: "/images/partners/aliexpress.webp",
      offers: featuredOffers.filter((offer) => {
        const merchant = offer.merchant?.trim().toLowerCase();
        const link = offer.link.toLowerCase();

        return merchant === "aliexpress" || link.includes("aliexpress.");
      }),
    },
    {
      title: "Amazon Offers",
      partnerName: "Amazon UK",
      offers: featuredOffers.filter((offer) => {
        const merchant = offer.merchant?.trim().toLowerCase();
        const link = offer.link.toLowerCase();

        return merchant === "amazon" || link.includes("amazon.co.uk");
      }),
    },
    {
      title: "Stormforce Offers",
      partnerName: "Stormforce Gaming",
      logo: "/images/partners/stormforce.jpg",
      offers: featuredOffers.filter((offer) => {
        const merchant = offer.merchant?.trim().toLowerCase();
        const link = offer.link.toLowerCase();

        return (
          merchant === "stormforce gaming" ||
          merchant === "stormforce" ||
          link.includes("stormforcegaming.co.uk")
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
    const link = deal.link || "";
    const awinMerchantId = getAwinMerchantId(deal);

    if (!awinMerchantId) {
      return link;
    }

    return `https://www.awin1.com/cread.php?awinmid=${awinMerchantId}&awinaffid=2936395&ued=${encodeURIComponent(
      link
    )}`;
  };
  const getStoreLogo = (deal: Deal) => {
    const merchant = deal.merchant?.trim().toLowerCase() || "";
    const source = deal.source.trim().toLowerCase();
    const link = deal.link.toLowerCase();
    const storeText = `${merchant} ${source} ${link}`;

    if (storeText.includes("acer")) {
      return { alt: "Acer", src: "/images/partners/acer.webp" };
    }

    if (storeText.includes("box.co.uk") || storeText.includes("box")) {
      return { alt: "Box.co.uk", src: "/images/partners/box.webp" };
    }

    if (storeText.includes("aliexpress")) {
      return { alt: "AliExpress", src: "/images/partners/aliexpress.webp" };
    }

    if (storeText.includes("amazon")) {
      return { alt: "Amazon", src: "/images/partners/Amazon.svg" };
    }

    if (storeText.includes("stormforce")) {
      return { alt: "Stormforce Gaming", src: "/images/partners/stormforce.jpg" };
    }

    return null;
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

  return (
    <main
      id="home"
      className="site-shell"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, rgba(5, 8, 6, 0.28), rgba(5, 8, 6, 0.54)), radial-gradient(circle at 18% 8%, rgba(129, 255, 86, 0.06), transparent 30%), radial-gradient(circle at 82% 28%, rgba(129, 255, 86, 0.04), transparent 34%), url('/site-background.webp'), linear-gradient(180deg, #050806 0%, #080b09 42%, #050806 100%)",
        backgroundSize: "auto, auto, auto, min(100vw, 1536px) auto, auto",
        backgroundPosition: "center, center, center, center top, center",
        backgroundRepeat: "no-repeat, no-repeat, no-repeat, repeat-y, no-repeat",
        color: "#f4f7f1",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <style>{`
        html,
        body {
          max-width: 100%;
          overflow-x: hidden;
        }

        .site-shell {
          box-sizing: border-box;
          max-width: 100%;
          overflow-x: clip;
          --goblin-bg: #050806;
          --goblin-panel: #14181d;
          --goblin-panel-soft: #101419;
          --goblin-border: rgba(198, 255, 173, 0.12);
          --goblin-border-strong: rgba(156, 255, 87, 0.34);
          --goblin-accent: #9cff57;
          --goblin-accent-soft: rgba(156, 255, 87, 0.1);
          --goblin-text: #f4f7f1;
          --goblin-muted: #aeb8aa;
          --goblin-muted-strong: #cfd6cb;
          --goblin-shadow: 0 18px 42px rgba(0, 0, 0, 0.22);
          --goblin-hover-glow: 0 0 0 1px rgba(156, 255, 87, 0.24), 0 18px 48px rgba(0, 0, 0, 0.34);
          background-attachment: fixed;
        }

        .site-shell h2,
        .site-shell h3,
        .site-shell strong {
          color: var(--goblin-text);
        }

        .site-shell p {
          color: var(--goblin-muted);
        }

        .site-header {
          background: rgba(5, 8, 6, 0.82);
          backdrop-filter: blur(18px);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.03);
        }

        .site-nav a,
        footer a {
          transition: color 180ms ease, opacity 180ms ease;
        }

        .site-nav a:hover,
        footer a:hover {
          color: var(--goblin-accent) !important;
        }

        .deals-section,
        #about,
        #contact,
        #affiliate,
        #privacy {
          position: relative;
        }

        .featured-offers-panel,
        .featured-offer-card,
        .offer-partner-grid button,
        .deal-card {
          background: linear-gradient(180deg, rgba(22, 26, 31, 0.98), rgba(16, 20, 25, 0.98)) !important;
          border-color: var(--goblin-border) !important;
          box-shadow: var(--goblin-shadow) !important;
          transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .featured-offers-panel,
        .featured-offer-card,
        .offer-partner-grid button {
          border-left-color: var(--goblin-accent) !important;
        }

        .featured-offers-panel:hover,
        .featured-offer-card:hover,
        .offer-partner-grid button:hover,
        .deal-card:hover {
          border-color: var(--goblin-border-strong) !important;
          box-shadow: var(--goblin-hover-glow) !important;
        }

        .category-button,
        .deal-search,
        .deal-sort {
          background: rgba(16, 20, 25, 0.92) !important;
          border-color: var(--goblin-border) !important;
          color: var(--goblin-muted-strong) !important;
          transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease;
        }

        .category-button:hover,
        .deal-search:focus,
        .deal-sort:focus {
          border-color: var(--goblin-border-strong) !important;
          box-shadow: 0 0 0 3px rgba(156, 255, 87, 0.08) !important;
        }

        .category-button[style*="#9cff57"],
        .category-button[style*="rgb(156, 255, 87)"] {
          background: var(--goblin-accent) !important;
          color: #071006 !important;
        }

        .site-shell a[style*="#9cff57"],
        .site-shell span[style*="#9cff57"],
        .site-shell p[style*="#9cff57"],
        .site-shell a[style*="rgb(156, 255, 87)"],
        .site-shell span[style*="rgb(156, 255, 87)"],
        .site-shell p[style*="rgb(156, 255, 87)"] {
          color: var(--goblin-accent) !important;
        }

        .site-shell a[style*="background: #9cff57"],
        .site-shell a[style*="background:#9cff57"],
        .site-shell a[style*="background: rgb(156, 255, 87)"] {
          background: var(--goblin-accent) !important;
          color: #071006 !important;
          transition: filter 180ms ease, box-shadow 180ms ease;
        }

        .site-shell a[style*="background: #9cff57"]:hover,
        .site-shell a[style*="background:#9cff57"]:hover,
        .site-shell a[style*="background: rgb(156, 255, 87)"]:hover {
          filter: brightness(1.04);
          box-shadow: 0 0 0 3px rgba(156, 255, 87, 0.12);
        }

        .deal-image {
          background: #090d0b !important;
          border-color: rgba(198, 255, 173, 0.1) !important;
        }

        .offer-partner-card:hover .partner-offer-cta {
          filter: brightness(1.05);
          box-shadow: 0 0 0 3px rgba(156, 255, 87, 0.12), 0 10px 24px rgba(156, 255, 87, 0.16);
          transform: translateY(-1px);
        }

        .site-shell span.partner-offer-cta,
        .site-shell .partner-offer-cta {
          color: #04110a !important;
          -webkit-text-fill-color: #04110a !important;
          text-shadow: none !important;
        }

        footer,
        #about,
        #contact,
        #affiliate,
        #privacy,
        .site-header {
          border-color: rgba(198, 255, 173, 0.1) !important;
        }

        @media (max-width: 767px) {
          .site-shell {
            overflow-x: hidden !important;
          }

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

          .offer-partner-grid button {
            min-height: 238px !important;
            padding: 22px !important;
          }
          .category-scroll {
            flex-wrap: wrap !important;
            gap: 10px !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            overflow-x: visible !important;
            padding: 0 0 8px !important;
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
            gap: 14px !important;
          }

          .deal-card {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            padding: 0 !important;
          }

          .deal-image-panel {
            border-right: 0 !important;
            border-bottom: 1px solid rgba(198, 255, 173, 0.1) !important;
            min-height: 170px !important;
          }

          .deal-image {
            height: 140px !important;
          }

          .deal-info-panel,
          .deal-price-panel {
            padding: 16px !important;
          }

          .deal-title {
            font-size: 1.08rem !important;
            line-height: 1.35 !important;
            overflow-wrap: anywhere !important;
          }

          .deal-price-panel {
            align-items: flex-start !important;
            border-top: 1px solid rgba(198, 255, 173, 0.08) !important;
          }

          .deal-price {
            font-size: 1.6rem !important;
          }

          .site-footer {
            padding: 28px 16px 92px !important;
          }

          .site-footer-grid {
            gap: 16px !important;
            grid-template-columns: 1fr !important;
          }

          .site-footer-grid > * {
            min-width: 0 !important;
            max-width: 100% !important;
          }

          .footer-copy {
            white-space: normal !important;
          }

          .back-to-top-button {
            bottom: calc(env(safe-area-inset-bottom, 0px) + 14px) !important;
            height: 44px !important;
            max-width: 44px !important;
            right: max(12px, env(safe-area-inset-right, 0px)) !important;
            width: 44px !important;
          }
        }

        .back-to-top-button {
          box-sizing: border-box;
          max-width: calc(100vw - 24px);
        }

        .sr-only {
          border: 0;
          clip: rect(0, 0, 0, 0);
          height: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }
      `}</style>

      <SiteHeader />

      <HeroSection />

      <section
        id="deals"
        className="deals-section"
        style={{ padding: "50px 40px 60px" }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "8px" }}>Featured Offers</h2>
          <p
            style={{
              color: "#aeb8aa",
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
          <p style={{ color: "#aeb8aa", fontSize: "1.1rem", marginBottom: "30px" }}>
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
              background: "#101419",
              border: "1px solid rgba(156, 255, 87, 0.18)",
              borderLeft: "5px solid #9cff57",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "34px",
            }}
          >
            <p style={{ color: "#aeb8aa", fontSize: "1.1rem", margin: 0 }}>
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
                background: "#14181d",
                border: "1px solid rgba(156, 255, 87, 0.18)",
                borderRadius: "999px",
                color: "#9cff57",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "bold",
                padding: "9px 14px",
              }}
            >
              Back to offers
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
                      background: "#101419",
                      border: "1px solid rgba(156, 255, 87, 0.18)",
                      borderLeft: "5px solid #9cff57",
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
                          color: "#9cff57",
                          fontSize: "0.78rem",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        Partner Offer
                      </span>

                      <span
                        style={{
                          background: "rgba(156, 255, 87, 0.1)",
                          color: "#9cff57",
                          border: "1px solid rgba(156, 255, 87, 0.3)",
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
                          color: "#c0c8bc",
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
                            color: "#cfd6cb",
                            background: "#090d0b",
                            border: "1px solid rgba(198, 255, 173, 0.12)",
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
                          background: "#9cff57",
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
            {offerGroups.map((group) => {
              const isBoxPartner = group.partnerName.toLowerCase().includes("box");

              return (
              <button
                className="offer-partner-card"
                type="button"
                key={group.title}
                onClick={() => setSelectedOfferGroup(group.title)}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(18, 22, 25, 0.98), rgba(8, 11, 10, 0.98))",
                  border: "1px solid rgba(198, 255, 173, 0.12)",
                  borderLeft: "3px solid rgba(156, 255, 87, 0.45)",
                  borderRadius: "16px",
                  boxShadow: "0 16px 36px rgba(0,0,0,0.24)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "255px",
                  padding: "28px",
                  position: "relative",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    alignItems: "flex-start",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "18px",
                    minHeight: "92px",
                    padding: "10px 6px 4px",
                  }}
                >
                  {group.logo ? (
                    <span
                      style={{
                        alignItems: "center",
                        background: isBoxPartner
                          ? "rgba(5, 8, 6, 0.72)"
                          : "transparent",
                        border: isBoxPartner
                          ? "1px solid rgba(255, 255, 255, 0.08)"
                          : "none",
                        borderRadius: isBoxPartner ? "12px" : 0,
                        display: "flex",
                        height: "82px",
                        justifyContent: "center",
                        maxWidth: "224px",
                        overflow: "hidden",
                        padding: isBoxPartner ? "10px 16px" : 0,
                        width: "224px",
                      }}
                    >
                      <Image
                        src={group.logo}
                        alt={`${group.partnerName} logo`}
                        width={224}
                        height={82}
                        style={{
                          display: "block",
                          height: isBoxPartner ? "60px" : "80px",
                          maxHeight: isBoxPartner ? "60px" : "80px",
                          maxWidth: isBoxPartner ? "176px" : "224px",
                          objectFit: "contain",
                          objectPosition: "center",
                          width: "100%",
                        }}
                      />
                    </span>
                  ) : (
                    <strong
                      style={{
                        color: "#f4f7f1",
                        display: "block",
                        fontSize: "1.35rem",
                        lineHeight: "1",
                        minHeight: "72px",
                        paddingTop: "22px",
                      }}
                    >
                      {group.partnerName}
                    </strong>
                  )}
                </div>

                <span
                  style={{
                    background: "rgba(156, 255, 87, 0.08)",
                    border: "1px solid rgba(156, 255, 87, 0.14)",
                    borderRadius: "999px",
                    color: "#9cff57",
                    display: "inline-block",
                    fontSize: "0.62rem",
                    fontWeight: "bold",
                    opacity: 0.75,
                    padding: "3px 7px",
                    position: "absolute",
                    right: "18px",
                    top: "16px",
                  }}
                >
                  Official Partner
                </span>

                <span
                  style={{
                    color: "#9cff57",
                    display: "block",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    opacity: 0.82,
                    textTransform: "uppercase",
                  }}
                >
                  Partner Offers
                </span>

                <strong
                  style={{
                    display: "block",
                    fontSize: "1.16rem",
                    lineHeight: "1.2",
                    marginBottom: "8px",
                  }}
                >
                  {group.partnerName}
                </strong>

                <span
                  style={{
                    color: "#c0c8bc",
                    display: "block",
                    fontSize: "0.9rem",
                    marginBottom: "18px",
                  }}
                >
                  <span style={{ color: "#9cff57", fontWeight: "bold" }}>
                    {group.offers.length}
                  </span>{" "}
                  active offer
                  {group.offers.length === 1 ? "" : "s"}
                </span>

                <span
                  className="partner-offer-cta"
                  style={{
                    alignItems: "center",
                    background: "linear-gradient(135deg, #9cff57, #6fe02d)",
                    borderRadius: "10px",
                    boxShadow: "0 8px 18px rgba(156, 255, 87, 0.12)",
                    color: "#04110a",
                    display: "flex",
                    fontSize: "0.92rem",
                    fontWeight: "bold",
                    justifyContent: "center",
                    marginTop: "auto",
                    padding: "12px 14px",
                    transition: "filter 180ms ease, box-shadow 180ms ease, transform 180ms ease",
                    width: "100%",
                  }}
                >
                  View Offers{" \u2192"}
                </span>
              </button>
              );
            })}
          </div>
        )}

        <h2 id="product-deals-controls" style={{ marginBottom: "20px", scrollMarginTop: "88px" }}>Product Deals</h2>

        <div
          className="category-scroll"
          style={{
            boxSizing: "border-box",
            display: "flex",
            gap: "12px",
            flexWrap: "nowrap",
            justifyContent: "flex-start",
            marginBottom: "30px",
            maxWidth: "100%",
            minWidth: "100%",
            overflowX: "auto",
            width: "100%",
          }}
        >
          {categories.map((category) => (
            <button
              className="category-button"
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                background:
                  activeCategory === category ? "#9cff57" : "#14181d",
                color: activeCategory === category ? "#071006" : "#cfd6cb",
                border: "1px solid rgba(198, 255, 173, 0.12)",
                borderRadius: "999px",
                minHeight: "42px",
                padding: "10px 17px",
                fontWeight: "bold",
                cursor: "pointer",
                flex: "0 0 auto",
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
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "30px",
            overflowX: "auto",
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
              flex: "1 1 calc(72% - 10px)",
              maxWidth: "none",
              background: "#14181d",
              color: "white",
              border: "1px solid rgba(198, 255, 173, 0.12)",
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
              flex: "0 1 calc(28% - 10px)",
              background: "#14181d",
              color: "white",
              border: "1px solid rgba(198, 255, 173, 0.12)",
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
          <p style={{ color: "#aeb8aa", fontSize: "1.1rem" }}>
            Loading latest deals...
          </p>
        ) : error ? (
          <p style={{ color: "#ff6b6b", fontSize: "1.1rem" }}>{error}</p>
        ) : filteredDeals.length === 0 ? (
          <p style={{ color: "#aeb8aa", fontSize: "1.1rem" }}>
            The goblins are still hunting...
          </p>
        ) : (
          <div
            className="deals-grid"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}
          >
            {filteredDeals.map((deal) => (
              <div
                className="deal-card"
                key={`${deal.source}-${deal.link}-${deal.timestamp}`}
                style={{
                  background: "#14181d",
                  border: "1px solid rgba(198, 255, 173, 0.12)",
                  borderRadius: "12px",
                  display: "grid",
                  gap: "28px",
                  gridTemplateColumns: "160px minmax(0, 1fr) 150px 150px",
                  alignItems: "center",
                  minHeight: "132px",
                  overflow: "hidden",
                  padding: "0 22px 0 0",
                }}
              >
                <div
                  className="deal-image-panel"
                  style={{
                    alignItems: "center",
                    alignSelf: "stretch",
                    background: "#090d0b",
                    borderRight: "1px solid rgba(198, 255, 173, 0.1)",
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "132px",
                    padding: "6px",
                  }}
                >
                  {deal.image ? (
                    <Image
                      className="deal-image"
                      src={deal.image}
                      alt={deal.cleanTitle || deal.title}
                      width={148}
                      height={120}
                      sizes="160px"
                      unoptimized
                      style={{
                        display: "block",
                        width: "100%",
                        height: "120px",
                        objectFit: "contain",
                        background: "transparent",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <div
                      className="deal-image"
                      style={{
                        alignItems: "center",
                        color: "#777",
                        display: "flex",
                        fontWeight: "bold",
                        height: "120px",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      No image
                    </div>
                  )}
                </div>

                <div
                  className="deal-info-panel"
                  style={{
                    minWidth: 0,
                    padding: "18px 0",
                  }}
                >
                  <div
                    className="deal-meta"
                    style={{
                      alignItems: "center",
                      display: "flex",
                      gap: "8px",
                      marginBottom: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(156, 255, 87, 0.1)",
                        border: "1px solid rgba(156, 255, 87, 0.22)",
                        borderRadius: "999px",
                        color: "#9cff57",
                        fontSize: "0.68rem",
                        fontWeight: "bold",
                        padding: "3px 7px",
                        textTransform: "uppercase",
                      }}
                    >
                      {deal.category}
                    </span>

                    <span
                      style={{
                        background: deal.quality.includes("GOOD PRICE")
                          ? "rgba(156, 255, 87, 0.1)"
                          : "rgba(243, 201, 105, 0.12)",
                        border: deal.quality.includes("GOOD PRICE")
                          ? "1px solid rgba(156, 255, 87, 0.24)"
                          : "1px solid rgba(243, 201, 105, 0.18)",
                        borderRadius: "999px",
                        color: deal.quality.includes("GOOD PRICE")
                          ? "#9cff57"
                          : "#f3c969",
                        fontSize: "0.68rem",
                        fontWeight: "bold",
                        padding: "3px 7px",
                        textTransform: "uppercase",
                      }}
                    >
                      {deal.quality}
                    </span>
                  </div>

                  <h3
                    className="deal-title"
                    style={{
                      color: "#f4f7f1",
                      fontSize: "1.08rem",
                      lineHeight: "1.28",
                      margin: "0 0 10px",
                      maxWidth: "430px",
                    }}
                  >
                    {deal.cleanTitle || deal.title}
                  </h3>

                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    {getStoreLogo(deal) ? (
                      <span
                        style={{
                          alignItems: "center",
                          display: "inline-flex",
                          minHeight: "22px",
                        }}
                      >
                        <Image
                          src={getStoreLogo(deal)!.src}
                          alt={getStoreLogo(deal)!.alt}
                          width={92}
                          height={26}
                          style={{
                            display: "block",
                            maxHeight: "24px",
                            maxWidth: "92px",
                            objectFit: "contain",
                            objectPosition: "left center",
                            width: "auto",
                          }}
                        />
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#cfd6cb",
                          fontSize: "0.86rem",
                          fontWeight: "bold",
                        }}
                      >
                        {deal.source}
                      </span>
                    )}

                    {formatFoundTime(deal.timestamp) && (
                      <span
                        style={{
                          color: "#8f998d",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                        }}
                      >
                        {formatFoundTime(deal.timestamp)}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="deal-price-panel"
                  style={{
                    alignItems: "flex-start",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    justifySelf: "stretch",
                    padding: "18px 0",
                  }}
                >
                  <div>
                    {deal.oldPrice && (
                      <p
                        style={{
                          color: "#8f998d",
                          fontSize: "0.94rem",
                          fontWeight: "bold",
                          margin: "0 0 3px",
                          textDecoration: "line-through",
                        }}
                      >
                        {deal.oldPrice}
                      </p>
                    )}

                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <p
                        className="deal-price"
                        style={{
                          color: "#9cff57",
                          fontSize: "1.55rem",
                          fontWeight: "bold",
                          lineHeight: 1,
                          margin: 0,
                        }}
                      >
                        {deal.price}
                      </p>

                      {deal.discount && (
                        <span
                          style={{
                            background: "rgba(156, 255, 87, 0.12)",
                            border: "1px solid rgba(156, 255, 87, 0.28)",
                            borderRadius: "8px",
                            color: "#9cff57",
                            display: "inline-block",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            padding: "4px 8px",
                          }}
                        >
                          {deal.discount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="deal-action-panel"
                  style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "18px 0",
                  }}
                >
                  <a
                    href={getDealUrl(deal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      alignItems: "center",
                      background: "#9cff57",
                      borderRadius: "10px",
                      color: "#071006",
                      display: "flex",
                      fontSize: "0.92rem",
                      fontWeight: "bold",
                      justifyContent: "center",
                      minHeight: "42px",
                      padding: "10px 14px",
                      textDecoration: "none",
                      width: "100%",
                    }}
                  >
                    View Deal {"\u2192"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
      <BackToTopButton isVisible={showBackToTop} onClick={scrollToTop} />
    </main>
  );
}














