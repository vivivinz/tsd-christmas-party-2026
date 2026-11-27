# TSD Christmas Party 2026 – Invitation

Static, mobile-first invitation site (plain HTML/CSS/JS, no build step).

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page structure + link-preview (Open Graph) tags |
| `styles.css` | Cover, opening animation, opened scene, sound button |
| `details.css` | **Placeholder** Program/Details section (replace in part 2) |
| `script.js` | `CONTENT` object (all invitation copy), opening sequence, confetti, music |
| `assets/` | Images (WebP), music, favicon, preview image, calendar file |

## Editing

- **Invitation text:** edit the `CONTENT` object at the top of `script.js`.
- **Link-preview text and image:** the `<head>` of `index.html`. `og:url` and `og:image` must be absolute
  URLs: they currently point to `https://vivivinz.github.io/tsd-christmas-party-2026/`. Change them if you
  publish elsewhere.
- **Calendar event:** `assets/tsd-christmas-party-2026.ics` (Dec 18 2026, 5:00–11:00 PM, Asia/Manila).
  The end time is an assumption because the invite says "5:00 PM Onwards".
- **Music:** replace `assets/christmas.mp3`. Volume and fade-in time are in `CONTENT.music`.

## Deploy

**GitHub Pages:** Settings → Pages → Deploy from a branch → pick the branch and `/ (root)`.
**Netlify:** drag the folder into the Netlify dashboard (no build command, publish directory = root).

## Assets

The Canva PNGs were exported with white backgrounds. They were cut out to transparent WebP, and the two
envelopes were split into layers for the animation:

- `envelope-pocket.webp` / `envelope-flap.webp`: the closed envelope cut along the top flap. The wax seal
  breaks along the flap edge, so the top half lifts away with the flap.
- `envelope-open-back.webp` / `envelope-open-pocket.webp`: the open envelope without its card. The card is
  HTML so its text stays editable.
- `seal-mask.webp`: the seal outline, used for the shimmer.
