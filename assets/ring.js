const allowedDirections = new Set(["next", "previous", "random"]);

function secureUrl(value, label) {
  let parsed;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid absolute URL.`);
  }

  if (parsed.protocol !== "https:") {
    throw new Error(`${label} must use HTTPS.`);
  }

  return parsed.href;
}

export function validateSites(value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("The ring must contain at least one site.");
  }

  const ids = new Set();
  const urls = new Set();

  return value.map((site, index) => {
    const label = `Site ${index + 1}`;

    if (!site || typeof site !== "object" || Array.isArray(site)) {
      throw new Error(`${label} must be an object.`);
    }

    if (typeof site.id !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(site.id)) {
      throw new Error(`${label} has an invalid id.`);
    }

    if (ids.has(site.id)) {
      throw new Error(`Duplicate site id: ${site.id}`);
    }
    ids.add(site.id);

    if (typeof site.name !== "string" || site.name.trim().length < 2) {
      throw new Error(`${label} needs a name.`);
    }

    if (typeof site.description !== "string" || site.description.trim().length < 10) {
      throw new Error(`${label} needs a useful description.`);
    }

    const url = secureUrl(site.url, `${label} URL`);
    if (urls.has(url)) {
      throw new Error(`Duplicate site URL: ${url}`);
    }
    urls.add(url);

    const feed = secureUrl(site.feed, `${label} feed`);

    if (!Array.isArray(site.topics) || site.topics.length === 0) {
      throw new Error(`${label} needs at least one topic.`);
    }

    if (!site.topics.every((topic) => typeof topic === "string" && topic.trim())) {
      throw new Error(`${label} has an invalid topic.`);
    }

    return Object.freeze({
      id: site.id,
      name: site.name.trim(),
      url,
      feed,
      description: site.description.trim(),
      topics: site.topics.map((topic) => topic.trim()),
    });
  });
}

export function destinationFor(sites, currentId, direction, random = Math.random) {
  if (!allowedDirections.has(direction)) {
    throw new Error("Direction must be next, previous, or random.");
  }

  if (direction === "random") {
    const candidates = currentId && sites.length > 1
      ? sites.filter((site) => site.id !== currentId)
      : sites;
    const index = Math.min(candidates.length - 1, Math.floor(random() * candidates.length));
    return candidates[Math.max(0, index)];
  }

  const currentIndex = sites.findIndex((site) => site.id === currentId);
  if (currentIndex === -1) {
    throw new Error("That member is not in the ring.");
  }

  const offset = direction === "previous" ? -1 : 1;
  const destinationIndex = (currentIndex + offset + sites.length) % sites.length;
  return sites[destinationIndex];
}

export function memberSnippet(siteId, baseUrl) {
  const root = new URL("./", baseUrl);
  const query = (direction) => {
    const url = new URL("go.html", root);
    url.searchParams.set("site", siteId);
    url.searchParams.set("dir", direction);
    return url.href;
  };

  return `<nav aria-label="CMMC Webring">
  <a href="${query("previous")}">← Previous</a>
  <a href="${root.href}">CMMC Webring</a>
  <a href="${query("random")}">Random</a>
  <a href="${query("next")}">Next →</a>
</nav>`;
}
