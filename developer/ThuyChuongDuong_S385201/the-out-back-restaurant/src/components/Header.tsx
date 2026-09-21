import React, { useState, useEffect } from "react";
import { Drawer } from "@base-ui/react/drawer";
import logoImage from "../imports/optimized/logo.webp";

const DrawerRoot = Drawer.Root;
const DrawerTrigger = Drawer.Trigger;
const DrawerPortal = Drawer.Portal;
const DrawerBackdrop = Drawer.Backdrop;
const DrawerViewport = Drawer.Viewport;
const DrawerPopup = Drawer.Popup;
const DrawerClose = Drawer.Close;

const NAV_LINKS = [
  { label: "Menu", href: "menu" },
  { label: "Catering", href: "catering" },
  { label: "Contact", href: "contact" },
  { label: "About", href: "about" },
];

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(currentPage === "home" ? "" : currentPage);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (currentPage !== "home") {
      setActiveLink(currentPage);
      return;
    }

    const sections = [
      { id: "menu", link: "menu" },
      { id: "catering", link: "catering" },
      { id: "location", link: "contact" },
      { id: "about", link: "about" },
    ];

    const updateActiveLink = () => {
      const scrollMarker = window.scrollY + 140;
      let nextActiveLink = "";

      sections.forEach(({ id, link }) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= scrollMarker) {
          nextActiveLink = link;
        }
      });

      setActiveLink(nextActiveLink);
    };

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);

    return () => {
      window.removeEventListener("scroll", updateActiveLink);
      window.removeEventListener("resize", updateActiveLink);
    };
  }, [currentPage]);

  const handleNav = (href: string) => {
    onNavigate(href);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        backgroundColor: scrolled ? "rgba(0,63,88,0.97)" : "rgba(248,241,233,0.97)",
        backdropFilter: "blur(12px)",
        transition:
          "background-color 250ms ease, border-color 250ms ease, box-shadow 250ms ease",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(26,24,19,0.08)",
        boxShadow: scrolled ? "0 8px 24px rgba(0,0,0,0.12)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: "0 clamp(28px, 4vw, 64px)",
          height: 82,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "clamp(18px, 2vw, 30px)",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => handleNav("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <img
            src={logoImage}
            alt="The Outback F&B Service"
            style={{ height: 58, width: "auto" }}
          />
        </button>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(10px, 1.3vw, 20px)",
          }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: 13,
                color:
                  activeLink === link.href
                    ? "#E07828"
                    : scrolled
                      ? "rgba(255,255,255,0.92)"
                      : "#1A1813",
                letterSpacing: "0.04em",
                padding: "4px 0",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                borderBottom:
                  activeLink === link.href ? "2px solid #E07828" : "2px solid transparent",
                transition: "color 180ms ease, border-color 180ms ease",
              }}
              onMouseEnter={(e) => {
                if (activeLink !== link.href) {
                  e.currentTarget.style.color = "#E07828";
                }
              }}
              onMouseLeave={(e) => {
                if (activeLink !== link.href) {
                  e.currentTarget.style.color = scrolled
                    ? "rgba(255,255,255,0.92)"
                    : "#1A1813";
                }
              }}
              aria-current={activeLink === link.href ? "page" : undefined}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Mobile Trigger */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
            marginLeft: "auto",
          }}
        >
          {/* Mobile Hamburger */}
          <DrawerRoot>
            <DrawerTrigger
              style={{
                display: "none",
                background: "none",
                border: scrolled
                  ? "1px solid rgba(255,255,255,0.24)"
                  : "1px solid rgba(26,24,19,0.2)",
                borderRadius: 8,
                padding: "8px 10px",
                cursor: "pointer",
                color: scrolled ? "white" : "#1A1813",
                flexDirection: "column",
                gap: 5,
              }}
              className="mobile-menu-trigger"
              aria-label="Open navigation menu"
            >
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: scrolled ? "white" : "#1A1813",
                  borderRadius: 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 16,
                  height: 2,
                  background: scrolled ? "white" : "#1A1813",
                  borderRadius: 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: scrolled ? "white" : "#1A1813",
                  borderRadius: 1,
                }}
              />
            </DrawerTrigger>
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
                      src={logoImage}
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

                  <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {NAV_LINKS.map((link) => (
                      <DrawerClose
                        key={link.href}
                        onClick={() => handleNav(link.href)}
                        style={{
                          background: "none",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          fontFamily: "var(--font-display)",
                          fontSize: 28,
                          color: activeLink === link.href ? "#E07828" : "white",
                          padding: "12px 0",
                          borderBottom: "1px solid rgba(255,255,255,0.1)",
                          letterSpacing: "0.02em",
                          transition: "color 150ms ease",
                          display: "block",
                          width: "100%",
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.currentTarget.style.color = "#E07828";
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.currentTarget.style.color =
                            activeLink === link.href ? "#E07828" : "white";
                        }}
                        aria-current={activeLink === link.href ? "page" : undefined}
                      >
                        {link.label}
                      </DrawerClose>
                    ))}
                  </nav>

                  <button
                    onClick={() => handleNav("menu")}
                    style={{
                      marginTop: 32,
                      width: "100%",
                      backgroundColor: "#E07828",
                      color: "#003F58",
                      fontFamily: "var(--font-display)",
                      fontSize: 15,
                      letterSpacing: "0.06em",
                      padding: "16px 20px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    VIEW MENU
                  </button>
                </div>
              </DrawerPopup>
              </DrawerViewport>
            </DrawerPortal>
          </DrawerRoot>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-trigger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
