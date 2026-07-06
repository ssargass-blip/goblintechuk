type BackToTopButtonProps = {
  isVisible: boolean;
  onClick: () => void;
};

export function BackToTopButton({ isVisible, onClick }: BackToTopButtonProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <button
      className="back-to-top-button"
      type="button"
      aria-label="Back to top"
      onClick={onClick}
      style={{
        position: "fixed",
        right: "18px",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
        width: "48px",
        height: "48px",
        borderRadius: "999px",
        border: "1px solid #9cff57",
        background: "#0c100e",
        color: "#9cff57",
        fontSize: "1.5rem",
        fontWeight: "bold",
        cursor: "pointer",
        alignItems: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,0.35), 0 0 18px rgba(156,255,87,0.18)",
        display: "flex",
        justifyContent: "center",
        lineHeight: 1,
        zIndex: 9999,
      }}
    >
      {"\u2191"}
    </button>
  );
}
