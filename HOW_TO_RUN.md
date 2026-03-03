# HOW TO RUN THE SURGSYNC WEBSITE

The site is a plain static website (HTML + CSS + JS) — no build step, no compilation. You just need a local HTTP server to serve files (so that relative paths like `./static/css/...` resolve correctly in the browser).

---

## Option A — Python (Simplest, no installation needed)

```bash
cd /path/to/surgsync.github.io

# Python 3 (recommended)
python3 -m http.server 8000

# Python 2 (if python3 unavailable)
python -m SimpleHTTPServer 8000
```

Open your browser at: **http://localhost:8000**

---

## Option B — Jekyll via conda (recommended for local testing)

A pre-configured conda environment `surgsync_website` is already set up with Jekyll 3.10 and Ruby 3.2.

### First-time setup (already done — skip if env exists)

```bash
# Create the environment with Ruby 3.2 + compilers
conda create -n surgsync_website -c conda-forge "ruby=3.2" c-compiler cxx-compiler -y

# Install Jekyll, Bundler, and webrick
conda run -n surgsync_website gem install jekyll bundler webrick

# Fix: create ruby symlink so gem executables can find ruby
ln -sf \
  /home/<user_name>/conda/envs/surgsync_website/bin/ruby \
  /home/<user_name>/conda/envs/surgsync_website/share/rubygems/bin/ruby

# Install project gem dependencies (generates Gemfile.lock)
conda run -n surgsync_website bundle install
```

### Run the site

```bash
cd /path/to/surgsync.github.io

conda run -n surgsync_website bundle exec jekyll serve --port 4000
```

Open your browser at: **http://localhost:4000**

Jekyll watches for file changes and auto-rebuilds. Refresh the browser to see updates.

To stop: press `Ctrl+C`.

> **Note:** The `_site/` build output and `Gemfile.lock` are already in `.gitignore` — do not commit them.

---

## Option C — Node.js `serve` (Lightweight, fast)

```bash
# Install once
npm install -g serve

# Run
cd /path/to/surgsync.github.io
serve -p 8000
```

Open your browser at: **http://localhost:8000**

---

## Setting Up Google Analytics (View Tracking)

### Step 1 — Create a Google Analytics 4 property

1. Go to **https://analytics.google.com** and sign in with your Google account.
2. Click **Admin** (gear icon, bottom-left).
3. Under *Account*, click **Create Account** (or pick an existing account).
4. Under *Property*, click **Create Property** → choose **Web**.
5. Enter the site URL: `https://surgsync.github.io` and a property name (e.g. `SurgSync`).
6. Complete the setup wizard.

### Step 2 — Get your Measurement ID

After the property is created:

1. In the left sidebar go to **Admin → Data Streams**.
2. Click your web stream (it will be listed as `surgsync.github.io`).
3. Copy the **Measurement ID** — it looks like `G-XXXXXXXXXX`.

### Step 3 — Enable tracking in `index.html`

Open `index.html` and find the `GOOGLE ANALYTICS` block near the top of `<head>` (around line 11):

```js
var GA_ENABLED        = false;          // ← set to true to enable tracking
var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ← replace with your real ID
```

Make two edits:

1. Change `false` to `true`.
2. Replace `G-XXXXXXXXXX` with your real Measurement ID (e.g. `G-A1B2C3D4E5`).

To disable tracking again later, just set `GA_ENABLED` back to `false` — no other changes needed.

### Step 4 — Deploy and verify

1. Push `index.html` to the `main` branch (see *Deploying to GitHub Pages* below).
2. Visit **https://surgsync.github.io** in your browser.
3. In Google Analytics go to **Reports → Realtime** — you should see yourself as an active user within a minute.

> **Note:** Analytics does **not** track traffic on `localhost` — you must view the live deployed site for data to appear.

---

## Deploying to GitHub Pages

1. Push all changes to the `main` branch of the `surgsync/surgsync.github.io` repository.
2. GitHub Pages automatically serves the `index.html` at the root.
3. The site will be live at: **https://surgsync.github.io**

No build step is required — GitHub Pages serves static HTML files directly.

> **Important:** Do not push directly. Commit locally and let the repository owner do the final review before pushing.
