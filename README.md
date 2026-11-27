# TSD Christmas Party 2026 – Invitation

Static, mobile-first invitation site (plain HTML/CSS/JS, no build step).

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page structure + link-preview (Open Graph) tags |
| `styles.css` | Cover, opening animation, opened scene, sound button |
| `script.js` | `CONTENT` object (all invitation copy), opening sequence, confetti, music |
| `program.js` | **Program timeline**: `PROGRAM` array (times/titles/acts), `ACTS`, `PROGRAM_COPY`, rendering |
| `program.css` | Program timeline styles ("Wired for Greatness" lights) |
| `assets/` | Images (WebP), music, favicon, preview image, calendar file |

## Editing

- **Invitation text:** edit the `CONTENT` object at the top of `script.js`.
- **Program:** edit the `PROGRAM` array at the top of `program.js`, one line per item:
  `{ time: '5:00 – 5:30 PM', title: 'Registration', act: 1 }`. An empty `time` hides the gold pill.
  Titles containing "Raffle" get the ticket icon automatically, and the last item is styled as the finale.
  Act names and the Christmas element used for each act header are in `ACTS`.
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
