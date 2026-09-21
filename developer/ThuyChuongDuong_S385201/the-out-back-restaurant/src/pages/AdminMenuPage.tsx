import { DragEvent, FormEvent, useEffect, useRef, useState } from "react"
import { DragDropProvider } from "@dnd-kit/react"
import { isSortable, useSortable } from "@dnd-kit/react/sortable"
import logoImage from "../imports/optimized/logo.webp"
import {
  resolveMenuImages,
  type MenuImage,
  type MenuKind,
  type MenuResponse,
  type UploadedMenuImage,
} from "../menuCatalog"
import "../admin.css"

type Category = MenuKind

type PendingFile = {
  file: File
  preview: string
}

const SESSION_KEY = "outback-menu-admin-password"
const MAX_SOURCE_SIZE = 12 * 1024 * 1024

function moveItem(items: string[], from: number, to: number) {
  const reordered = [...items]
  const [moved] = reordered.splice(from, 1)
  reordered.splice(to, 0, moved)
  return reordered
}

function SortableMenuCard({
  image,
  index,
  count,
  onMove,
  onReplace,
  onDelete,
  busyAction,
  disabled,
}: {
  image: MenuImage
  index: number
  count: number
  onMove: (from: number, to: number) => void
  onReplace: (image: MenuImage, index: number, file: File) => void
  onDelete: (image: MenuImage) => void
  busyAction: "change" | "delete" | null
  disabled: boolean
}) {
  const { ref, handleRef, isDragging } = useSortable({
    id: image.id,
    index,
  })

  return (
    <figure ref={ref} className={isDragging ? "admin-card--dragging" : ""}>
      <img
        src={image.src}
        alt={`${image.category} menu page ${index + 1}`}
        loading="lazy"
      />
      <figcaption>
        <strong>PAGE {String(index + 1).padStart(2, "0")}</strong>
        <span>Uploaded</span>
      </figcaption>
      <div className="admin-card-actions">
        <button
          ref={handleRef}
          type="button"
          className="admin-drag-handle"
          disabled={disabled}
          aria-label={`Drag ${image.category.toLowerCase()} page ${index + 1} to reorder`}
          title="Drag to reorder"
        >
          ⠿ <span>DRAG</span>
        </button>
        <button
          type="button"
          onClick={() => onMove(index, index - 1)}
          disabled={disabled || index === 0}
          aria-label={`Move page ${index + 1} up`}
          title="Move earlier"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMove(index, index + 1)}
          disabled={disabled || index === count - 1}
          aria-label={`Move page ${index + 1} down`}
          title="Move later"
        >
          ↓
        </button>
      </div>
      <div className="admin-card-edit-actions">
        <label
          className={disabled ? "admin-card-action--disabled" : ""}
          aria-disabled={disabled}
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={disabled}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onReplace(image, index, file)
              event.target.value = ""
            }}
          />
          {busyAction === "change" ? "CHANGING…" : "CHANGE"}
        </label>
        <button
          type="button"
          onClick={() => onDelete(image)}
          disabled={disabled}
        >
          {busyAction === "delete" ? "DELETING…" : "DELETE"}
        </button>
      </div>
    </figure>
  )
}

async function compressMenuImage(file: File): Promise<Blob> {
  const image = await createImageBitmap(file)
  const width = Math.min(1200, image.width)
  const height = Math.round((image.height / image.width) * width)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d")
  if (!context) {
    image.close()
    throw new Error("This browser could not prepare the image.")
  }

  context.drawImage(image, 0, 0, width, height)
  image.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.88),
  )
  if (!blob) throw new Error("This browser could not compress the image.")
  return blob
}

