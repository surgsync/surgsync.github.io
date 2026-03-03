# HOW TO EDIT THE SURGSYNC WEBSITE

All website content lives in `index.html`. The file is heavily commented so every section is clearly labelled. This guide walks through the most common edits.

---

## Page Structure (top → bottom)

```
Navbar → Hero (title + badges) → Teaser (overview figure) → Authors → Abstract
→ Video → Dataset → Post-Collection Toolbox → Key Contributions
→ System Setup → Results → BibTeX → Footer
```

---

## 1. Activate Paper / Code / Dataset Links

The hero section has **5 badges** arranged in two rows. Each is currently marked "Coming Soon" (greyed out, not clickable). To activate one when the link is ready:

1. Remove `class="coming-soon-link"` from the outer `<span>`
2. Change the inner `<a>` — add `href="YOUR_URL"` and `class="external-link"`
3. Delete the `<span class="coming-soon-badge">(Coming Soon)</span>` inside it

**Badge order:**

| Row | Badge | Icon | Suggested URL |
|-----|-------|------|---------------|
| 1 | Paper | `fa-file-pdf` | `https://arxiv.org/pdf/XXXX.XXXXX` |
| 1 | arXiv | `ai-arxiv` | `https://arxiv.org/abs/XXXX.XXXXX` |
| 1 | Dataset | `fa-images` | `https://huggingface.co/datasets/surgsync/...` |
| 2 | Code-Toolbox | `fa-github` | `https://github.com/surgsync/surgsync-toolbox` |
| 2 | Code-Framework | `fa-github` | `https://github.com/surgsync/surgsync` |

Also update the two footer icon-links (`<a class="icon-link">`) at the very bottom of `index.html`.

---

## 2. Add Author Profile Photos

Author photos live in `static/images/authors/`. Drop in a file with the matching name and the placeholder disappears automatically (the `onerror` fallback in the HTML hides the initials tile and shows the image instead).

| Author | Expected filename |
|--------|------------------|
| Haoying Zhou | `haoying_zhou.jpg` |
| Junlin Wu | `junlin_wu.jpg` |
| Zijian Wu | `zijian_wu.jpg` |
| Septimiu E. Salcudean | `salcudean.jpg` |
| Gregory S. Fischer | `gregory_fischer.jpg` |
| Peter Kazanzides | `peter_kazanzides.jpg` |

Authors without a photo file show a colored square tile with their initials instead. The layout is fixed at **three rows: 4 / 3 / 3 authors** — edit the `.author-row` divs in `index.html` if you need to reorder.

**Photo requirements:** square crop, minimum 200 × 200 px, `.jpg` or `.png`.

---

## 3. Update Author Webpage Links

Author names that already have homepage links are wrapped in `<a href="...">` inside the **Authors** section (`id="authors"`). To add or change a link, find the author's `<div class="author-profile">` block and update the `href`:

```html
<!-- Authors WITHOUT a homepage currently show only an initials tile.
     To add a link, wrap the initials div (or img) in an <a> tag: -->
<div class="author-profile">
  <a href="https://example.com/chang-liu" target="_blank" rel="noopener noreferrer">
    <div class="author-initials" style="background: #00796b;">CL</div>
  </a>
  <p class="author-name">
    <a href="https://example.com/chang-liu" target="_blank" rel="noopener noreferrer">Chang Liu</a>
  </p>
  <p class="author-affiliation"><sup>2</sup> JHU</p>
</div>
```

---

## 4. Activate the Video Section

The Video section currently shows a "Coming Soon" placeholder. When the YouTube video is ready, replace the placeholder `<div class="coming-soon-notice">` block with:

```html
<div class="publication-video">
  <!-- Replace VIDEO_ID with the YouTube video ID, e.g. "abcd1234xyz"
       from the URL https://youtu.be/abcd1234xyz -->
  <iframe src="https://www.youtube.com/embed/VIDEO_ID?rel=0&amp;showinfo=0"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen></iframe>
</div>
```

To host the video locally instead:

```html
<div class="publication-video">
  <video controls autoplay muted loop playsinline>
    <source src="./static/videos/surgsync_demo.mp4" type="video/mp4">
  </video>
</div>
```

---

## 5. Add Toolbox Demo Videos

The Post-Collection Toolbox section (`id="toolbox"`) has **8 `<video>` slots**. Each shows a placeholder automatically when its source file is missing. Drop in the correctly named mp4 file and it plays immediately — no HTML changes needed.

