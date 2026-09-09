import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateDealLink } from "../../components/AffiliateDealLink";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { loadEligibleDeals } from "../../lib/deal-data";
import { parsePrice } from "../../lib/deals";
import { absoluteSiteUrl, siteUrl } from "../../lib/site";

type DealPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const deals = await loadEligibleDeals();
  return deals.map((deal) => ({ slug: deal.slug }));
}

async function getDeal(slug: string) {
  const deals = await loadEligibleDeals();
  return deals.find((deal) => deal.slug === slug);
}

export async function generateMetadata({ params }: DealPageProps): Promise<Metadata> {
  const { slug } = await params;
  const deal = await getDeal(slug);

  if (!deal) {
    return {
      title: "Deal not found | GoblinTechUK",
      robots: { index: false, follow: false },
    };
  }

  const name = deal.cleanTitle || deal.title;
  const canonical = `/deals/${deal.slug}`;
  const description = `${name} for ${deal.price} from ${deal.merchant || deal.source}. Price and availability can change at the retailer.`;

  return {
    title: `${name} deal | GoblinTechUK`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${name} deal`,
      description,
      url: canonical,
      siteName: "GoblinTechUK",
      type: "website",
      images: deal.image ? [{ url: absoluteSiteUrl(deal.image), alt: name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} deal`,
      description,
      images: deal.image ? [absoluteSiteUrl(deal.image)] : undefined,
    },
  };
}

function formatCheckedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function DealPage({ params }: DealPageProps) {
  const { slug } = await params;
  const deal = await getDeal(slug);

  if (!deal) notFound();

  const name = deal.cleanTitle || deal.title;
  const merchant = deal.merchant || deal.source;
  const canonical = `${siteUrl}/deals/${deal.slug}`;
  const imageUrl = absoluteSiteUrl(deal.image);
  const checkedDate = formatCheckedDate(deal.lastCheckedAt || deal.timestamp);
  const price = parsePrice(deal.price);
  const description = `${name} is currently listed at ${deal.price} by ${merchant}. GoblinTechUK provides the product link and price snapshot so you can check the latest retailer details before buying.`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: imageUrl,
    description,
    sku: deal.dealId,
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "GBP",
      price,
      seller: {
        "@type": "Organization",
        name: merchant,
      },
    },
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #050806 0%, #0a0f0b 52%, #050806 100%)",
        color: "#f4f7f1",
      }}
    >
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article
        style={{
          margin: "0 auto",
          maxWidth: "1080px",
          padding: "54px 24px 72px",
        }}
      >
        <Link href="/#deals" style={{ color: "#9cff57", textDecoration: "none" }}>
          ← Back to all deals
        </Link>

        <div
          className="deal-detail-grid"
          style={{
            background: "linear-gradient(180deg, rgba(22, 26, 31, 0.98), rgba(16, 20, 25, 0.98))",
            border: "1px solid rgba(156, 255, 87, 0.24)",
            borderRadius: "18px",
            display: "grid",
            gap: "34px",
            gridTemplateColumns: "minmax(260px, 0.9fr) minmax(0, 1.35fr)",
            marginTop: "24px",
            overflow: "hidden",
            padding: "30px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#090d0b",
              borderRadius: "14px",
              display: "flex",
              justifyContent: "center",
              minHeight: "340px",
              padding: "20px",
            }}
          >
            <Image
              src={deal.image}
              alt={name}
              width={520}
              height={420}
              sizes="(max-width: 760px) 90vw, 42vw"
              unoptimized
              style={{ height: "auto", maxHeight: "380px", objectFit: "contain", width: "100%" }}
            />
          </div>

          <div style={{ alignSelf: "center" }}>
            <p style={{ color: "#9cff57", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.06em", margin: "0 0 12px", textTransform: "uppercase" }}>
              {deal.category} · Featured listing
            </p>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.08, margin: "0 0 18px" }}>
              {name}
            </h1>
            <p style={{ color: "#b9c3b6", lineHeight: 1.7, margin: "0 0 20px" }}>
              {description}
            </p>
            <p style={{ color: "#d5ddd2", margin: "0 0 8px" }}>
              Sold by <strong>{merchant}</strong>
            </p>
            {checkedDate && (
              <p style={{ color: "#8f998d", fontSize: "0.9rem", margin: "0 0 24px" }}>
                Feed last checked: {checkedDate}
              </p>
            )}
            <p style={{ color: "#9cff57", fontSize: "2rem", fontWeight: 800, margin: "0 0 22px" }}>
              {deal.price}
            </p>
            <AffiliateDealLink
              deal={deal}
              style={{
                alignItems: "center",
                background: "#9cff57",
                borderRadius: "10px",
                color: "#071006",
                display: "inline-flex",
                fontWeight: 800,
                justifyContent: "center",
                minHeight: "48px",
                padding: "10px 20px",
                textDecoration: "none",
              }}
            >
              Check deal at {merchant} →
            </AffiliateDealLink>
            <p style={{ color: "#8f998d", fontSize: "0.82rem", lineHeight: 1.55, margin: "16px 0 0" }}>
              Affiliate disclosure: we may earn a commission if you buy through this link, at no extra cost to you. Prices and availability can change at the retailer.
            </p>
          </div>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
