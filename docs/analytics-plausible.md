# Plausible CE tracking (frontend)

Pageviews: automatic via the script in `index.html` (`analytics.zenora360.com`).

Custom events: `src/app/lib/analytics.ts` → `window.plausible(event, { props })`.

## Goals to create in Plausible UI

| Event | When |
|-------|------|
| `cta_click` | Hero / home CTA / CV CTAs |
| `cv_download` | PDF download from CV modal |
| `contact_click` | Contact CTA, mailto, form submit |
| `newsletter_subscribe` | Successful newsletter signup |
| `outbound_click` | Project github/demo/external links |
| `scroll_depth` | 25 / 50 / 75 / 100% (once per path / session) |
| `engagement_time` | 15 / 30 / 60 / 120 / 300s visible (once per mark) |
| `video_play` | Presentation video open |
| `video_progress` / `video_complete` | HTML5 video hooks (when used) |
| `blog_read` | Blog article mount (+ scroll via `scroll_depth`) |
| `project_view` | Project case study open |

No email/IP/PII in props. Admin routes are not tracked.

CMS live stats: backend `GET /api/v1/admin/analytics/overview` (requires `PLAUSIBLE_API_KEY`).
