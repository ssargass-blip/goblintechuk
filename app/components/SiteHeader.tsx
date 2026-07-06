import Image from "next/image";

const navLinkStyle = {
  color: "#cfd6cb",
  textDecoration: "none",
};

export function SiteHeader() {
  return (
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
      <Image
        src="/goblin-icon.png"
        alt="GoblinTechUK logo"
        width={256}
        height={171}
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
  );
}
