# Automation Automation — Website

Static, responsive website highlighting automation services built with n8n and Zapier.

## Quick Start

- Open `index.html:1` in your browser. No build step required.
- Edit brand and copy in `index.html:1` (header, hero, sections).
- Tweak styles in `assets/style.css:1`.

## Contact Form Webhooks

The contact form posts JSON to a webhook you control (Zapier or n8n). Configure the attributes on the form element in `index.html:184`:

```html
<form
  id="contact-form"
  data-webhook-zapier="https://hooks.zapier.com/hooks/catch/XXX/YYY"
  data-webhook-n8n="https://api.n8n.cloud/webhook/your-webhook-id">
```

The platform preference dropdown (`auto`, `zapier`, `n8n`) drives which URL is used. In `auto`, the script prefers Zapier if set, otherwise n8n.

Submission logic lives in `assets/main.js:28`.

### Zapier

1. Create a Catch Hook trigger in Zapier.
2. Copy the provided webhook URL into `data-webhook-zapier`.
3. Add subsequent Zap steps (email, CRM create/update, Slack alert, etc.).

### n8n

1. Create a Webhook node in n8n (test + production URLs recommended).
2. Map incoming JSON fields to your workflow.
3. Paste the production URL into `data-webhook-n8n`.

## Customization Ideas

- Update pricing in `index.html:120`.
- Add logos/testimonials sections under `index.html:30`.
- Expand the services grid in `index.html:43`.
- Add a privacy page and link it in the footer.

## Deploy Options

- Local/Windows: double‑click `index.html:1`.
- Static hosting (no server): GitHub Pages, Netlify, Vercel, Cloudflare Pages.
- Set a custom domain and enable HTTPS.

## Notes

- This site does not require external packages or a build tool.
- Replace placeholder copy and pricing with your actual offers.

