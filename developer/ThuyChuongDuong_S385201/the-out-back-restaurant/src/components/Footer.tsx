import logoImage from "../imports/optimized/logo.webp";

interface FooterProps {
  onNavigate: (page: string) => void;
}

const FACEBOOK_URL = "https://www.facebook.com/theoutbackfnbservice";
const DIRECTIONS_URL = "https://maps.app.goo.gl/R9cnaRwWYJu22LqK9";

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer
      style={{
        backgroundColor: "#002A3A",
        color: "#FAF6EF",
        padding: "72px 48px 40px",
        position: "relative",
        overflow: "hidden",
      }}
      className="footer-pad"
    >
      {/* Large decorative OUTBACK */}
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: -12,
          fontFamily: "var(--font-display)",
          fontSize: "clamp(80px, 14vw, 200px)",
          color: "rgba(255,255,255,0.04)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}
      >
        OUTBACK
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 64,
          }}
          className="footer-grid"
        >
          {/* Brand col */}
          <div>
            <img
              src={logoImage}
              alt="The Outback F&B Service"
              loading="lazy"
              decoding="async"
              style={{ height: 80, width: "auto", marginBottom: 20 }}
            />
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.55)",
                maxWidth: 280,
                marginBottom: 24,
              }}
            >
              Authentic Vietnamese flavours, made with care in Katherine,
              Northern Territory.
            </p>
            {/* Social links */}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow The Outback F&B Service on Facebook"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 6,
                padding: "10px 14px",
                fontFamily: "var(--font-display)",
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                transition: "border-color 150ms ease, color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#E07828";
                e.currentTarget.style.color = "#E07828";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              FACEBOOK ↗
            </a>
          </div>

          {/* Nav cols */}
          {[
            {
              heading: "Explore",
              links: [
                { label: "Menu", href: "menu" },
                { label: "Catering", href: "catering" },
                { label: "Contact", href: "contact" },
                { label: "About", href: "about" },
              ],
            },
            {
              heading: "Get In Touch",
              links: [
                { label: "Call & Order: 0435 337 006", href: "tel:+61435337006" },
                { label: "Facebook", href: FACEBOOK_URL },
                { label: "Catering Enquiry", href: "catering" },
              ],
            },
            {
              heading: "Visit",
              links: [
                { label: "Mon–Sat  10:30am–3pm", href: null },
                { label: "Sunday  Closed", href: null },
                { label: "20 Katherine Terrace, Katherine NT", href: DIRECTIONS_URL },
              ],
            },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  color: "#E07828",
                  marginBottom: 20,
                }}
              >
                {heading.toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(({ label, href }) =>
                  href?.startsWith("http") || href?.startsWith("tel:") ? (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.5,
                        textDecoration: "none",
                        transition: "color 150ms ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#FAF6EF")}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                      }
                    >
                      {label}
                    </a>
                  ) : href ? (
                    <button
                      key={label}
                      onClick={() => onNavigate(href)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        textAlign: "left",
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "rgba(255,255,255,0.55)",
                        transition: "color 150ms ease",
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = "#FAF6EF")}
                      onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)")}
                    >
                      {label}
                    </button>
                  ) : (
                    <span
                      key={label}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.4,
                      }}
                    >
                      {label}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            © 2026 The Outback F&B Service. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            AUTHENTIC FLAVOURS · FRESH INGREDIENTS · MADE WITH CARE
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-pad { padding: 56px 24px 32px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
