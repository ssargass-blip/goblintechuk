"use client";

import { useState } from "react";

export function SiteFooter() {
  const [openFooterPanel, setOpenFooterPanel] = useState<string | null>(null);

  const footerItems = [
    {
      id: "about",
      label: "About",
      content: (
        <p style={{ margin: 0 }}>
          GoblinTechUK tracks technology, gaming and electronics deals across
          the United Kingdom. The goal is simple: find useful bargains, remove
          the junk, and save people from endless scrolling.
        </p>
      ),
    },
    {
      id: "contact",
      label: "Contact",
      content: (
        <p style={{ margin: 0 }}>
          Email:{" "}
          <a href="mailto:hello@goblintechuk.uk" style={{ color: "#9cff57" }}>
            hello@goblintechuk.uk
          </a>
        </p>
      ),
    },
    {
      id: "affiliate",
      label: "Affiliate Disclosure",
      content: (
        <p style={{ margin: 0 }}>
          Some links on GoblinTechUK are affiliate links. If you buy through
          them, we may earn a small commission at no extra cost to you. We still
          aim to show useful UK tech deals first, not junk. Affiliate tracking
          is handled through trusted partner networks such as{" "}
          <a
            href="https://www.awin.com/gb"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#9cff57" }}
          >
            Awin
          </a>
          .
        </p>
      ),
    },
    {
      id: "privacy",
      label: "Privacy Policy",
      content: (
        <p style={{ margin: 0 }}>
          GoblinTechUK does not currently collect personal data. If analytics,
          forms, cookies or affiliate tracking are added later, this section
          will be updated.
        </p>
      ),
    },
  ];

  return (
    <footer
      className="site-footer"
      style={{
        borderTop: "1px solid rgba(198, 255, 173, 0.1)",
        padding: "34px 40px",
        color: "#aeb8aa",
      }}
    >
      <div
        className="site-footer-grid"
        style={{
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "minmax(220px, 1fr) minmax(280px, 1.6fr) auto",
          alignItems: "start",
        }}
      >
        <div>
          <strong style={{ color: "white" }}>GoblinTechUK</strong>
          <p style={{ marginTop: "8px", lineHeight: "1.7" }}>
            Independent UK tech deal finder. Prices and availability may change.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "10px",
            width: "100%",
          }}
        >
          {footerItems.map((item) => {
            const isOpen = openFooterPanel === item.id;

            return (
              <div
                id={item.id}
                key={item.id}
                style={{
                  border: "1px solid rgba(198, 255, 173, 0.1)",
                  borderRadius: "10px",
                  background: isOpen
                    ? "linear-gradient(180deg, rgba(20, 25, 22, 0.95), rgba(12, 16, 14, 0.95))"
                    : "rgba(10, 14, 12, 0.42)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFooterPanel(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  style={{
                    alignItems: "center",
                    background: "transparent",
                    border: 0,
                    color: isOpen ? "#9cff57" : "#e8f0e5",
                    cursor: "pointer",
                    display: "flex",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    justifyContent: "space-between",
                    padding: "13px 15px",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true" style={{ color: "#9cff57" }}>
                    {isOpen ? "-" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      borderTop: "1px solid rgba(198, 255, 173, 0.08)",
                      color: "#aeb8aa",
                      fontSize: "0.92rem",
                      lineHeight: "1.7",
                      padding: "0 15px 15px",
                    }}
                  >
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="footer-copy" style={{ margin: 0, whiteSpace: "nowrap" }}>
          &copy; 2026 GoblinTechUK
        </p>
      </div>
    </footer>
  );
}
