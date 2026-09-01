ASHA SORKARI SAKORI — FREE FOUNDATION V6

Integrated into the secured v5 website without changing the existing Firebase project/configuration.

Free Foundation:
- Registration/login remains mandatory.
- Existing free enrollment is used.
- Four categories: General Knowledge, Aptitude, Reasoning, English.
- Each category: 5 basic-note topics, exactly 50 practice MCQs, exactly 30-question timed mock.
- Practice options are shuffled at runtime to reduce answer-position predictability.
- Mock options are shuffled at runtime.
- Mock results are saved under the existing users/{uid}/results and results branches.
- Learning/practice/mock/category activity is logged through the existing activity system for the owner bureau.
- Premium course flow remains separate and unchanged.

Firebase changes:
- No new Firebase setup is required for this integration.
- Existing v5 rules already permit authenticated aspirants to save their own results and activity records.

Deployment:
- Upload the contents of this ZIP to the same GitHub Pages repository used by the current Asha Sorkari Sakori site.
