# 🎀 a tiny thing for her — Next.js

A cute, imperfect-on-purpose little site: a login layer, then 10 this-or-that
questions one at a time. After she answers each, a photo drop appears so you
(or she) can add a picture — it pops in with a wobbly polaroid animation.
At the end, every photo gathers into a little gallery.

## Run it
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Customize
- **Password** for the login: edit `HER_NAME` near the top of `app/page.js`
  (currently `"cutie"` — type that to get in).
- **Questions / answers / emojis**: the `QUESTIONS` array in `app/page.js`.
  Each `right` is the answer you predicted (kept for your own reference).
- **Colors / wobble / fonts**: `app/globals.css` (`:root` variables at the top).
- **Photos**: added live in-browser, no upload server needed. To bake in fixed
  photos instead, drop files in `public/photos/` and point the `<img src>` there.

Monolithic by design — everything lives in `app/page.js` + `app/globals.css`.
