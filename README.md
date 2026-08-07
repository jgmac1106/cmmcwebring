# CMMC Webring

A small, human-curated ring of independent bloggers writing about CMMC, NIST SP 800-171, and
practical cybersecurity. The site is dependency-free HTML, CSS, and JavaScript designed for GitHub
Pages.

## What is included

- A searchable-by-eye member directory with a deliberately old-web visual style
- Previous, next, and random ring navigation
- A copyable, no-third-party-JavaScript member snippet
- An 88×31 badge
- A structured membership application
- Registry validation and routing tests

## Publish with GitHub Pages

After merging the initial pull request:

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the `main` branch and `/ (root)` folder, then save.
4. Visit `https://jgmac1106.github.io/cmmcwebring/` after the deployment finishes.

You can later add a custom domain such as `ring.drmacscybersecuritybrief.com` in the same Pages
settings. Update the issue-template directory link if the public URL changes.

## Local development

No package installation is needed. Node.js 20 or newer runs the checks:

```sh
npm run check
```

Because browsers block `fetch()` from local files, serve the directory before opening it:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Add a member

Add one object to `sites.json`:

```json
{
  "id": "example-blog",
  "name": "Example Security Blog",
  "url": "https://example.com/",
  "feed": "https://example.com/feed.xml",
  "description": "Independent security writing for small organizations.",
  "topics": ["CMMC", "NIST-800-171"]
}
```

Member IDs are permanent. Reordering `sites.json` safely changes who is previous and next because
all navigation passes through the ring hub.

## Member navigation

The directory generates a member-specific snippet. It uses normal HTML links and does not inject
remote scripts into member sites.

## License

The project source is available under the MIT License. Member names, site descriptions, and linked
site content remain the property of their respective owners.
