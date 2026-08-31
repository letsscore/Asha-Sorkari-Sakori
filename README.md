# Asha Sorkari Sakori

Asha Sorkari Sakori is a standalone competitive-exam preparation website. It is intentionally separate from any school-education platform.

## Included
- Free foundation course (registration + enrolment required)
- Premium exam-specific courses
- Aspirant registration/login/logout
- Password reset
- Aspirant dashboard
- UPI payment QR + UTR verification workflow
- Owner Aspirant Data Bureau
- Purchase approval/revocation and premium access control
- Mock tests and saved results
- Current affairs
- Recent government job vacancies
- Study resources
- About, Contact and Privacy pages

## Firebase
Use the existing Firebase project `asha-sorkari-sakori`.

Authentication: Email/Password must be enabled.

Realtime Database URL:
`https://asha-sorkari-sakori-default-rtdb.firebaseio.com/`

Publish `firebase-rtdb.rules.json` in Realtime Database → Rules.

### Owner admin setup
1. Create/login to the owner's Firebase Authentication account.
2. Copy the owner's Firebase Auth UID.
3. In Realtime Database, create:

```json
{
  "admins": {
    "OWNER_FIREBASE_UID": true
  }
}
```

Only that UID gets the private owner bureau and protected admin writes.

## Courses
The website has local fallback course definitions in `js/data.js`. If the Firebase `courses` node exists, its records are merged over the local definitions. This keeps the public catalogue usable while allowing the owner to manage course records in Firebase.

## Payments
The UPI payment address is stored only in JavaScript configuration and is not rendered as visible text. Premium purchase pages generate a UPI QR with the course amount. Aspirants submit their UTR/reference after payment. Premium access is activated only after owner verification.

Never ask aspirants for UPI PIN, OTP, card PIN or banking passwords.

## v4 owner bureau & performance notes

- Public Firebase reads use a short session cache to reduce repeated loading on navigation.
- A service worker caches the local site shell for faster repeat visits on GitHub Pages.
- Internal navigation shows immediate progress feedback so page transitions feel responsive.
- Logout is no longer blocked on activity logging; activity logging is best-effort while sign-out proceeds.
- The authenticated owner now gets an **Owner Console** link automatically in the site navigation after Firebase verifies the `admins/{uid}` flag.
- The owner bureau includes a manual Refresh action and direct navigation to Aspirant Database, Tests and Jobs.
- The owner console remains protected by Firebase Realtime Database rules; hiding the link is not used as security.
- Premium checkout no longer launches a `upi://pay` intent directly. This avoids the security/intent rejection shown by some UPI apps.
- Checkout displays a course-and-amount UPI QR. The UPI address is not printed on the aspirant-facing page.
- QR generation is loaded only on the payment page. A bundled QR image exists as a fallback, so checkout does not depend on a third-party QR image service.
- Aspirants still submit their UTR/reference after payment. Premium access remains manual-owner approval.
