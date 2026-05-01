# mindorfact-website

Mindorfact website — minimal submission-ready Astro static site for the Mindorfact iOS app.

**Domain:** mindorfact.com  
**Hosted on:** Vercel  
**iOS repo:** /Users/kyrylo/Documents/Projects/mindorfact

## Pages

| URL | Purpose |
|-----|---------|
| `/` | Coming soon + email signup |
| `/privacy` | Privacy Policy (UK + EN, Apple GDPR-compliant) |
| `/terms` | Terms of Use (UK + EN, Apple EULA reference) |
| `/support` | Support contact + FAQ |

## Setup

```bash
npm install
```

## Dev

```bash
npm run dev
# → http://localhost:4321
```

## Build

```bash
npm run build
# → static output in dist/
```

## Deploy

```bash
vercel deploy --prod
```

DNS: Point `mindorfact.com` A/AAAA records to Vercel, or add CNAME `cname.vercel-dns.com`.  
TLS is auto-issued by Vercel via Let's Encrypt.

After deploy, verify URLs:
```bash
curl -I https://mindorfact.com/privacy   # expect 200
curl -I https://mindorfact.com/terms     # expect 200
curl -I https://mindorfact.com/support   # expect 200
```

## Email aliases (Cloudflare Email Routing)

- `support@mindorfact.com` → dreamer1cc@gmail.com
- `privacy@mindorfact.com` → dreamer1cc@gmail.com
- `legal@mindorfact.com` → dreamer1cc@gmail.com
