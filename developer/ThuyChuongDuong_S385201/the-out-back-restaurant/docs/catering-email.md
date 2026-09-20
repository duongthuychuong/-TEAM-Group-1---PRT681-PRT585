# Catering enquiry email

The catering form posts to `/api/catering-enquiry` on the existing Cloudflare
Worker. It sends through Cloudflare's `CATERING_EMAIL` binding; visitors do not
need an email app. The recipient is fixed on the server, not supplied by the
visitor. The sender is `catering@theoutbackfnb.com`, and replies go to the
customer's address.

## Recipient

The current recipient is `admin@theoutbackfnb.com`. It is configured in **both**
`wrangler.jsonc` locations: `send_email[0].destination_address` restricts the
binding, and `vars.CATERING_EMAIL_TO` supplies the address to the API call.
The destination must be verified under Cloudflare **Compute → Email Service →
Email Routing → Destination Addresses**. Do not change existing MX records just
to verify a destination address.

To change the inbox later, verify the new destination address, then change both
values in `wrangler.jsonc`, build, and deploy. If GitHub builds are connected,
commit and push the change instead of deploying manually.

## Local development and checks

Use Node.js 22.12.0 or newer. `npm test` checks the API with a mocked email
binding, and `npm run build` builds the site. `npm run admin:dev` runs the built
site and Worker locally. Because the email binding uses `remote: true`, sending
a valid enquiry from that local Worker sends a **real** email to the configured
recipient. The ordinary Vite-only preview does not run the Worker API.

The form shows success only after Cloudflare accepts the send. If sending fails,
the form remains filled in and shows the restaurant phone number so the customer
can still enquire.