export default function AdminMenuPage() {
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError] = useState("")
  const [authenticating, setAuthenticating] = useState(false)
  const [category, setCategory] = useState<Category>("food")
  const [startPage, setStartPage] = useState(1)
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const pendingFilesRef = useRef<PendingFile[]>([])
  const [menuItems, setMenuItems] = useState<UploadedMenuImage[]>([])
  const [savedOrders, setSavedOrders] = useState<Record<Category, string[]>>({
    food: [],
    drinks: [],
  })
  const [draftOrders, setDraftOrders] = useState<Record<Category, string[]>>({
    food: [],
    drinks: [],
  })
  const [savingOrder, setSavingOrder] = useState(false)
  const [editingItem, setEditingItem] = useState<{
    id: string
    action: "change" | "delete"
  } | null>(null)
  const [draggingFiles, setDraggingFiles] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")

  const clearPendingFiles = () => {
    pendingFilesRef.current.forEach(({ preview }) =>
      URL.revokeObjectURL(preview),
    )
    pendingFilesRef.current = []
    setPendingFiles([])
  }

  const loadMenu = async () => {
    const response = await fetch("/api/menu", { cache: "no-store" })
    if (
      !response.ok ||
      !response.headers.get("Content-Type")?.includes("application/json")
    )
      return
    const data = (await response.json()) as MenuResponse
    const items = data.items ?? []
    const orders = {
      food: resolveMenuImages("food", items, data.order?.food).map(
        (image) => image.id,
      ),
      drinks: resolveMenuImages("drinks", items, data.order?.drinks).map(
        (image) => image.id,
      ),
    }
    setMenuItems(items)
    setSavedOrders(orders)
    setDraftOrders(orders)
    setStartPage(Math.min(99, orders[category].length + 1))
  }

  const authenticate = async (candidate: string) => {
    setAuthenticating(true)
    setAuthError("")

    try {
      const response = await fetch("/api/menu", {
        method: "HEAD",
        headers: { Authorization: `Bearer ${candidate}` },
      })

      if (response.status === 503) {
        throw new Error("Admin storage has not been connected yet.")
      }
      if (!response.ok) throw new Error("That password is not correct.")
      if (response.headers.get("X-Outback-Admin") !== "ready") {
        throw new Error("Admin storage is available after Cloudflare setup.")
      }

      setPassword(candidate)
      setAuthenticated(true)
      sessionStorage.setItem(SESSION_KEY, candidate)
      await loadMenu()
    } catch (authenticationError) {
      setAuthenticated(false)
      setAuthError(
        authenticationError instanceof Error
          ? authenticationError.message
          : "Could not sign in.",
      )
    } finally {
      setAuthenticating(false)
    }
  }

  useEffect(() => {
    document.title = "Menu Admin — The Outback F&B Service"
    const robots = document.createElement("meta")
    robots.name = "robots"
    robots.content = "noindex, nofollow"
    document.head.appendChild(robots)

    const savedPassword = sessionStorage.getItem(SESSION_KEY)
    if (savedPassword) void authenticate(savedPassword)

    return () => {
      robots.remove()
      pendingFilesRef.current.forEach(({ preview }) =>
        URL.revokeObjectURL(preview),
      )
    }
  }, [])

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password.trim()) void authenticate(password.trim())
  }

  const handleFileSelection = (files: FileList | null) => {
    clearPendingFiles()
    setError("")
    if (!files) return

    const selected = Array.from(files).slice(0, 20)
    const invalidFile = selected.find(
      (file) => !file.type.startsWith("image/") || file.size > MAX_SOURCE_SIZE,
    )
    if (invalidFile) {
      setError("Use PNG, JPEG or WebP images no larger than 12 MB each.")
      return
    }

    const prepared = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    pendingFilesRef.current = prepared
    setPendingFiles(prepared)
  }

  const handleFileDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDraggingFiles(false)
    handleFileSelection(event.dataTransfer.files)
  }

  const movePage = (from: number, to: number) => {
    setDraftOrders((current) => {
      const order = current[category]
      if (to < 0 || to >= order.length || from === to) return current
      return { ...current, [category]: moveItem(order, from, to) }
    })
    setNotice("")
  }

  const showCategory = (nextCategory: Category) => {
    setCategory(nextCategory)
    setStartPage(Math.min(99, draftOrders[nextCategory].length + 1))
    setError("")
    setNotice("")
  }

  const replacePage = async (
    image: MenuImage,
    index: number,
    file: File,
  ) => {
    if (editingItem || uploading || savingOrder) return
    if (!file.type.startsWith("image/") || file.size > MAX_SOURCE_SIZE) {
      setError("Use a PNG, JPEG or WebP image no larger than 12 MB.")
      return
    }

    setEditingItem({ id: image.id, action: "change" })
    setError("")
    setNotice("")
    try {
      const page = index + 1
      const optimizedImage = await compressMenuImage(file)
      const formData = new FormData()
      formData.append("category", category)
      formData.append("page", String(page))
      formData.append("order", JSON.stringify(draftOrders[category]))
      formData.append("image", optimizedImage, `${category}-${page}.webp`)

      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { Authorization: `Bearer ${password}` },
        body: formData,
      })
      if (response.status === 401) {
        sessionStorage.removeItem(SESSION_KEY)
        setAuthenticated(false)
        throw new Error("Your admin session expired. Please sign in again.")
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(data?.error ?? `Page ${page} could not be changed.`)
      }

      await loadMenu()
      setNotice(`${image.category} page ${page} changed successfully.`)
    } catch (replaceError) {
      setError(
        replaceError instanceof Error
          ? replaceError.message
          : "The image could not be changed.",
      )
    } finally {
      setEditingItem(null)
    }
  }

  const deletePage = async (image: MenuImage) => {
    if (editingItem || uploading || savingOrder) return
    const confirmed = window.confirm(
      `Delete ${image.category.toLowerCase()} page ${image.page}? This will remove it from the public menu.`,
    )
    if (!confirmed) return

    const nextOrder = draftOrders[category].filter((id) => id !== image.id)
    setEditingItem({ id: image.id, action: "delete" })
    setError("")
    setNotice("")
    try {
      const response = await fetch("/api/menu", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${password}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, id: image.id, order: nextOrder }),
      })
      if (response.status === 401) {
        sessionStorage.removeItem(SESSION_KEY)
        setAuthenticated(false)
        throw new Error("Your admin session expired. Please sign in again.")
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(data?.error ?? "The menu page could not be deleted.")
      }

      await loadMenu()
      setNotice(`${image.category} menu page deleted.`)
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Delete failed.",
      )
    } finally {
      setEditingItem(null)
    }
  }

  const saveOrder = async () => {
    if (savingOrder || uploading || editingItem) return
    setSavingOrder(true)
    setError("")
    setNotice("")
    try {
      const response = await fetch("/api/menu/order", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${password}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, order: draftOrders[category] }),
      })
      if (response.status === 401) {
        sessionStorage.removeItem(SESSION_KEY)
        setAuthenticated(false)
        throw new Error("Your admin session expired. Please sign in again.")
      }
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(data?.error ?? "The new order could not be saved.")
      }
      setSavedOrders((current) => ({
        ...current,
        [category]: [...draftOrders[category]],
      }))
      setNotice("Menu order saved. Refresh the website to see it.")
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Save failed.",
      )
    } finally {
      setSavingOrder(false)
    }
  }

  const handleUpload = async () => {
    if (!pendingFiles.length || uploading) return
    if (startPage + pendingFiles.length - 1 > 99) {
      setError("The last image would go past page 99. Choose an earlier starting page.")
      return
    }
    setUploading(true)
    setProgress(0)
    setNotice("")
    setError("")

    let currentOrder = [...draftOrders[category]]
    try {
      for (const [index, pending] of pendingFiles.entries()) {
        const page = startPage + index
        const optimizedImage = await compressMenuImage(pending.file)
        const formData = new FormData()
        formData.append("category", category)
        formData.append("page", String(page))
        formData.append("order", JSON.stringify(currentOrder))
        formData.append("image", optimizedImage, `${category}-${page}.webp`)

        const response = await fetch("/api/menu", {
          method: "POST",
          headers: { Authorization: `Bearer ${password}` },
          body: formData,
        })

        if (response.status === 401) {
          sessionStorage.removeItem(SESSION_KEY)
          setAuthenticated(false)
          throw new Error("Your admin session expired. Please sign in again.")
        }
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as {
            error?: string
          } | null
          throw new Error(data?.error ?? `Page ${page} could not be uploaded.`)
        }

        const data = (await response.json()) as { order: string[] }
        currentOrder = data.order
        setProgress(index + 1)
      }

      const count = pendingFiles.length
      clearPendingFiles()
      await loadMenu()
      setNotice(`${count} menu ${count === 1 ? "page" : "pages"} published.`)
    } catch (uploadError) {
      await loadMenu()
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed.",
      )
    } finally {
      setUploading(false)
    }
  }

  const logOut = () => {
    sessionStorage.removeItem(SESSION_KEY)
    clearPendingFiles()
    setAuthenticated(false)
    setPassword("")
  }

  if (!authenticated) {
    return (
      <main className="admin-login-shell">
        <a className="admin-site-link" href="/">
          ← BACK TO WEBSITE
        </a>
        <form className="admin-login-card" onSubmit={handleLogin}>
          <img src={logoImage} alt="The Outback F&B Service" />
          <p className="admin-kicker">PRIVATE AREA</p>
          <h1>
            MENU ADMIN<span>.</span>
          </h1>
          <p>Sign in to replace or add food and drinks menu pages.</p>
          <label htmlFor="admin-password">Admin password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
          {authError && (
            <p className="admin-error" role="alert">
              {authError}
            </p>
          )}
          <button type="submit" disabled={authenticating}>
            {authenticating ? "CHECKING…" : "SIGN IN →"}
          </button>
        </form>
      </main>
    )
  }

  const categoryItems = resolveMenuImages(
    category,
    menuItems,
    draftOrders[category],
  )
  const orderChanged =
    JSON.stringify(draftOrders[category]) !==
    JSON.stringify(savedOrders[category])

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a href="/" aria-label="Open website">
          <img src={logoImage} alt="The Outback F&B Service" />
        </a>
        <div>
          <p>MENU MANAGEMENT</p>
          <button type="button" onClick={logOut}>
            LOG OUT
          </button>
        </div>
      </header>

      <section className="admin-hero">
        <div>
          <p className="admin-kicker">ADMIN DASHBOARD</p>
          <h1>
            UPDATE THE MENU<span>.</span>
          </h1>
          <p>
            Add menu images, then drag pages into the order you want visitors to
            see.
          </p>
        </div>
        <a href="/#menu" target="_blank" rel="noreferrer">
          VIEW LIVE MENU ↗
        </a>
      </section>

      <section className="admin-workspace">
        <div className="admin-upload-panel">
          <div className="admin-panel-heading">
            <span>01</span>
            <div>
              <h2>Choose pages</h2>
              <p>Images are compressed automatically before publishing.</p>
            </div>
          </div>

          <div className="admin-fields">
            <label>
              Menu category
              <select
                value={category}
                disabled={uploading || savingOrder || editingItem !== null}
                onChange={(event) =>
                  showCategory(event.target.value as Category)
                }
              >
                <option value="food">Food</option>
                <option value="drinks">Drinks</option>
              </select>
            </label>
            <label>
              Start at page
              <input
                type="number"
                min="1"
                max={Math.min(99, draftOrders[category].length + 1)}
                value={startPage}
                onChange={(event) =>
                  setStartPage(
                    Math.min(
                      Math.min(99, draftOrders[category].length + 1),
                      Math.max(1, Number(event.target.value) || 1),
                    ),
                  )
                }
              />
            </label>
          </div>
          <p className="admin-fields-note">
            Choose an existing page to replace it, or the next page to add new
            images.
          </p>

          <label
            className={`admin-dropzone${draggingFiles ? " admin-dropzone--active" : ""}`}
            onDragEnter={(event) => {
              event.preventDefault()
              setDraggingFiles(true)
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node))
                setDraggingFiles(false)
            }}
            onDrop={handleFileDrop}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={(event) => handleFileSelection(event.target.files)}
            />
            <span className="admin-drop-icon">＋</span>
            <strong>DROP OR SELECT MENU IMAGES</strong>
            <span>PNG, JPEG or WebP · up to 12 MB each</span>
          </label>

          {pendingFiles.length > 0 && (
            <div className="admin-pending-list">
              {pendingFiles.map(({ file, preview }, index) => (
                <div key={`${file.name}-${file.lastModified}`}>
                  <img src={preview} alt="" />
                  <span>
                    <strong>
                      {category.toUpperCase()} · PAGE{" "}
                      {String(startPage + index).padStart(2, "0")}
                    </strong>
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="admin-success" role="status">
              {notice}
            </p>
          )}

          <button
            className="admin-publish-button"
            type="button"
            onClick={() => void handleUpload()}
            disabled={!pendingFiles.length || uploading || editingItem !== null}
          >
            {uploading
              ? `PUBLISHING ${progress} / ${pendingFiles.length}…`
              : `PUBLISH ${pendingFiles.length || ""} ${
                  pendingFiles.length === 1 ? "PAGE" : "PAGES"
                }`}
            <span>→</span>
          </button>
        </div>

        <aside className="admin-current-panel">
          <div className="admin-panel-heading">
            <span>02</span>
            <div>
              <h2>Page order</h2>
              <p>
                Drag images to reorder, then save. {categoryItems.length} {category} pages.
              </p>
            </div>
          </div>
          <div className="admin-category-tabs" aria-label="Menu category">
            <button
              type="button"
              className={category === "food" ? "is-active" : ""}
              aria-pressed={category === "food"}
              disabled={uploading || savingOrder || editingItem !== null}
              onClick={() => showCategory("food")}
            >
              FOOD <span>{draftOrders.food.length}</span>
            </button>
            <button
              type="button"
              className={category === "drinks" ? "is-active" : ""}
              aria-pressed={category === "drinks"}
              disabled={uploading || savingOrder || editingItem !== null}
              onClick={() => showCategory("drinks")}
            >
              DRINKS <span>{draftOrders.drinks.length}</span>
            </button>
          </div>
          {categoryItems.length ? (
            <DragDropProvider
              onDragEnd={(event) => {
                if (event.canceled) return
                const { source } = event.operation
                if (isSortable(source)) {
                  movePage(source.initialIndex, source.index)
                }
              }}
            >
              <div className="admin-current-grid">
                {categoryItems.map((image, index) => (
                  <SortableMenuCard
                    key={image.id}
                    image={image}
                    index={index}
                    count={categoryItems.length}
                    onMove={movePage}
                    onReplace={(selectedImage, selectedIndex, file) =>
                      void replacePage(selectedImage, selectedIndex, file)
                    }
                    onDelete={(selectedImage) => void deletePage(selectedImage)}
                    busyAction={
                      editingItem?.id === image.id
                        ? editingItem.action
                        : null
                    }
                    disabled={
                      uploading || savingOrder || editingItem !== null
                    }
                  />
                ))}
              </div>
            </DragDropProvider>
          ) : (
            <div className="admin-empty-state">
              <span>○</span>
              <p>
                No {category} pages are available yet. Add an image to get
                started.
              </p>
            </div>
          )}
          {categoryItems.length > 0 && (
            <div className="admin-order-footer">
              <p>
                {orderChanged
                  ? "Unsaved changes — the live menu has not changed yet."
                  : "This is the order shown on the website."}
              </p>
              <button
                type="button"
                onClick={() => void saveOrder()}
                disabled={
                  !orderChanged ||
                  savingOrder ||
                  uploading ||
                  editingItem !== null
                }
              >
                {savingOrder ? "SAVING…" : "SAVE ORDER →"}
              </button>
            </div>
          )}
        </aside>
      </section>
    </main>
  )
}
