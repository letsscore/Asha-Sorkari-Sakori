# Asha-Sorkari-Sakori

Standalone competitive-examination preparation platform for Assam.

## Scope

- APSC
- ADRE
- Assam Police
- TET
- Current Affairs
- Government Jobs
- Mock Tests
- Study Resources

## Strict separation

This repository belongs to **Asha-Sorkari-Sakori only**. It must remain completely separate from the **Let's Score** school-education website.

Do not copy or reuse the Let's Score Firebase project, database paths, student records, school dashboards, Class X/XI/XII content, or school-education application logic here.

## Current architecture

```text
Asha-Sorkari-Sakori/
├── index.html
├── exams.html
├── exam-details.html
├── mock-tests.html
├── test.html
├── result.html
├── current-affairs.html
├── jobs.html
├── job-details.html
├── study.html
├── questions.html
├── login.html
├── register.html
├── dashboard.html
├── admin/
│   ├── index.html
│   ├── users.html
│   ├── tests.html
│   ├── questions.html
│   └── jobs.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── auth-pages.js
│   ├── data.js
│   ├── firebase-config.js
│   ├── firebase.js
│   └── ui.js
├── firebase-rtdb.rules.json
└── .nojekyll
```

## Firebase

The public/static part of the site works without Firebase.

The Firebase layer is intentionally **lazy-loaded** so a missing/unavailable Firebase project cannot blank the public homepage.

Before enabling student accounts, live tests, result storage, jobs and admin data, create a **new Firebase project dedicated only to Asha-Sorkari-Sakori** and replace the placeholders in `js/firebase-config.js`.

Never use the Let's Score Firebase project for this website.

## Development order

1. Verify the static homepage and navigation.
2. Connect the dedicated Firebase project.
3. Enable Email/Password Authentication.
4. Configure Realtime Database and deploy the rules.
5. Add real exam/test/question data.
6. Add secure admin authorization before exposing management functions.
7. Add current-affairs and government-job publishing workflows.
