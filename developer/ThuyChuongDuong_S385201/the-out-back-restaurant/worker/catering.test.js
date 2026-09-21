import assert from "node:assert/strict"
import test from "node:test"
import { sendCateringEnquiry } from "./catering.js"

const url = "https://theoutbackfnb.com/api/catering-enquiry"
const validEnquiry = {
  name: "Test Customer",
  email: "customer@example.com",
  phone: "0435 337 006",
  date: "2026-09-25",
  headcount: "1",
  budget: "Under $250",
  message: "Vegetarian options, please.",
  website: "",
}

function request(body = validEnquiry, headers = {}) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  })
}

test("sends a valid enquiry and preserves reply details", async () => {
  let sent
  const response = await sendCateringEnquiry(request(), {
    CATERING_EMAIL_TO: "admin@theoutbackfnb.com",
    CATERING_EMAIL: { send: async (message) => { sent = message } },
  })

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(sent.replyTo.email, validEnquiry.email)
  assert.equal(sent.to, "admin@theoutbackfnb.com")
  assert.equal(sent.subject, "Catering enquiry from Test Customer")
  assert.match(sent.text, /Headcount: 1/)
  assert.match(sent.text, /Vegetarian options, please\./)
})

test("rejects invalid fields without sending mail", async () => {
  let calls = 0
  const env = {
    CATERING_EMAIL_TO: "admin@theoutbackfnb.com",
    CATERING_EMAIL: { send: async () => { calls += 1 } },
  }

  for (const body of [
    { ...validEnquiry, email: "not-an-email" },
    { ...validEnquiry, budget: "Unlimited" },
    { ...validEnquiry, name: "Test\nBcc: someone@example.com" },
    { ...validEnquiry, headcount: "0" },
  ]) {
    const response = await sendCateringEnquiry(request(body), env)
    assert.equal(response.status, 400)
  }
  assert.equal(calls, 0)
})

test("quietly ignores a filled honeypot", async () => {
  let calls = 0
  const response = await sendCateringEnquiry(
    request({ ...validEnquiry, website: "https://spam.example" }),
    {
      CATERING_EMAIL_TO: "admin@theoutbackfnb.com",
      CATERING_EMAIL: { send: async () => { calls += 1 } },
    },
  )
  assert.equal(response.status, 200)
  assert.equal(calls, 0)
})

test("rejects cross-origin and non-JSON requests", async () => {
  const crossOrigin = await sendCateringEnquiry(
    request(validEnquiry, { Origin: "https://other.example" }),
    {},
  )
  assert.equal(crossOrigin.status, 403)

  const nonJson = await sendCateringEnquiry(
    request(validEnquiry, { "Content-Type": "text/plain" }),
    {},
  )
  assert.equal(nonJson.status, 415)
})

test("reports unavailable email binding and delivery failures", async () => {
  const unavailable = await sendCateringEnquiry(request(), {})
  assert.equal(unavailable.status, 503)

  const originalError = console.error
  console.error = () => {}
  try {
    const failure = await sendCateringEnquiry(request(), {
      CATERING_EMAIL_TO: "admin@theoutbackfnb.com",
      CATERING_EMAIL: { send: async () => { throw new Error("unverified") } },
    })
    assert.equal(failure.status, 502)
    assert.match((await failure.json()).error, /couldn't send/i)
  } finally {
    console.error = originalError
  }
})

test("rejects requests larger than the form limit", async () => {
  const response = await sendCateringEnquiry(
    request({ ...validEnquiry, message: "x".repeat(20_000) }),
    {
      CATERING_EMAIL_TO: "admin@theoutbackfnb.com",
      CATERING_EMAIL: { send: async () => { throw new Error("must not send") } },
    },
  )
  assert.equal(response.status, 400)
})
