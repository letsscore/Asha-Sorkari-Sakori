V10 CATEGORY NAVIGATION FIX

Root cause fixed:
The category IDs used by the UI (gk, ap, re, en) did not match the top-level
keys in FREE_FOUNDATION (GK, Aptitude, Reasoning, English). The previous
version correctly validated IDs but later attempted FREE_FOUNDATION[current],
which returned undefined and stopped rendering the selected category.

V10 consistently resolves categories through CATEGORY_BY_ID[current].
Firebase configuration and rules were not changed.
