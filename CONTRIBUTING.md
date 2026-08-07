# Contributing to the CMMC Webring

Small corrections and accessibility improvements are welcome through pull requests. Membership is
handled through the “Join the CMMC Webring” issue form so each application has a public review trail.

## Add an approved member

1. Review the applicant against the criteria in `join.html`.
2. Choose a stable, lowercase ID containing only letters, numbers, and hyphens.
3. Add the member to `sites.json`. The order in this file is the order of the ring.
4. Run `npm run check`.
5. Give the member the HTML generated from the directory page.
6. Verify that the navigation is present on the member’s site before merging.

Do not silently change an existing member ID. The ID is embedded in that member’s navigation and is
intended to remain stable even if the site name or URL changes.

## Removing or pausing a site

Do not remove a member because of one failed uptime check. Contact the owner when possible and use
human judgment. A long-term outage, abandoned domain, malicious redirect, or repeated violation of
the membership criteria is grounds for removal.
