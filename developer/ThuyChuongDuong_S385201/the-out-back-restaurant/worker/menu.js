const categories = new Set(["food", "drinks"])
const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
])
const maximumFileSize = 8 * 1024 * 1024
const uploadedKeyPattern =
  /^menu\/(food|drinks)\/(\d+)-(\d+)(?:-[0-9a-f-]+)?\.(png|jpe?g|webp)$/

function json(data, init = {}) {
  const headers = new Headers(init.headers)
  headers.set("Content-Type", "application/json; charset=utf-8")
  headers.set("X-Content-Type-Options", "nosniff")
  return new Response(JSON.stringify(data), { ...init, headers })
}

async function credentialsMatch(request, password) {
  if (!password) return false
  const authorization = request.headers.get("Authorization") ?? ""
  const candidate = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : ""
  const encoder = new TextEncoder()
  const [candidateHash, passwordHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(password)),
  ])
  const candidateBytes = new Uint8Array(candidateHash)
  const passwordBytes = new Uint8Array(passwordHash)
  let difference = 0
  for (let index = 0; index < candidateBytes.length; index += 1) {
    difference |= candidateBytes[index] ^ passwordBytes[index]
  }
  return difference === 0
}

function configured(env) {
  return env.MENU_IMAGES && env.ADMIN_PASSWORD
}

function validOrder(category, order) {
  return (
    categories.has(category) &&
    Array.isArray(order) &&
    order.length <= 99 &&
    order.every(
      (id) =>
        typeof id === "string" &&
        uploadedKeyPattern.test(id) &&
        uploadedKeyPattern.exec(id)?.[1] === category,
    ) &&
    new Set(order).size === order.length
  )
}

async function readOrder(bucket, category) {
  const object = await bucket.get(`menu-order/${category}.json`)
  if (!object) return undefined
  try {
    const order = JSON.parse(await object.text())
    return validOrder(category, order) ? order : undefined
  } catch {
    return undefined
  }
}

async function writeOrder(bucket, category, order) {
  await bucket.put(`menu-order/${category}.json`, JSON.stringify(order), {
    httpMetadata: { contentType: "application/json" },
  })
}

function menuItem(object) {
  if (!object) return null
  const match = object.key.match(uploadedKeyPattern)
  if (!match) return null
  const [, category, page, uploadedAt] = match
  return {
    key: object.key,
    category: category === "food" ? "Food" : "Drinks",
    page: Number(page),
    src: `/api/menu/image?key=${encodeURIComponent(object.key)}`,
    updatedAt: new Date(Number(uploadedAt)).toISOString(),
  }
}

export async function authenticateAdmin(request, env) {
  if (!configured(env)) return new Response(null, { status: 503 })
  const authorized = await credentialsMatch(request, env.ADMIN_PASSWORD)
  return new Response(null, {
    status: authorized ? 204 : 401,
    headers: { "X-Outback-Admin": "ready" },
  })
}

export async function getMenu(env) {
  if (!env.MENU_IMAGES) {
    return json({ error: "Menu storage is not configured." }, { status: 503 })
  }

  const [result, foodOrder, drinkOrder] = await Promise.all([
    env.MENU_IMAGES.list({ prefix: "menu/" }),
    readOrder(env.MENU_IMAGES, "food"),
    readOrder(env.MENU_IMAGES, "drinks"),
  ])
  const items = result.objects
    .map(menuItem)
    .filter(Boolean)
    .sort(
      (first, second) =>
        first.category.localeCompare(second.category) ||
        first.page - second.page,
    )

  return json(
    { items, order: { food: foodOrder, drinks: drinkOrder } },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  )
}

