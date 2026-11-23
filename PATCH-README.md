# Portfolio Development Patch 2

Incremental update for the project after applying `rouf-portfolio-development-patch.zip`.

## Included
- Search on public project, experience and certification listings.
- Project category filter and result counts.
- Project preview images using the existing `imageUrl` field.
- Admin portfolio search and type filter.
- Admin inbox search and status filter, plus reply-by-email links.
- Route-aware browser titles and dynamic meta descriptions.
- Backend validation restricting profile, social, project and image URLs to HTTP/HTTPS.
- Safe external-link rendering in the frontend.
- Featured portfolio entries are prioritized in public results.
- Short-lived cache headers for public profile and portfolio data.
- Responsive styling and visible keyboard focus states.

## Apply
1. Back up the working project and ensure `git status` is clean or commit your current work.
2. Extract this ZIP into the existing project root, preserving folder paths.
3. Do not replace `.env`, `backend/.env`, or any credential file.
4. Restart backend and frontend development servers.
5. Manually verify public search/category filter, admin filters, project images, external links and page titles.

No database reset or migration is required. Existing MongoDB documents remain compatible.
