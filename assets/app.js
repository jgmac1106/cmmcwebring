import { memberSnippet, validateSites } from "./ring.js";

const directory = document.querySelector("#directory");
const memberCount = document.querySelector("#member-count");
const memberCode = document.querySelector("#member-code");
const copyButton = document.querySelector("#copy-code");
const copyStatus = document.querySelector("#copy-status");

let currentSnippet = "";

function externalLink(href, text) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = text;
  link.rel = "noreferrer";
  return link;
}

function selectMember(site) {
  currentSnippet = memberSnippet(site.id, window.location.href);
  memberCode.textContent = currentSnippet;
  copyButton.disabled = false;
  copyStatus.textContent = `Navigation generated for ${site.name}.`;
  memberCode.closest("section").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderMember(site) {
  const card = document.createElement("article");
  card.className = "member-card";

  const title = document.createElement("h3");
  title.append(externalLink(site.url, site.name));

  const description = document.createElement("p");
  description.textContent = site.description;

  const topics = document.createElement("p");
  topics.className = "topics";
  topics.textContent = site.topics.map((topic) => `#${topic.replaceAll(" ", "-")}`).join("  ");

  const actions = document.createElement("div");
  actions.className = "member-actions";
  actions.append(externalLink(site.feed, "RSS feed"));

  const codeButton = document.createElement("button");
  codeButton.type = "button";
  codeButton.className = "text-button";
  codeButton.textContent = "Get ring HTML";
  codeButton.addEventListener("click", () => selectMember(site));
  actions.append(codeButton);

  card.append(title, description, topics, actions);
  return card;
}

async function loadDirectory() {
  try {
    const response = await fetch("sites.json", { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`The registry returned ${response.status}.`);
    }

    const sites = validateSites(await response.json());
    directory.replaceChildren(...sites.map(renderMember));
    memberCount.textContent = `${sites.length} ${sites.length === 1 ? "member" : "members"}`;
  } catch (error) {
    const message = document.createElement("p");
    message.className = "error";
    message.textContent = `The member directory could not be loaded. ${error.message}`;
    directory.replaceChildren(message);
    memberCount.textContent = "Unavailable";
  }
}

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(currentSnippet);
    copyStatus.textContent = "Copied to the clipboard.";
  } catch {
    copyStatus.textContent = "Clipboard access was blocked. Select and copy the code above.";
  }
});

loadDirectory();
