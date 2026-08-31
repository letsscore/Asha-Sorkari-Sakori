# Asha-Sorkari-Sakori

Standalone competitive-examination preparation website.

## Scope
APSC • ADRE • Assam Police • TET • Mock Tests • Current Affairs • Government Jobs • Study Resources • Student Authentication • Results • Admin panels.

## Strict separation
This repository is ONLY for **Asha-Sorkari-Sakori** and competitive examinations. It must not be mixed with the Let's Score school-education website.

## Setup
1. Create/use a Firebase project dedicated to Asha-Sorkari-Sakori.
2. Enable Email/Password Authentication and Realtime Database.
3. Put that project's web configuration in `js/firebase-config.js`.
4. Apply `firebase-rtdb.rules.json`.
5. Deploy to GitHub Pages.

## Database
`users/{uid}`, `tests/{testId}`, `results/{resultId}`, `jobs/{jobId}`, `currentAffairs/{postId}`, `study/{resourceId}`.

The demo tests in `js/data.js` allow the test interface to be checked before database tests are added.
