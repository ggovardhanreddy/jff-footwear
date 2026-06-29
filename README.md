# JFF Footwear

Static website for **JFF Footwear** — *Luxury for Every Step*.

## Preview locally

Open `index.html` in your browser, or run:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Deploy free on GitHub Pages

1. Create a new public repo on GitHub named `jff-footwear` (or any name).

2. Push this project:

```bash
cd ~/Projects/jff-footwear
git add .
git commit -m "Add JFF Footwear landing page"
git branch -M main
git remote add origin https://github.com/ggovardhanreddy/jff-footwear.git
git push -u origin main
```

3. On GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)**

4. Your site will be live at:

**https://ggovardhanreddy.github.io/jff-footwear/**

(Replace `jff-footwear` if you used a different repo name.)

## Edit content

- Page text: `index.html`
- Colors & layout: `css/style.css`
