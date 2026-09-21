import { useEffect, useState } from "react"
import {
  resolveMenuImages,
  type MenuImage,
  type MenuResponse,
} from "../menuCatalog"

export default function MenuPage() {
  const [showFullMenu, setShowFullMenu] = useState(false)
  const [foodImages, setFoodImages] = useState<MenuImage[]>([])
  const [drinkImages, setDrinkImages] = useState<MenuImage[]>([])
  const [menuLoading, setMenuLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    void fetch("/api/menu", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return
        const data = (await response.json()) as MenuResponse
        setFoodImages(
          resolveMenuImages("food", data.items, data.order?.food),
        )
        setDrinkImages(
          resolveMenuImages("drinks", data.items, data.order?.drinks),
        )
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.info(
            "Using the bundled menu while online updates are unavailable.",
          )
        }
      })
      .finally(() => {
        if (active) setMenuLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [])

  const menuImages = [...foodImages, ...drinkImages]
  const previewImages = [foodImages[0], drinkImages[0]].filter(
    (image): image is MenuImage => image !== undefined,
  )
  const menuGroups = [
    {
      id: "food-menu",
      title: "Food",
      subtitle: "Something good for every appetite.",
      pages: foodImages,
    },
    {
      id: "drinks-menu",
      title: "Drinks",
      subtitle: "Something refreshing on the side.",
      pages: drinkImages,
    },
  ]
  const availableMenuGroups = menuGroups.filter(({ pages }) => pages.length)

  return (
    <section id="menu" className="menu-section">
      <div className="menu-intro">
        <div className="menu-intro-inner">
          <p className="menu-eyebrow">FRESH FAVOURITES, MADE TO ORDER</p>
          <h2>
            THE MENU<span>.</span>
          </h2>
          <p className="menu-intro-copy">
            A taste of what we make. Browse food and drinks, then open the full
            menu to see every page.
          </p>
        </div>
        <span className="menu-intro-decoration" aria-hidden="true">
          MENU
        </span>
      </div>

      <div
        className={`menu-gallery${showFullMenu ? " menu-gallery--full" : ""}`}
      >
        {menuLoading ? (
          <div className="menu-empty-state" role="status">
            <span>MENU</span>
            <h3>Loading our menu…</h3>
          </div>
        ) : menuImages.length === 0 ? (
          <div className="menu-empty-state">
            <span>MENU</span>
            <h3>Our menu is being updated.</h3>
            <p>
              Call <a href="tel:+61435337006">0435 337 006</a> to ask what is
              available today or place an order.
            </p>
          </div>
        ) : !showFullMenu ? (
          <div className="menu-preview">
            <div className="menu-preview-heading">
              <span>TAKE A LOOK</span>
              <span>FOOD + DRINKS</span>
            </div>
            <div className="menu-image-grid menu-preview-grid">
              {previewImages.map((image) => (
                <article
                  className="menu-image-card menu-image-card--preview"
                  key={image.id}
                >
                  <img
                    src={image.src}
                    alt={`${image.category} menu preview`}
                    loading="lazy"
                    decoding="async"
                    width={image.category === "Food" ? 1414 : 2121}
                    height={image.category === "Food" ? 2000 : 3000}
                  />
                  <span className="menu-image-caption">
                    <span>{image.category.toUpperCase()} MENU</span>
                  </span>
                </article>
              ))}
            </div>
            <button
              className="menu-full-button"
              type="button"
              onClick={() => setShowFullMenu(true)}
            >
              VIEW FULL MENU <span aria-hidden="true">↘</span>
            </button>
            <p className="menu-preview-note">
              All {menuImages.length} food and drinks pages in one place.
            </p>
          </div>
        ) : (
          <div className="menu-full-gallery">
            <div className="menu-full-toolbar">
              <span>FULL MENU · {menuImages.length} PAGES</span>
              <button
                type="button"
                onClick={() => {
                  setShowFullMenu(false)
                  requestAnimationFrame(() =>
                    document.getElementById("menu")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    }),
                  )
                }}
              >
                CLOSE FULL MENU ↑
              </button>
            </div>
            <div
              className="menu-jump-links menu-jump-links--gallery"
              aria-label="Jump to menu category"
            >
              {availableMenuGroups.map(({ id, title }) => (
                <a href={`#${id}`} key={id}>
                  EXPLORE {title.toUpperCase()} <span aria-hidden="true">↘</span>
                </a>
              ))}
            </div>
            {availableMenuGroups.map(({ id, title, subtitle, pages }) => (
              <div className="menu-group" id={id} key={id}>
                <div className="menu-group-heading">
                  <div>
                    <p className="menu-eyebrow">{title.toUpperCase()} MENU</p>
                    <h3>
                      {title}
                      <span>.</span>
                    </h3>
                    <p>{subtitle}</p>
                  </div>
                  <span className="menu-page-count">
                    {String(pages.length).padStart(2, "0")} PAGES
                  </span>
                </div>
                <div className="menu-image-grid">
                  {pages.map((image) => (
                    <article className="menu-image-card" key={image.id}>
                      <img
                        src={image.src}
                        alt={`${image.category} menu page ${image.page} of ${image.total}`}
                        loading="lazy"
                        decoding="async"
                        width={image.category === "Food" ? 1414 : 2121}
                        height={image.category === "Food" ? 2000 : 3000}
                      />
                      <span className="menu-image-caption">
                        <span>
                          {image.category.toUpperCase()}{" "}
                          <span className="menu-caption-dot">·</span> PAGE{" "}
                          {String(image.page).padStart(2, "0")}
                        </span>
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
