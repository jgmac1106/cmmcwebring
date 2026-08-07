import { readFile } from "node:fs/promises";

import { validateSites } from "../assets/ring.js";

const registryUrl = new URL("../sites.json", import.meta.url);

try {
  const raw = JSON.parse(await readFile(registryUrl, "utf8"));
  const sites = validateSites(raw);
  console.log(`Registry is valid: ${sites.length} ${sites.length === 1 ? "site" : "sites"}.`);
} catch (error) {
  console.error(`Registry validation failed: ${error.message}`);
  process.exitCode = 1;
}