export async function uploadMenuImage(request, env) {
  if (!configured(env)) {
    return json({ error: "Admin storage is not configured." }, { status: 503 })
  }
  if (!(await credentialsMatch(request, env.ADMIN_PASSWORD))) {
    return json({ error: "Unauthorized." }, { status: 401 })
  }

  const formData = await request.formData()
  const category = String(formData.get("category") ?? "").toLowerCase()
  const page = Number(formData.get("page"))
  const image = formData.get("image")
  const orderValue = formData.get("order")
  let order
  if (orderValue !== null) {
    try {
      order = JSON.parse(String(orderValue))
    } catch {
      return json({ error: "Invalid menu order." }, { status: 400 })
    }
  }

  if (
    !categories.has(category) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 99
  ) {
    return json(
      { error: "Choose a valid category and page number." },
      { status: 400 },
    )
  }
  if (!(image instanceof File) || !allowedTypes.has(image.type)) {
    return json(
      { error: "Upload a PNG, JPEG or WebP image." },
      { status: 400 },
    )
  }
  if (image.size > maximumFileSize) {
    return json(
      { error: "The optimized image must be smaller than 8 MB." },
      { status: 413 },
    )
  }
  if (order !== undefined && !validOrder(category, order)) {
    return json({ error: "Invalid menu order." }, { status: 400 })
  }

  const extension = allowedTypes.get(image.type)
  const uploadedAt = Date.now()
  const keyPrefix = `menu/${category}/${page}-`
  const key = `${keyPrefix}${uploadedAt}-${crypto.randomUUID()}.${extension}`

  await env.MENU_IMAGES.put(key, image.stream(), {
    httpMetadata: {
      contentType: image.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
  })

  if (order !== undefined) {
    const nextOrder = [...order]
    const replacedId = nextOrder[page - 1]
    if (page <= nextOrder.length) nextOrder[page - 1] = key
    else nextOrder.push(key)
    await writeOrder(env.MENU_IMAGES, category, nextOrder)
    if (replacedId?.startsWith(`menu/${category}/`)) {
      await env.MENU_IMAGES.delete(replacedId)
    }
    const storedObject = await env.MENU_IMAGES.head(key)
    return json(
      { item: menuItem(storedObject), order: nextOrder },
      { status: 201 },
    )
  }

  // Retain compatibility with any older client that uploaded by page number.
  const previous = await env.MENU_IMAGES.list({ prefix: keyPrefix })
  const staleKeys = previous.objects
    .map((object) => object.key)
    .filter((objectKey) => objectKey !== key)
  if (staleKeys.length) await env.MENU_IMAGES.delete(staleKeys)

  const storedObject = await env.MENU_IMAGES.head(key)
  return json({ item: menuItem(storedObject) }, { status: 201 })
}

export async function deleteMenuImage(request, env) {
  if (!configured(env)) {
    return json({ error: "Admin storage is not configured." }, { status: 503 })
  }
  if (!(await credentialsMatch(request, env.ADMIN_PASSWORD))) {
    return json({ error: "Unauthorized." }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: "Invalid menu page." }, { status: 400 })
  }

  const category = String(body?.category ?? "").toLowerCase()
  const id = body?.id
  const order = body?.order
  if (
    typeof id !== "string" ||
    !validOrder(category, [id]) ||
    !validOrder(category, order) ||
    order.includes(id)
  ) {
    return json({ error: "Invalid menu page or order." }, { status: 400 })
  }

  await writeOrder(env.MENU_IMAGES, category, order)
  await env.MENU_IMAGES.delete(id)

  return json(
    { order },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  )
}

export async function saveMenuOrder(request, env) {
  if (!configured(env)) {
    return json({ error: "Admin storage is not configured." }, { status: 503 })
  }
  if (!(await credentialsMatch(request, env.ADMIN_PASSWORD))) {
    return json({ error: "Unauthorized." }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: "Invalid menu order." }, { status: 400 })
  }

  const category = body?.category
  const order = body?.order
  if (!validOrder(category, order)) {
    return json({ error: "Invalid menu order." }, { status: 400 })
  }

  await writeOrder(env.MENU_IMAGES, category, order)
  return json(
    { order },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  )
}

export async function getMenuImage(request, env) {
  if (!env.MENU_IMAGES) return new Response("Not found", { status: 404 })

  const key = new URL(request.url).searchParams.get("key") ?? ""
  if (!uploadedKeyPattern.test(key)) {
    return new Response("Not found", { status: 404 })
  }

  const object = await env.MENU_IMAGES.get(key)
  if (!object) return new Response("Not found", { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set("ETag", object.httpEtag)
  headers.set("Cache-Control", "public, max-age=31536000, immutable")
  headers.set("X-Content-Type-Options", "nosniff")
  return new Response(object.body, { headers })
}

export function apiNotFound() {
  return json({ error: "Not found." }, { status: 404 })
}

export function methodNotAllowed(allowedMethods) {
  return json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: allowedMethods.join(", ") } },
  )
}
