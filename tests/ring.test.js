import assert from "node:assert/strict";
import test from "node:test";

import { destinationFor, memberSnippet, validateSites } from "../assets/ring.js";

const rawSites = [
  {
    id: "alpha",
    name: "Alpha Security",
    url: "https://alpha.example/",
    feed: "https://alpha.example/feed.xml",
    description: "Practical notes from the alpha team.",
    topics: ["CMMC"],
  },
  {
    id: "bravo",
    name: "Bravo Security",
    url: "https://bravo.example/",
    feed: "https://bravo.example/feed.xml",
    description: "Practical notes from the bravo team.",
    topics: ["NIST"],
  },
  {
    id: "charlie",
    name: "Charlie Security",
    url: "https://charlie.example/",
    feed: "https://charlie.example/feed.xml",
    description: "Practical notes from the charlie team.",
    topics: ["CMMC"],
  },
];

test("validates and normalizes a registry", () => {
  const sites = validateSites(rawSites);
  assert.equal(sites.length, 3);
  assert.equal(sites[0].url, "https://alpha.example/");
});

test("next wraps from the final site to the first", () => {
  const sites = validateSites(rawSites);
  assert.equal(destinationFor(sites, "charlie", "next").id, "alpha");
});

test("previous wraps from the first site to the final", () => {
  const sites = validateSites(rawSites);
  assert.equal(destinationFor(sites, "alpha", "previous").id, "charlie");
});

test("random excludes the current member when alternatives exist", () => {
  const sites = validateSites(rawSites);
  assert.equal(destinationFor(sites, "alpha", "random", () => 0).id, "bravo");
});

test("rejects duplicate ids", () => {
  assert.throws(
    () => validateSites([rawSites[0], { ...rawSites[1], id: "alpha" }]),
    /Duplicate site id/,
  );
});

test("rejects non-HTTPS member URLs", () => {
  assert.throws(
    () => validateSites([{ ...rawSites[0], url: "http://alpha.example/" }]),
    /must use HTTPS/,
  );
});

test("rejects an unknown direction or member", () => {
  const sites = validateSites(rawSites);
  assert.throws(() => destinationFor(sites, "alpha", "sideways"), /Direction/);
  assert.throws(() => destinationFor(sites, "missing", "next"), /not in the ring/);
});

test("builds a project-safe member snippet", () => {
  const snippet = memberSnippet("alpha", "https://owner.github.io/cmmcwebring/index.html");
  assert.match(snippet, /https:\/\/owner\.github\.io\/cmmcwebring\/go\.html\?site=alpha&amp;dir=previous|site=alpha&dir=previous/);
  assert.match(snippet, /CMMC Webring/);
});
