const maximumBodySize = 16 * 1024
const budgets = new Set([
  "Under $250",
  "$250 – $500",
  "$500 – $1,000",
  "$1,000 – $2,000",
  "$2,000+",
])

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}

async function readBody(request) {
  const reader = request.body?.getReader()
  if (!reader) return null

  const chunks = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maximumBodySize) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }

  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes))
  } catch {
    return null
  }
}

function field(value, limit) {
  if (value == null) return ""
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length <= limit ? trimmed : null
}

function enquiryFrom(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null

  const enquiry = {
    name: field(body.name, 100),
    email: field(body.email, 254),
    phone: field(body.phone, 50),
    date: field(body.date, 10),
    headcount: field(body.headcount, 4),
    budget: field(body.budget, 40),
    message: field(body.message, 2000),
    website: field(body.website, 100),
  }

  if (Object.values(enquiry).some((value) => value === null)) return null
  if (!enquiry.name || /[\r\n\x00-\x1f]/.test(enquiry.name)) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) return null
  if (!budgets.has(enquiry.budget)) return null
  if (enquiry.date && !/^\d{4}-\d{2}-\d{2}$/.test(enquiry.date)) return null
  if (enquiry.headcount && !/^[1-9]\d{0,3}$/.test(enquiry.headcount)) return null

  return enquiry
}

export async function sendCateringEnquiry(request, env) {
  const origin = request.headers.get("Origin")
  if (origin && origin !== new URL(request.url).origin) {
    return json({ error: "This request is not allowed." }, 403)
  }

  if (request.headers.get("Content-Type")?.split(";", 1)[0].trim() !== "application/json") {
    return json({ error: "Please send the form as JSON." }, 415)
  }

  const enquiry = enquiryFrom(await readBody(request))
  if (!enquiry) return json({ error: "Please check the form details." }, 400)

  // This field is hidden from visitors; bots that fill it should not send mail.
  if (enquiry.website) return json({ ok: true })

  if (!env.CATERING_EMAIL || !env.CATERING_EMAIL_TO) {
    return json({ error: "Email enquiries are temporarily unavailable." }, 503)
  }

  const text = [
    "New catering enquiry from the website",
    "",
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || "Not provided"}`,
    `Event date: ${enquiry.date || "Not provided"}`,
    `Headcount: ${enquiry.headcount || "Not provided"}`,
    `Budget (AUD): ${enquiry.budget}`,
    "",
    "Additional details:",
    enquiry.message || "None provided",
  ].join("\n")

  try {
    await env.CATERING_EMAIL.send({
      // The Wrangler binding also restricts this recipient server-side.
      to: env.CATERING_EMAIL_TO,
      from: { email: "catering@theoutbackfnb.com", name: "The Outback F&B Service" },
      replyTo: { email: enquiry.email, name: enquiry.name },
      subject: `Catering enquiry from ${enquiry.name}`,
      text,
    })
    return json({ ok: true })
  } catch (error) {
    console.error("Catering email failed:", error?.code ?? "unknown")
    return json({ error: "We couldn't send your enquiry. Please call us instead." }, 502)
  }
}
