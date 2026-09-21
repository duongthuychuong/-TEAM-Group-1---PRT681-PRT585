const DIRECTIONS_URL = "https://maps.app.goo.gl/R9cnaRwWYJu22LqK9";
const FACEBOOK_URL = "https://www.facebook.com/theoutbackfnbservice";
const MAP_EMBED_URL =
  "https://www.google.com/maps?q=The+Meeting+Place,+20+Katherine+Terrace,+Katherine+NT+0850,+Australia&z=17&output=embed";

export default function LocationSection() {
  return (
    <section
      id="location"
      style={{
        backgroundColor: "#F8F1E9",
        padding: "96px 48px",
        scrollMarginTop: 82,
      }}
      className="location-section"
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: "0.12em",
            color: "#11789D",
            marginBottom: 12,
          }}
        >
          FIND US
        </p>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5vw, 72px)",
            lineHeight: 0.95,
            color: "#003F58",
            margin: "0 0 56px",
            letterSpacing: "-0.02em",
          }}
        >
          COME SAY
          <br />
          G'DAY
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 4fr) minmax(0, 8fr)",
            gap: 48,
            alignItems: "stretch",
          }}
          className="location-grid"
        >
          <div
            style={{
              backgroundColor: "#003F58",
              borderRadius: 12,
              padding: "clamp(32px, 4vw, 56px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 460,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  color: "#E07828",
                  marginBottom: 18,
                }}
              >
                THE MEETING PLACE
              </div>
              <address
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(20px, 2vw, 26px)",
                  color: "#FAF6EF",
                  lineHeight: 1.55,
                  fontWeight: 600,
                  fontStyle: "normal",
                  marginBottom: 28,
                }}
              >
                20 Katherine Terrace
                <br />
                Katherine NT 0850
                <br />
                Australia
              </address>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.72)",
                  margin: 0,
                }}
              >
                Find us in the heart of Katherine at the Katherine Town Square.
              </p>

              <div style={{ marginTop: 36 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    color: "#E07828",
                    marginBottom: 10,
                  }}
                >
                  OPENING HOURS
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontFamily: "var(--font-body)",
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: "#FFFFFF",
                  }}
                >
                  <span>Monday – Saturday: 10:30 am – 3:00 pm</span>
                  <span style={{ color: "rgba(255,255,255,0.68)" }}>Sunday: Closed</span>
                </div>
              </div>

              <div style={{ marginTop: 36 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    color: "#E07828",
                    marginBottom: 10,
                  }}
                >
                  CALL &amp; ORDER
                </div>
                <a
                  href="tel:+61435337006"
                  aria-label="Call 0435 337 006 to order"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(20px, 2vw, 26px)",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    textDecoration: "none",
                    transition: "color 180ms ease",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = "#E07828";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = "#FFFFFF";
                  }}
                >
                  ☎ 0435 337 006
                </a>
              </div>

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 24,
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.76)",
                  textDecoration: "none",
                  transition: "color 180ms ease",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = "#E07828";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = "rgba(255,255,255,0.76)";
                }}
              >
                FOLLOW US ON FACEBOOK ↗
              </a>
            </div>

            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: "#E07828",
                color: "#FFFFFF",
                fontFamily: "var(--font-display)",
                fontSize: 13,
                letterSpacing: "0.06em",
                padding: "16px 24px",
                borderRadius: 8,
                textDecoration: "none",
                transition: "background-color 180ms ease",
                alignSelf: "flex-start",
                marginTop: 40,
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = "#BD5110";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = "#E07828";
              }}
            >
              GET DIRECTIONS →
            </a>
          </div>

          <div
            style={{
              minHeight: 460,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(0,63,88,0.12)",
              boxShadow: "0 16px 40px rgba(0,63,88,0.12)",
              backgroundColor: "#E8E2D6",
            }}
          >
            <iframe
              src={MAP_EMBED_URL}
              title="Google Map showing The Meeting Place in Katherine"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", minHeight: 460 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .location-section { padding: 64px 24px !important; }
          .location-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}
