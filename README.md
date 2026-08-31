# Asha Sorkari Sakori

Asha Sorkari Sakori is a **standalone competitive-examination preparation platform for Assam aspirants**.

## Scope

This website is intentionally separate from any school-education / Let's Score platform. It contains only competitive-exam features:

- APSC
- ADRE
- Assam Police recruitment
- TET
- Free Foundation course with limited topics
- Paid premium courses with unlimited topic coverage and additional resources
- Mock tests and saved results
- Current affairs
- Recent government vacancy / recruitment updates
- Aspirant accounts and preparation history
- Private owner/admin Aspirant Data Bureau

## Course access model

Registration/login is mandatory for **both free and paid courses**.

- Free course: student creates an account, then explicitly enrols in the Free Foundation course.
- Paid course: student creates an account, submits UPI transaction/reference details, and receives access after owner verification.

## Aspirant Data Bureau

The private `/admin/` area shows:

- total registered aspirants
- target examination interest
- free-course enrolments
- premium purchase requests
- course-wise demand
- transaction/reference IDs
- pending / approved / revoked payments
- approved revenue
- test submissions
- registered aspirant list with course activity

Admin access is controlled by the Firebase Realtime Database `admins/{uid} = true` flag.

## Firebase

The existing Asha Sorkari Sakori Firebase project is used. The current web config and RTDB URL are in `js/firebase-config.js`.

The existing RTDB rules are designed so that:

- public exam/test/job/current-affairs/course catalog data can be read
- an authenticated aspirant can read only their own private user data
- an authenticated aspirant can create their own purchase request/result
- only an admin can read the complete aspirant/purchase bureau and approve premium access
- course content is restricted for paid courses unless `courseAccess/{uid}/{courseId} = true`

## Setup before launch

1. Firebase Authentication → Email/Password must be enabled.
2. Add the owner's Firebase Auth UID to RTDB as `admins/{UID}: true`.
3. Replace `ADD-YOUR-UPI-ID-HERE` in `js/data.js` with the platform's actual UPI ID.
4. Import `firebase-seed.json` only if the catalog/content nodes need initial data.
5. Publish the repository through GitHub Pages.

## Vacancy updates

Government vacancy information is stored under the RTDB `jobs` node. The admin side can review published vacancy records; the aspirant-facing Jobs page displays published records with status, post count, publication date, last date and official apply link when supplied.

Do not place school-course data, school student records, Class X/XI/XII course structures, or a school teacher-control system in this project.
