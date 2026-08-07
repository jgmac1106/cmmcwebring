import { destinationFor, validateSites } from "./ring.js";

const status = document.querySelector("#redirect-status");

async function redirect() {
  try {
    const parameters = new URLSearchParams(window.location.search);
    const siteId = parameters.get("site");
    const direction = parameters.get("dir") ?? "random";

    const response = await fetch("sites.json", { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`The registry returned ${response.status}.`);
    }

    const sites = validateSites(await response.json());
    const destination = destinationFor(sites, siteId, direction);
    status.textContent = `Next stop: ${destination.name}`;
    window.location.replace(destination.url);
  } catch (error) {
    status.className = "error";
    status.textContent = `We could not find that route. ${error.message}`;
  }
}

redirect();
