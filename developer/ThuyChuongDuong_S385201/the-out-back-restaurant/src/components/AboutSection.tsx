export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        backgroundColor: "#11789D",
        padding: "96px 48px",
        position: "relative",
        overflow: "hidden",
        scrollMarginTop: 82,
      }}
      className="about-section"
    >
      {/* Large decorative word */}
      <div
        style={{
          position: "absolute",
          bottom: -48,
          right: -24,
          fontFamily: "var(--font-display)",
          fontSize: "clamp(100px, 16vw, 240px)",
          color: "rgba(0,63,88,0.15)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}
      >
        FRESH
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)",
            gap: "clamp(48px, 8vw, 112px)",
            alignItems: "center",
          }}
          className="about-grid"
        >
          {/* Left: Heading */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.65)",
                marginBottom: 16,
              }}
            >
              ABOUT US
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 5vw, 76px)",
                lineHeight: 0.95,
                color: "#FAF6EF",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              AUTHENTIC
              <br />
              FLAVOUR.
              <br />
              <span style={{ color: "#E07828" }}>MADE IN</span>
              <br />
              KATHERINE.
            </h2>
          </div>

          {/* Right: Content */}
          <div style={{ maxWidth: 620 }}>
            <div
              style={{
                width: 56,
                height: 3,
                backgroundColor: "#E07828",
                marginBottom: 28,
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(18px, 1.6vw, 22px)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.88)",
                marginBottom: 24,
              }}
            >
              Based in Katherine, Northern Territory, we bring the authentic
              flavours of Vietnam to Australia. Our menu is inspired by the
              street food and traditional dishes we know and love.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.75)",
                margin: 0,
              }}
            >
              We use fresh ingredients and cook with care, keeping the bold,
              balanced flavours of Vietnamese food at the heart of every dish.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-section { padding: 64px 24px !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  );
}
