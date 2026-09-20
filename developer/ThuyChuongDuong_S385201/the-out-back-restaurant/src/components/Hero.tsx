import React, { useEffect, useState } from "react";
import { Drawer } from "@base-ui/react/drawer";
import banhMiImage from "../imports/optimized/banhmi.webp";
import logoImage from "../imports/optimized/logo.webp";

const DrawerRoot = Drawer.Root;
const DrawerTrigger = Drawer.Trigger;
const DrawerPortal = Drawer.Portal;
const DrawerBackdrop = Drawer.Backdrop;
const DrawerViewport = Drawer.Viewport;
const DrawerPopup = Drawer.Popup;
const DrawerClose = Drawer.Close;

const BANH_MI_URL = banhMiImage;
const LOGO_URL = logoImage;

const NAV_LINKS = [
    { label: "HOME", href: "home" },
    { label: "MENU", href: "menu" },
    { label: "CATERING", href: "catering" },
    { label: "CONTACT", href: "contact" },
    { label: "ABOUT US", href: "about" },
];

function getDarwinStatus() {
    const parts = new Intl.DateTimeFormat("en-AU", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "Australia/Darwin",
    }).formatToParts(new Date());

    const weekday = parts.find(({ type }) => type === "weekday")?.value ?? "";
    const hour = Number(parts.find(({ type }) => type === "hour")?.value ?? 0);
    const minute = Number(parts.find(({ type }) => type === "minute")?.value ?? 0);
    const minutesSinceMidnight = hour * 60 + minute;

    return {
        weekday,
        isOpen:
            weekday !== "Sunday" &&
            minutesSinceMidnight >= 10 * 60 + 30 &&
            minutesSinceMidnight < 15 * 60,
    };
}

interface HeroProps {
    onNavigate: (page: string) => void;
    currentPage: string;
}

