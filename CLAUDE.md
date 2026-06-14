# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing website for **MKTECH Inc.** (mktechinc.kr), a semiconductor wafer coating/developing equipment company. Pure static site — Vanilla HTML5 + CSS3 + ES6 JavaScript. **No build tools, no framework, no package.json, no tests.** Editing a file is the entire workflow; refresh the browser to see changes.

Note: `PROGRESS.md` is a Korean-language project journal. Useful for the real company contact details (section 11) and deployment plan, but parts are stale (it predates the current bilingual structure and the rebrand from "MKTECK / smart manufacturing" to "MKTECH / wafer equipment").

## Running locally

```bash
python3 -m http.server 8080      # then open http://localhost:8080
```

There is no build, lint, or test step. Open paths directly: `/` (English), `/ko/` (Korean), `/pages/<product>.html`.

## Architecture

### Bilingual structure — fully duplicated, no i18n runtime
The site has **two parallel copies of every page**, English at the root and Korean under `ko/`. There is no JS-based string substitution; each language is hand-authored separate HTML. The `EN`/`KR` button (`.lang-switch`) is a plain link to the mirror page.

```
index.html              ko/index.html
pages/<name>.html        ko/pages/<name>.html
```
Products: `spin-coater`, `wafer-developer`, `scrubber-system`.

**Implication: any content/layout change must be made in both language copies** (and at both the homepage and product-page level if it touches shared chrome like the header/footer). Cross-links between mirrors are relative and depth-sensitive — get the `../` count right:
- `index.html` → `ko/index.html`; `ko/index.html` → `../index.html`
- `pages/x.html` → `../ko/pages/x.html`; `ko/pages/x.html` → `../../pages/x.html`
- All CSS links resolve to the single `css/style.css` (`css/`, `../css/`, or `../../css/` by depth).

### Single shared stylesheet
`css/style.css` styles every page across both languages. Design tokens are CSS variables in `:root` (`--primary: #0046ff`, `--dark`, `--darker`, `--gray-light`, `--transition`, etc.) — prefer these over hardcoded values. Responsive breakpoints at 1024px (tablet) and 768px (mobile); mobile nav switches to a hamburger + fullscreen overlay.

### One shared script, ID-driven
`js/main.js` runs only on the homepages (it queries IDs that exist there). It wires, by `getElementById`/`querySelector`:
- `#header` scroll class toggle, `#hamburger`/`#nav` mobile menu
- `.reveal` scroll-in animations (add `.reveal` to opt an element in)
- `#rotatingText` hero word cycler — **the word list is hardcoded in `main.js` and is English-only**; the Korean homepage shows these same English words
- `#particles` hero particle generation, `.counter[data-target]` count-up via IntersectionObserver
- smooth scroll for `a[href^="#"]`

Product pages don't include `main.js`; they're static.

## Conventions when editing

- Keep the EN and KO copies in sync — content edits land in two files.
- Reuse existing CSS classes and the `:root` tokens rather than adding inline styles or new colors.
- Real company contact info (footer, mailto) is fixed: email `mktech1@mktechinc.kr`, phone `070-7717-3069`, 대표 정명균. See `PROGRESS.md` §11 for the full canonical list.
- Product source images live in `images/` and are large; commit `f75583a` already optimized them — avoid re-adding multi-MB originals (the loose `Gemini_Generated_Image_*.png` files at repo root are unused scratch assets).
