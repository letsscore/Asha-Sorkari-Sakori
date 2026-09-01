ASHA SORKARI SAKORI — V7 DEPLOYMENT FIX

Problem fixed:
The previously uploaded free-foundation.html was a static HTML page. It did not load
js/free-foundation.js or js/free-foundation-data.js, so the 50-question practice sets
and 30-question mocks could not appear.

This package keeps the secured v6 Firebase/auth/owner-bureau system and changes only
the Free Foundation entry page. Direct visits to free-foundation.html are routed to:
course.html?id=free-foundation
which is the existing live course engine in js/app.js.

Important:
1. Upload the CONTENTS of this ZIP to the root of the SAME GitHub Pages repository.
2. Replace existing files when GitHub asks.
3. Do NOT upload the ZIP itself into the repository.
4. Firebase configuration/rules are not changed by this fix.
5. After GitHub Pages deploys, open the site in a private/incognito tab or hard-refresh.

Expected result:
Free Foundation -> account/enrolment check -> live module interface ->
General Knowledge / Aptitude / Reasoning / English -> Basic Notes ->
50 Practice Questions -> 30-question Mock -> saved results/activity.
