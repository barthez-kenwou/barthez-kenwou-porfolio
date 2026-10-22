# Cloudflare cache vs Lighthouse “efficient cache lifetimes”

## Diagnostic

Origin nginx already sends for `/assets/*` and hashed static files:

```http
Cache-Control: public, max-age=31536000, immutable
CDN-Cache-Control: public, max-age=31536000, immutable
```

Live responses often show:

```http
cache-control: max-age=81470
cdn-cache-control: public, max-age=31536000, immutable
expires: <~22h>
```

→ **Cloudflare Browser Cache TTL** rewrites the *browser* `Cache-Control` to ~1 day. Edge caching is fine; Lighthouse scores the browser TTL.

## Fix (dashboard)

1. Cloudflare → zone `barthez-kenwou.dev`
2. **Caching** → **Configuration**
3. **Browser Cache TTL** → **Respect Existing Headers**
4. Optional: Cache Rule for `http.request.uri.path matches "^/assets/"` → Edge TTL 1 year, Browser TTL respect origin

Then re-check:

```bash
curl -sI "https://barthez-kenwou.dev/assets/<any-hashed>.js" | grep -i cache
```

Expect `cache-control: public, max-age=31536000, immutable`.

## Third parties (not fixable in this repo)

| Origin | Issue |
|--------|--------|
| `s3.zenora360.com` partner originals | Mitigated: home uses local WebP under `/images/partners/` |
| `analytics.zenora360.com` | 4h TTL — accept or host self |
| Supabase profile JPEG | Mitigated: local `/images/barthez-type-2.webp` |