| Subsection | Column | Expected file |
|-----------|--------|---------------|
| Kinematic Reprojection | Left (original) | `static/videos/toolbox/kinematic_original.mp4` |
| Kinematic Reprojection | Right top (PSM1) | `static/videos/toolbox/kinematic_psm1.mp4` |
| Kinematic Reprojection | Right bottom (PSM2) | `static/videos/toolbox/kinematic_psm2.mp4` |
| Depth Estimation | Left (original) | `static/videos/toolbox/depth_original.mp4` |
| Depth Estimation | Right (disparity) | `static/videos/toolbox/depth_disparity.mp4` |
| Optical Flow | Left (original) | `static/videos/toolbox/flow_original.mp4` |
| Optical Flow | Right (flow output) | `static/videos/toolbox/flow_output.mp4` |
| Annotation GUI | Right (demo) | `static/videos/toolbox/annotation_demo.mp4` |

The Annotation GUI left column is a **static image** (not a video):

| Column | Expected file |
|--------|---------------|
| Annotation GUI left (screenshot) | `static/images/toolbox/annotation_gui.png` |

---

## 6. Add / Replace Static Images

Drop the correctly named file into `static/images/` and the `onerror` placeholder disappears automatically.

| What | Filename |
|------|----------|
| Overview diagram (Fig. 1) | `static/images/overview.png` |
| Full system setup (Fig. 4) | `static/images/system_setup.png` |
| dVRK-Si endoscope frame | `static/images/endoscope_dvrk.png` |
| Custom endoscope frame | `static/images/endoscope_custom.png` |
| Time latency histogram (Fig. 8) | `static/images/time_latency.png` |

---

## 7. Enable Google Analytics

A commented-out GA4 snippet is already in `<head>`. To activate it:

1. Go to **Google Analytics → Admin → Data Streams → Web stream** and copy your Measurement ID (format: `G-XXXXXXXXXX`).
2. Open `index.html` and find the `GOOGLE ANALYTICS` comment block near the top of `<head>`.
3. Replace every occurrence of `GA_MEASUREMENT_ID` with your real ID.
4. Uncomment both `<script>` blocks (remove the `<!--` / `-->` wrapper).

---

## 8. Update BibTeX

Find the `<pre><code>` block inside `<section id="BibTeX">` and paste the final citation once the paper is published on IEEE Xplore / arXiv.

---

## 9. Change Colors / Fonts / Layout

Open `static/css/index.css`. Key configuration points:

| What to change | Where in the CSS |
|----------------|-----------------|
| Base font size (scales everything) | `html { font-size: ... }` |
| SurgSync brand color | `.surgsync { color: ... }` |
| Alternating section background | `.section-alt { background-color: ... }` |
| Author photo size | `.author-photo` and `.author-initials` — change `width` / `height` |
| Author photo corner radius | `.author-photo { border-radius: ... }` — `8px` = square-ish, `50%` = circular |
| Toolbox video corner radius | `.toolbox-video-figure video { border-radius: ... }` |
| Card hover effect | `.feature-card:hover` |
| Body font | `body { font-family: ... }` |
| Dataset table Online color | `.dataset-th-online` / `.dataset-online` |
| Dataset table Offline color | `.dataset-th-offline` / `.dataset-offline` |

---

## 10. Add a Results Carousel

Insert a carousel block inside any `<section>`:

```html
<div id="results-carousel" class="carousel results-carousel">
  <div class="item">
    <img src="./static/images/result1.png" alt="Result 1">
  </div>
  <div class="item">
    <video autoplay controls muted loop playsinline>
      <source src="./static/videos/result2.mp4" type="video/mp4">
    </video>
  </div>
</div>
```

The carousel is initialised automatically by `static/js/index.js`. To change how many items show at once, edit `slidesToShow` in that file.

---

## File Overview

```
surgsync.github.io/
├── index.html                    ← All website content (edit here)
├── static/
│   ├── css/
│   │   ├── index.css             ← Custom styles (colors, fonts, layout)
│   │   ├── bulma.min.css         ← Bulma framework (do not edit)
│   │   ├── bulma-carousel.min.css
│   │   ├── bulma-slider.min.css
│   │   └── fontawesome.all.min.css
│   ├── js/
│   │   ├── index.js              ← Custom JS (navbar, video placeholders)
│   │   ├── bulma-carousel.min.js
│   │   ├── bulma-slider.min.js
│   │   └── fontawesome.all.min.js
│   ├── images/
│   │   ├── authors/              ← Author headshots (firstname_lastname.jpg)
│   │   ├── toolbox/              ← Toolbox screenshots (annotation_gui.png)
│   │   ├── overview.png
│   │   ├── system_setup.png
│   │   ├── endoscope_dvrk.png
│   │   ├── endoscope_custom.png
│   │   └── time_latency.png
│   └── videos/
│       ├── toolbox/              ← Toolbox demo videos (see §5 above)
│       └── surgsync_demo.mp4     ← Main demo video (optional local host)
├── HOW_TO_EDIT.md                ← This file
├── HOW_TO_RUN.md                 ← How to preview locally
└── CLAUDE.md                     ← Claude Code instructions
```
