# Week 1 — Product Discovery and Initial Backlog

## Evidence status

This is an **individual product proposal and POC backlog**. Replace this statement only after the group explicitly agrees to use CareerTrack NT.

## Product vision

CareerTrack NT helps a job seeker keep application details, stages and follow-up dates in one dependable place. It reduces missed follow-ups and the confusion caused by scattered notes or spreadsheets.

## Capabilities

1. Capture an application.
2. View and search applications.
3. Track progress through application stages.
4. Plan follow-up action.
5. Summarise the pipeline.
6. Correct or remove records.

## Business processes at three levels

### Level 1 — end-to-end value stream

```text
Discover role -> Record opportunity -> Apply -> Follow up -> Interview/decision -> Close and learn
```

### Level 2 — manage an application

```text
Capture details -> Validate details -> Save application -> Monitor due follow-up
-> Update stage -> Review outcome
```

### Level 3 — capture and validate details

```text
User opens form
  -> enters company, role, dates, URL and notes
  -> system validates required fields and date relationships
  -> [valid] system stores record and confirms success
  -> [invalid] system identifies fields and preserves entered values for correction
```

## Relationship between BA artefacts

```text
Business problem
  -> capabilities describe what outcomes are needed
  -> processes show how work creates those outcomes
  -> personas explain whose needs and constraints matter
  -> user stories express small pieces of value
  -> requirements and rules remove ambiguity
  -> mock-ups expose interaction questions
  -> acceptance criteria and tests prove the result
```

## Personas

### Persona P-01 — Maris, active job seeker

- Goal: manage several Technical Business Analyst applications without missing follow-ups.
- Behaviour: applies from a laptop and checks status quickly on a phone.
- Needs: fast entry, visible stages, search and date reminders.
- Frustrations: duplicate notes, unclear last action and spreadsheets that are hard to use on mobile.

### Persona P-02 — Career mentor

- Goal: help a job seeker identify progress and improve application strategy.
- Behaviour: reviews a summary during a scheduled conversation.
- Needs: concise counts and non-sensitive status information.
- Constraint: this POC has no multi-user sharing; the job seeker controls what is shown.

## Initial user stories and acceptance criteria

### US-01 — create application (Must)

As a job seeker, I want to record an application so that I can track it consistently.

- Given valid company, role, status and dates, when I submit, then the application is saved and displayed.
- Given invalid data, when I submit, then clear field errors appear and no record is saved.
- Leading/trailing spaces do not create dirty company or role values.

### US-02 — view and filter (Must)

As a job seeker, I want to search and filter applications so that I can find relevant records quickly.

- Status filtering returns only the selected stage.
- Search matches company or role without requiring exact case.
- An empty result displays guidance rather than a blank screen.

### US-03 — update progress (Must)

As a job seeker, I want to update a stage so that the tracker reflects the current outcome.

- Editing loads the current values.
- A valid update persists and is visible after refresh.
- An unknown record returns a not-found response.

### US-04 — delete incorrect record (Should)

As a job seeker, I want to delete an incorrect record so that the tracker remains accurate.

- The interface asks for confirmation.
- Cancellation leaves the record unchanged.
- Confirmation deletes it and announces success.

### US-05 — see pipeline summary (Should)

As a job seeker, I want stage counts so that I can understand my pipeline.

- The summary shows total records and counts by stage.
- A zero state is represented accurately.
- Counts update after create, update or delete.

### US-06 — reminders (Could/future)

As a job seeker, I want reminders for due follow-ups so that I act on time.

This is out of scope until notification channel, consent, privacy and scheduling requirements are agreed.

## Validation rules

| ID | Field/rule | Requirement |
|---|---|---|
| VR-01 | Company | Required; trim whitespace; 2–100 characters |
| VR-02 | Role | Required; trim whitespace; 2–120 characters |
| VR-03 | Status | Allow only Wishlist, Applied, Interview, Offer, Rejected or Withdrawn |
| VR-04 | Application date | Required except Wishlist; ISO date; not in future |
| VR-05 | Follow-up date | Optional; valid ISO date; not before application date |
| VR-06 | Job URL | Optional; HTTPS only; maximum 500 characters |
| VR-07 | Notes | Optional; trim whitespace; maximum 1,000 characters; render as text |
| VR-08 | List page size | 1–100 to prevent unbounded retrieval |

## Low-fidelity screen mock-up

```text
+-------------------------------------------------------------------+
| CareerTrack NT                         [Total 8] [Interview 2]      |
+-------------------------------------------------------------------+
| Add / edit application                                            |
| Company* [________________]   Role* [________________________]      |
| Status*  [Applied v]          Applied [yyyy-mm-dd]                 |
| Follow-up [yyyy-mm-dd]        Job URL [https://_____________]      |
| Notes [____________________________________________________]       |
| [Save application] [Cancel edit]                                  |
+-------------------------------------------------------------------+
| Search [____________________]  Status [All v] [Apply filters]      |
+-------------------------------------------------------------------+
| Company       Role             Status       Follow-up   Actions    |
| Acme          BA               Interview    2026-08-25  Edit Delete|
+-------------------------------------------------------------------+
| Showing 1–20 of 24                          [Previous] [Next]       |
+-------------------------------------------------------------------+
```

Accessibility annotations:

- Visible labels remain present above/beside every field.
- Keyboard focus follows the visual order.
- Status is written as text, not communicated by colour alone.
- Save/error changes use a polite/assertive live region.
- Delete requires confirmation and returns focus appropriately.

## Backlog refinement process

1. Review the product goal and new evidence.
2. Confirm the story has user value and a clear owner/persona.
3. Discuss rules, dependencies, risks and non-functional needs.
4. Split stories that cannot be completed and tested in one iteration.
5. Add observable acceptance criteria and link designs/processes.
6. Estimate with the team's agreed method.
7. Prioritise by value, risk and dependency—not by who requested loudest.
8. Mark ready only when the team understands it; unresolved questions remain visible.

### Definition of Ready used for this draft

- [ ] User and value are clear.
- [ ] Acceptance criteria are testable.
- [ ] Validation and error cases are known.
- [ ] Dependencies and privacy implications are identified.
- [ ] Mock-up/API contract is linked if relevant.
- [ ] Small enough for one iteration.

## Initial prioritised backlog

| Priority | Item | Dependency | Evidence of done |
|---:|---|---|---|
| 1 | US-01 create application | Data model and VR-01–07 | API/UI success plus negative tests |
| 2 | US-02 list/filter | Stored applications | Bounded result and empty state |
| 3 | US-03 update | US-01 | Persisted edit and 404 case |
| 4 | US-04 delete | US-02 | Confirmation and deletion test |
| 5 | US-05 summary | US-01 | Correct counts without per-row queries |
| 6 | US-06 reminders | Identity/notification decisions | Deferred; not implemented |

## Questions for the group

- Is CareerTrack NT the shared product or only Maris's individual POC?
- Which persona and workflow should be validated with real participants?
- Does the group require authentication in the current iteration?
- What data is safe to demonstrate during recorded meetings?
- Which backlog tool and Definition of Done will the team use?
