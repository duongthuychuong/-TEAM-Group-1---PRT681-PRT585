# Week 3 — Traceability, UAT and Usability

## 1. Requirements traceability matrix

| Business requirement | Functional/NFR | Story | Solution behaviour | Verification evidence | UAT case |
|---|---|---|---|---|---|
| BR-01 visibility | FR-02, FR-03, FR-04, NFR-04 | US-02 | `GET /api/applications`; search/status controls; pagination | API list/filter tests | UAT-02 |
| BR-02 follow-up | FR-01, FR-06 | US-01, US-03 | Application/follow-up date fields and validation | Date-rule and create/update verification | UAT-01, UAT-03 |
| BR-03 trustworthy records | FR-01, FR-05–07, NFR-01, NFR-05 | US-01, US-03, US-04 | Validated CRUD routes; error region; confirmation | Validation, 404 and delete tests | UAT-01, UAT-03, UAT-04 |
| BR-01 visibility | FR-08, NFR-04 | US-05 | `GET /api/summary`; summary display | Summary integration test | UAT-05 |
| Cross-cutting | NFR-02 | All | Local-only boundary; no resumes/auth data | Repository privacy review | UAT-06 |
| Cross-cutting | NFR-03 | All UI stories | Labels, headings, keyboard controls, live regions | Manual accessibility checklist | UAT-07 |

Traceability status uses three outcomes:

- Implemented and passed: code exists and evidence passes.
- Implemented, manual verification pending: code exists but human/browser check remains.
- Deferred: not in the release; reason and dependency are visible.

## 2. UAT approach

Objective: confirm that a representative job seeker can maintain application records accurately and understand system feedback.

Environment: local machine with fictional data only.  
Tester: Maris or a consenting group member.  
Entry criteria: automated tests pass; application starts; no real personal data is loaded.  
Exit criteria: all Must scenarios pass; no unresolved high-impact privacy or data-integrity defect.

### UAT cases

| ID | Scenario and steps | Expected result | Actual result/date/evidence |
|---|---|---|---|
| UAT-01 | Enter valid company, role, Applied status, today/past application date; save | Record appears; success is announced; values are trimmed | To be executed by tester |
| UAT-02 | Search part of company/role and filter one status | Only matching rows appear; total/page information remains clear | To be executed by tester |
| UAT-03 | Edit a record and change stage to Interview | Updated stage persists after refresh; summary changes | To be executed by tester |
| UAT-04 | Choose delete, cancel once, then confirm | Cancel preserves record; confirmation removes it and announces success | To be executed by tester |
| UAT-05 | Create records in different stages and view summary | Total and stage counts equal stored records | To be executed by tester |
| UAT-06 | Inspect shared repository/runtime data | No real resume, credentials or sensitive application notes are stored | To be executed by reviewer |
| UAT-07 | Navigate using keyboard at 320px and desktop width | Logical focus order, visible focus, readable layout and no keyboard trap | To be executed by tester |

Do not change “To be executed” to Passed unless the scenario is actually run and evidence is recorded.

## 3. Usability test script

Prompt: “Imagine you applied for a Technical Business Analyst role yesterday and want to follow up next week. Add it, find it again, change it to Interview, then remove it.”

Observe without coaching:

- Does the participant know where to begin?
- Do labels and stage terms match their language?
- Can they understand and recover from a deliberately invalid follow-up date?
- Do they notice confirmation/success messages?
- Can they complete the flow on keyboard/mobile width?

Post-task questions:

1. What did you expect at each step?
2. Which field or message was unclear?
3. What information is missing or unnecessary?
4. What would make you trust the tracker with real data?
5. Would reminders provide enough value to justify notification/privacy complexity?

## 4. Accessibility review checklist

- [ ] One descriptive page title and one `h1`; headings do not skip levels.
- [ ] Skip link reaches main content.
- [ ] Every input has a visible associated label.
- [ ] Required fields are identified with text, not colour alone.
- [ ] Validation errors name the field and are announced.
- [ ] Native buttons, links, select and dialog/confirmation patterns are used.
- [ ] Focus indicator is visible and order is logical.
- [ ] Touch targets are approximately 44 by 44 pixels on mobile.
- [ ] Table has header cells; mobile layout does not require unreadable zoom.
- [ ] Empty, loading, success and error states are meaningful.
- [ ] Content remains usable at 200% zoom and 320px width.

## 5. Defect and improvement log template

| ID | Observation | Requirement affected | Severity | Decision/owner | Status |
|---|---|---|---|---|---|
| Example | Error summary is not focused after invalid submit | NFR-03 | Medium | Assess after manual keyboard test | Open example — not an observed defect |

## 6. Solution evaluation measures

| Measure | Baseline | Target | Collection method |
|---|---|---|---|
| Time to find a known application | To be measured in current method | Under 30 seconds | Timed usability task |
| Valid task completion | To be measured | 4 core tasks completed without facilitator help | UAT observation |
| Invalid records stored | Unknown | Zero in tested rules | Negative tests plus data review |
| Missed follow-ups | Requires longitudinal evidence | Improvement to be agreed | User diary; reminder feature not assumed |

The product cannot claim business value until baseline and outcome evidence are actually collected.
