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

## Important Firebase Rules deployment

The website files and the Firebase database rules must match. After uploading this website, publish the included `firebase-rtdb.rules.json` in the **Asha Sorkari Sakori** Firebase Realtime Database → Rules. Do not use the Let's Score school-education Firebase project.

**Security:** Use `admin/login.html` for owner authentication. Only the UID stored under `/admins/<UID>` with value `true` can open the owner bureau. Publishing the included RTDB rules is mandatory; the static admin URL alone does not grant database access.

The login flow deliberately treats `lastLogin` and activity logging as non-blocking bookkeeping. A successful Firebase Authentication login will therefore not be reported as a failed login merely because an optional database write is temporarily denied while rules are being updated.

## Owner deletion controls (v5.1)
- The Owner Console now has a **Delete user** action in the full Aspirant Database.
- Deleting an aspirant removes their Realtime Database profile, purchases, results, activity log and premium course-access records, and creates a `/deletedUsers/<UID>` tombstone so the same Firebase Authentication account is blocked from signing into the website again.
- The owner account itself cannot be deleted from the console.
- The Recruitment/Jobs owner page now has a **Delete** action for every published vacancy. Removing a vacancy removes it from the public jobs listing immediately.

### Important limitation of a static GitHub Pages website
Firebase Authentication user accounts cannot be deleted by a browser-only client using the normal Firebase Web SDK. The v5.1 owner delete action therefore deletes all website data and blocks the account at application level, but the underlying Firebase Authentication user remains in Firebase Authentication. If permanent Auth-user deletion is required, it must be performed from Firebase Authentication or through a trusted server/Cloud Function using the Firebase Admin SDK.

After updating this version, publish the included `firebase-rtdb.rules.json` again. The rules now allow the owner to create deletion tombstones and remove activity records belonging to an aspirant while keeping aspirant activity creation restricted to the signed-in aspirant.
