# Deployment Notes

## Static deployment

This app should work as a static site.

Recommended free/low-cost options:
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel

## Build command

```bash
npm run build
```

## Output directory

```text
dist
```

## No backend required

Progress is stored locally in the browser using localStorage.

This means:
- progress is device-specific
- no login is needed
- no child data leaves the device
- if browser data is cleared, progress is lost

## Future backend option

Only add Cloudflare D1 or another database if the user specifically wants:
- progress synced across devices
- a parent dashboard
- remote backup

Do not add a backend for MVP unless required.