export default function Hero({ onNavigate, currentPage }: HeroProps) {
    const [scrolled, setScrolled] = useState(false);
    const [ntStatus, setNtStatus] = useState(getDarwinStatus);
    const { weekday: ntWeekday, isOpen: isOpenNow } = ntStatus;
    const isSunday = ntWeekday === "Sunday";
    const isClosed = !isOpenNow;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 24);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const updateNtStatus = () => setNtStatus(getDarwinStatus());
        const timer = window.setInterval(updateNtStatus, 60_000);
        return () => window.clearInterval(timer);
    }, []);

    return (
        /* DrawerRoot wraps everything so both mobile + desktop triggers share one drawer */
        <DrawerRoot>
            <section
                className="hero-section"
                style={{
                    position: "relative",
                    height: 860,
                    overflow: "hidden",
                    backgroundColor: "#F8F1E9",
                }}
            >
                {/* ── LEFT CREAM PANEL ── */}
                <div
                    className="hero-left"
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "50%",
                        backgroundColor: "#F8F1E9",
                        display: "flex",
                        flexDirection: "column",
                        paddingLeft: "clamp(28px, 4vw, 64px)",
                        paddingRight: 32,
                        paddingTop: 126,
                        zIndex: 2,
                    }}
                >
                    {/* Mobile top bar — hidden on desktop */}
                    <div
                        className="hero-mobile-bar"
                        style={{
                            display: "none",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: 16,
                            paddingBottom: 16,
                            width: "100%",
                        }}
                    >
                        <button
                            onClick={() => onNavigate("home")}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        >
                            <img
                                src={LOGO_URL}
                                alt="The Outback F&B Service"
                                style={{ height: 44, width: "auto" }}
                            />
                        </button>
                        <DrawerTrigger
                            style={{
                                background: "none",
                                border: "1px solid rgba(26,24,19,0.2)",
                                borderRadius: 8,
                                padding: "8px 10px",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                gap: 5,
                            }}
                            aria-label="Open navigation menu"
                        >
                            <span
                                style={{
                                    display: "block",
                                    width: 22,
                                    height: 2,
                                    background: "#1A1813",
                                    borderRadius: 1,
                                }}
                            />
                            <span
                                style={{
                                    display: "block",
                                    width: 16,
                                    height: 2,
                                    background: "#1A1813",
                                    borderRadius: 1,
                                }}
                            />
                            <span
                                style={{
                                    display: "block",
                                    width: 22,
                                    height: 2,
                                    background: "#1A1813",
                                    borderRadius: 1,
                                }}
                            />
                        </DrawerTrigger>
                    </div>

                    {/* Desktop logo and navigation */}
                    <div
                        className="hero-desktop-header"
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 30,
                            display: "flex",
                            alignItems: "center",
                            gap: "clamp(18px, 2vw, 30px)",
                            width: "100%",
                            minHeight: 82,
                            padding: "10px clamp(28px, 4vw, 64px)",
                            backgroundColor: scrolled
                                ? "rgba(0,63,88,0.97)"
                                : "transparent",
                            backdropFilter: scrolled ? "blur(12px)" : "none",
                            borderBottom: scrolled
                                ? "1px solid rgba(255,255,255,0.1)"
                                : "1px solid transparent",
                            boxShadow: scrolled
                                ? "0 8px 24px rgba(0,0,0,0.12)"
                                : "none",
                            transition:
                                "background-color 220ms ease, border-color 220ms ease, box-shadow 220ms ease, backdrop-filter 220ms ease",
                        }}
                    >
                        <button
                            onClick={() => onNavigate("home")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                flexShrink: 0,
                            }}
                            aria-label="Go to home page"
                        >
                            <img
                                src={LOGO_URL}
                                alt="The Outback F&B Service"
                                style={{
                                    height: 58,
                                    width: "auto",
                                    objectFit: "contain",
                                }}
                            />
                        </button>

                        <nav
                            className="hero-desktop-nav"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "clamp(10px, 1.3vw, 20px)",
                            }}
                            aria-label="Main navigation"
                        >
                            {NAV_LINKS.filter(
                                (link) => link.href !== "home",
                            ).map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => onNavigate(link.href)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        padding: "4px 0",
                                        cursor: "pointer",
                                        fontFamily: "var(--font-body)",
                                        fontWeight: 700,
                                        fontSize: 13,
                                        letterSpacing: "0.04em",
                                        color: scrolled
                                            ? "rgba(255,255,255,0.92)"
                                            : "#1A1813",
                                        borderBottom:
                                            currentPage === link.href
                                                ? "2px solid #F08321"
                                                : "2px solid transparent",
                                        textTransform: "uppercase",
                                        transition:
                                            "color 180ms ease, border-color 150ms ease",
                                        whiteSpace: "nowrap",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (currentPage !== link.href)
                                            e.currentTarget.style.borderBottomColor =
                                                "rgba(240,131,33,0.45)";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentPage !== link.href)
                                            e.currentTarget.style.borderBottomColor =
                                                "transparent";
                                    }}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main headline */}
                    <h1
                        style={{
                            fontFamily: "'Anton', sans-serif",
                            fontSize: "clamp(56px, 6.5vw, 104px)",
                            lineHeight: 0.91,
                            color: "#1A1813",
                            margin: 0,
                            letterSpacing: "0.01em",
                        }}
                    >
                        FRESH
                        <br />
                        FOOD.
                        <br />
                        BIG
                        <br />
                        FLAVOUR.
                    </h1>

                    {/* Supporting copy + squiggle */}
                    <div style={{ marginTop: 20, marginBottom: 24 }}>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontWeight: 600,
                                fontSize: "clamp(13px, 1.1vw, 15px)",
                                letterSpacing: "0.07em",
                                color: "#1A1813",
                                textTransform: "uppercase",
                                lineHeight: 1.75,
                                margin: 0,
                            }}
                        >
                            AUTHENTIC FLAVOURS
                            <br />
                            FRESH INGREDIENTS
                            <br />
                            MADE WITH CARE
                        </p>
                        <svg
                            width="92"
                            height="14"
                            viewBox="0 0 92 14"
                            fill="none"
                            style={{ marginTop: 10, display: "block" }}
                        >
                            <path
                                d="M2 9 C10 3, 22 13, 34 7 S52 3, 66 7 S78 11, 90 7"
                                stroke="#F08321"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </svg>
                    </div>

                    {/* CTA buttons */}
                    <div
                        className="hero-cta-row"
                        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                    >
                        <button
                            onClick={() => onNavigate("menu")}
                            style={{
                                backgroundColor: "#F08321",
                                color: "#FFFFFF",
                                fontFamily: "var(--font-body)",
                                fontWeight: 700,
                                fontSize: 15,
                                letterSpacing: "0.05em",
                                minWidth: 180,
                                height: 58,
                                paddingLeft: 24,
                                paddingRight: 24,
                                borderRadius: 6,
                                border: "none",
                                cursor: "pointer",
                                transition: "background-color 160ms ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}
                            onMouseEnter={(e) =>
                                ((
                                    e.currentTarget as HTMLButtonElement
                                ).style.backgroundColor = "#BD5110")
                            }
                            onMouseLeave={(e) =>
                                ((
                                    e.currentTarget as HTMLButtonElement
                                ).style.backgroundColor = "#F08321")
                            }
                        >
                            VIEW MENU →
                        </button>
                        <button
                            onClick={() => onNavigate("contact")}
                            style={{
                                backgroundColor: "transparent",
                                color: "#1A1813",
                                fontFamily: "var(--font-body)",
                                fontWeight: 700,
                                fontSize: 15,
                                letterSpacing: "0.05em",
                                minWidth: 180,
                                height: 58,
                                paddingLeft: 24,
                                paddingRight: 24,
                                borderRadius: 6,
                                border: "1.5px solid #1A1813",
                                cursor: "pointer",
                                transition: "background-color 160ms ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}
                            onMouseEnter={(e) =>
                                ((
                                    e.currentTarget as HTMLButtonElement
                                ).style.backgroundColor = "rgba(26,24,19,0.06)")
                            }
                            onMouseLeave={(e) =>
                                ((
                                    e.currentTarget as HTMLButtonElement
                                ).style.backgroundColor = "transparent")
                            }
                        >
                            CONTACT ↗
                        </button>
                    </div>
                </div>

                {/* ── BÁNH MÌ — sits between panels in DOM so flex order works on mobile ── */}
                <div
                    className="hero-banh-mi"
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-44%, -52%) rotate(3deg)",
                        width: "clamp(480px, 54vw, 840px)",
                        zIndex: 10,
                        pointerEvents: "none",
                    }}
                >
                    <img
                        src={BANH_MI_URL}
                        alt="Crispy roast pork Banh Mi"
                        width={1448}
                        height={1086}
                        decoding="async"
                        fetchPriority="high"
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            filter: "drop-shadow(0 28px 52px rgba(0,0,0,0.38)) drop-shadow(0 8px 16px rgba(0,0,0,0.2))",
                        }}
                    />
                </div>

                {/* ── RIGHT ORANGE PANEL ── */}
                <div
                    className="hero-right"
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: "50%",
                        backgroundColor: "#F08321",
                        overflow: "hidden",
                        zIndex: 1,
                    }}
                >
                    {/* Tone-on-tone background words */}
                    <div
                        className="hero-tone-words"
                        style={{
                            position: "absolute",
                            right: -4,
                            top: "50%",
                            transform: "translateY(-46%)",
                            display: "flex",
                            flexDirection: "column",
                            userSelect: "none",
                            pointerEvents: "none",
                            lineHeight: 0.86,
                        }}
                    >
                        {["CRISPY", "FRESH", "BOLD", "GOOD"].map((word) => (
                            <span
                                key={word}
                                style={{
                                    fontFamily: "'Anton', sans-serif",
                                    fontSize: "clamp(64px, 10.5vw, 158px)",
                                    color: "#BD5110",
                                    letterSpacing: "0.01em",
                                    display: "block",
                                    textAlign: "right",
                                    lineHeight: 0.88,
                                }}
                            >
                                {word}
                            </span>
                        ))}
                    </div>

                    {/* VIETNAMESE FAVOURITES DOWN UNDER */}
                    <div
                        className="hero-vn-tag"
                        style={{
                            position: "absolute",
                            bottom: 36,
                            right: 32,
                            textAlign: "right",
                        }}
                    >
                        <div
                            style={{
                                width: 44,
                                height: 1.5,
                                backgroundColor: "#1A1813",
                                marginLeft: "auto",
                                marginBottom: 10,
                                opacity: 0.45,
                            }}
                        />
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontWeight: 700,
                                fontSize: 11,
                                letterSpacing: "0.1em",
                                color: "#1A1813",
                                textTransform: "uppercase",
                                lineHeight: 1.7,
                                margin: 0,
                                opacity: 0.6,
                            }}
                        >
                            VIETNAMESE FAVOURITES
                            <br />
                            DOWN UNDER
                        </p>
                    </div>
                </div>

                {/* ── OPEN TODAY card ── */}
                <div
                    className="hero-card"
                    style={{
                        position: "absolute",
                        left: "65%",
                        top: "57%",
                        transform: "rotate(-6deg)",
                        backgroundColor: isClosed ? "#7A1F1F" : "#FFFFFF",
                        borderRadius: 8,
                        padding: "20px 26px",
                        width: 278,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                        zIndex: 15,
                        transition: "background-color 220ms ease, color 220ms ease",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "'Anton', sans-serif",
                            fontSize: 28,
                            color: isClosed ? "#FFFFFF" : "#1A1813",
                            letterSpacing: "0.02em",
                            marginBottom: 14,
                            lineHeight: 1,
                        }}
                    >
                        {isSunday ? "CLOSED TODAY" : isOpenNow ? "OPEN NOW" : "CLOSED NOW"}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 7,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontFamily: "var(--font-body)",
                                fontSize: 13,
                                color: isClosed ? "rgba(255,255,255,0.9)" : "#1A1813",
                                fontWeight: 700,
                                letterSpacing: "0.04em",
                            }}
                        >
                            <span>{ntWeekday.toUpperCase()}</span>
                            <span style={{ marginLeft: 16 }}>
                                {isSunday ? "CLOSED" : "10:30 AM – 3 PM"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Responsive styles */}
                <style>{`
          .hero-desktop-header {
            display: none !important;
          }

          /* ── Mobile layout ── */
          @media (max-width: 900px) {
            .hero-section {
              height: auto !important;
              overflow: hidden !important;
              display: flex !important;
              flex-direction: column !important;
            }

            /* Left panel: full-width, centred column */
            .hero-left {
              position: relative !important;
              width: 100% !important;
              left: auto !important; top: auto !important; bottom: auto !important;
              padding: 90px 24px 24px !important;
              order: 1;
              z-index: 2;
              align-items: center !important;
              text-align: center !important;
            }

            /* The shared site header handles mobile navigation */
            .hero-mobile-bar { display: none !important; }
            .hero-desktop-header { display: none !important; }

            /* Centre the headline */
            .hero-left h1 {
              text-align: center !important;
              font-size: clamp(46px, 12vw, 68px) !important;
            }

            /* Centre supporting copy */
            .hero-left p {
              text-align: center !important;
            }

            /* Centre the squiggle svg */
            .hero-left svg {
              margin-left: auto !important;
              margin-right: auto !important;
            }

            /* Centre CTA buttons row */
            .hero-cta-row {
              justify-content: center !important;
              width: 100%;
            }

            /* Smaller, centred food image on compact screens */
            .hero-banh-mi {
              position: relative !important;
              left: auto !important; top: auto !important;
              width: 82% !important;
              max-width: 560px !important;
              margin: -4px auto -6px !important;
              transform: rotate(1deg) !important;
              z-index: 3 !important;
              order: 2;
            }

            /* Hide the decorative orange panel on compact screens */
            .hero-right {
              display: none !important;
            }

            /* Hide desktop-only elements */
            .hero-card { display: none !important; }
            .hero-vn-tag { display: none !important; }
            .hero-tone-words { display: none !important; }

          }

          /* ── Tablet tweaks ── */
          @media (min-width: 901px) and (max-width: 1200px) {
            .hero-card {
              left: 60% !important;
              top: 60% !important;
              width: 240px !important;
            }
          }
        `}</style>
            </section>

            {/* Shared Drawer portal */}
            <DrawerPortal>
                <DrawerBackdrop className="drawer-backdrop" />
                <DrawerViewport>
                    <DrawerPopup className="drawer-popup">
                        <div style={{ padding: "24px 28px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 40,
                                }}
                            >
                                <img
                                    src={LOGO_URL}
                                    alt="The Outback F&B Service"
                                    style={{ height: 48, width: "auto" }}
                                />
                                <DrawerClose
                                    style={{
                                        background: "none",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        borderRadius: 8,
                                        width: 36,
                                        height: 36,
                                        cursor: "pointer",
                                        color: "white",
                                        fontSize: 18,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    aria-label="Close menu"
                                >
                                    ✕
                                </DrawerClose>
                            </div>
                            <nav
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4,
                                }}
                            >
                                {NAV_LINKS.map((link) => (
                                    <DrawerClose
                                        key={link.href}
                                        onClick={() => onNavigate(link.href)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            fontFamily: "'Anton', sans-serif",
                                            fontSize: 28,
                                            color: "white",
                                            padding: "12px 0",
                                            borderBottom:
                                                "1px solid rgba(255,255,255,0.1)",
                                            letterSpacing: "0.02em",
                                            display: "block",
                                            width: "100%",
                                        }}
                                        onMouseEnter={(
                                            e: React.MouseEvent<HTMLButtonElement>,
                                        ) => {
                                            e.currentTarget.style.color =
                                                "#F08321";
                                        }}
                                        onMouseLeave={(
                                            e: React.MouseEvent<HTMLButtonElement>,
                                        ) => {
                                            e.currentTarget.style.color =
                                                "white";
                                        }}
                                    >
                                        {link.label}
                                    </DrawerClose>
                                ))}
                            </nav>
                            <button
                                onClick={() => onNavigate("menu")}
                                style={{
                                    marginTop: 32,
                                    width: "100%",
                                    backgroundColor: "#F08321",
                                    color: "white",
                                    fontFamily: "'Anton', sans-serif",
                                    fontSize: 16,
                                    letterSpacing: "0.06em",
                                    padding: "16px 20px",
                                    borderRadius: 6,
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                VIEW MENU →
                            </button>
                        </div>
                    </DrawerPopup>
                </DrawerViewport>
            </DrawerPortal>
        </DrawerRoot>
    );
}
