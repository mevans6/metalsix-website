# Metalsix Website

The official static website for Metalsix, an old-school instrumental death metal project.

## Local preview

No build step or package installation is required. From the repository root, run:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

The Python preview server does not process PHP. Newsletter subscriptions are submitted directly to Mailchimp, so the deployed site does not require a server-side runtime.

## Structure

- `index.html` — page content, metadata, newsletter form, and audio-player markup
- `CSS/styles.css` — site theme and responsive layout
- `JS/script.js` — newsletter dialog and audio-player behavior
- `Audio/` — streaming tracks
- `Images/` — optimized site and merchandise artwork
- `fonts/` — locally hosted display font
- `vercel.json` — Vercel response-header and clean-URL configuration

Large source artwork and font specimen files remain in the repository for archival use but are excluded from Vercel deployments through `.vercelignore`.

## Vercel deployment

Import this GitHub repository into Vercel with the **Other** framework preset. Leave the build command and output directory empty; Vercel will serve the repository as a static site.

Add both `metalsix.com` and `www.metalsix.com` in the project’s **Settings → Domains** screen. Choose one as the primary domain and configure the other to redirect to it.

Before replacing existing nameservers, copy any DNS records that must continue working—especially MX, TXT, and mail-related CNAME records—into Vercel DNS. Once the records are present, update the registrar to use:

```text
ns1.vercel-dns.com
ns2.vercel-dns.com
```

DNS and SSL provisioning can take time to propagate. Vercel’s domain screen shows when both are verified.
