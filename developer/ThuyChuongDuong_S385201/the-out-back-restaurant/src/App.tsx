import { lazy, Suspense, useEffect } from "react"
import Header from "./components/Header"
import Hero from "./components/Hero"
import CateringSection from "./components/CateringSection"
import LocationSection from "./components/LocationSection"
import AboutSection from "./components/AboutSection"
import Footer from "./components/Footer"
import MenuPage from "./pages/MenuPage"

const AdminMenuPage = lazy(() => import("./pages/AdminMenuPage"))

function PublicWebsite() {
  const handleNavigate = (page: string) => {
    const sectionIds: Record<string, string> = {
      menu: "menu",
      catering: "catering",
      contact: "location",
      location: "location",
      about: "about",
    }

    if (page === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    const sectionId = sectionIds[page]
    if (sectionId) {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  useEffect(() => {
    document.title = "The Outback F&B Service — Fresh Food. Big Flavour."
  }, [])

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <Header onNavigate={handleNavigate} currentPage="home" />
      <Hero onNavigate={handleNavigate} currentPage="home" />
      <MenuPage />
      <CateringSection />
      <LocationSection />
      <AboutSection />
      <Footer onNavigate={handleNavigate} />
    </div>
  )
}

export default function App() {
  const isAdminPage = window.location.pathname.replace(/\/+$/, "") === "/admin"

  if (isAdminPage) {
    return (
      <Suspense fallback={<div style={{ padding: 32 }}>Loading admin…</div>}>
        <AdminMenuPage />
      </Suspense>
    )
  }

  return <PublicWebsite />
}
