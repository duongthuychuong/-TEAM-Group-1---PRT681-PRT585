# Week 2 — Requirements, BABOK Notes and BA Toolkit

## 1. Requirements catalogue

### Business requirements

| ID | Requirement | Measure |
|---|---|---|
| BR-01 | Improve visibility of active job applications | User can locate an application by company, role or stage in one search/filter flow |
| BR-02 | Reduce missed follow-ups | Every application may hold a validated follow-up date; reminder delivery remains future scope |
| BR-03 | Maintain trustworthy application records | Invalid state is rejected and changes persist consistently |

### Functional requirements

| ID | Requirement | Priority | Source story |
|---|---|---:|---|
| FR-01 | Create an application record | Must | US-01 |
| FR-02 | List records with bounded pagination | Must | US-02 |
| FR-03 | Search company and role text | Must | US-02 |
| FR-04 | Filter by approved status | Must | US-02 |
| FR-05 | Retrieve a record by identifier | Must | US-03 |
| FR-06 | Update an existing record | Must | US-03 |
| FR-07 | Delete an existing record after UI confirmation | Should | US-04 |
| FR-08 | Return total and per-stage counts | Should | US-05 |

### Non-functional requirements

| ID | Category | Requirement and acceptance measure |
|---|---|---|
| NFR-01 | Security | All external input is server-validated; SQL is parameterised; browser rendering uses text, not injected HTML |
| NFR-02 | Privacy | POC stores no account credentials, resumes or real sensitive notes; it is local-only until authentication is designed |
| NFR-03 | Accessibility | Semantic controls, visible labels/focus, keyboard operation, status text and live announcements support WCAG 2.1 AA practices |
| NFR-04 | Performance | List endpoint retrieves at most 100 records per request; summary uses aggregate queries rather than N+1 requests |
| NFR-05 | Reliability | Invalid input returns a stable error format without partial writes; automated tests cover key rules |
| NFR-06 | Maintainability | Presentation, application and data concerns remain separate and public commands are documented |

## 2. Grooming examples

### FR-01 refinement outcome

Before: “User can add a job.”

After: “A job seeker can save a validated application with company, role, stage, relevant dates, optional HTTPS URL and notes. The system trims text, rejects invalid date relationships and returns field-level errors without writing a row.”

Ready evidence: user story, VR-01–07, API request/response, mock-up and tests are linked.

### US-06 reminder decision

The reminder story is not ready. It introduces identity, notification channel, consent, timezone, retry and privacy questions. It remains `Could/future` rather than being hidden inside the first release.

## 3. BABOK key-topic notes

BABOK is a professional body-of-knowledge framework, not a single mandatory project method. Its knowledge areas help a BA choose and connect analysis work.

### Business Analysis Planning and Monitoring

Decide the analysis approach, stakeholders, governance, information management and improvement method. For CareerTrack NT, this includes identifying the job seeker as product owner, recording open decisions and defining when stories are ready/done.

### Elicitation and Collaboration

Prepare for, conduct and confirm elicitation while maintaining stakeholder collaboration. Techniques include interviews, observation, workshops, document analysis and prototypes. A wireframe walkthrough should produce confirmed needs and unresolved questions, not just visual opinions.

### Requirements Life Cycle Management

Trace, maintain, prioritise, assess and approve requirements throughout change. The traceability matrix connects business need through test results. A changed date rule should reveal which stories, endpoints and UAT cases are affected.

### Strategy Analysis

Understand current state, future state, risks and change strategy. The current state is fragmented notes/spreadsheets; the proposed state is a validated tracker. Risks include privacy, inaccurate status, notification scope and using an unauthenticated prototype beyond local learning.

### Requirements Analysis and Design Definition

Specify and model requirements, verify quality, validate value, evaluate solution options and recommend a design. BPMN, data models, stories, rules and wireframes express different views of the same need. Verification asks whether a requirement is well formed; validation asks whether it solves the right problem.

### Solution Evaluation

Measure solution performance, analyse limitations and recommend actions that increase value. CareerTrack NT UAT and usability review assess whether users can record/find/update applications and understand errors. A future reminder is considered only if evidence shows missed follow-ups remain a real limitation.

### BACCM concepts

| Concept | CareerTrack NT example |
|---|---|
| Change | Move from scattered records to a structured tracker |
| Need | Avoid lost context and missed follow-ups |
| Solution | Local validated web application |
| Stakeholder | Job seeker; mentor as a secondary stakeholder |
| Value | Faster retrieval and more dependable follow-up planning |
| Context | Individual job search, privacy constraints, learning environment |

## 4. BA techniques and tools

| Technique/tool | Best used for | CareerTrack NT sample |
|---|---|---|
| Stakeholder map | Influence, interest and engagement planning | Job seeker = high interest/high decision authority |
| Interview | Detailed motivations, exceptions and terminology | Ask how follow-up is currently remembered |
| Observation/contextual inquiry | Actual workflow rather than recalled workflow | Observe application recording immediately after submission |
| Workshop | Resolve cross-functional ambiguity efficiently | Agree statuses and validation rules with BA/dev/test roles |
| BPMN | Current/future workflow and decisions | Valid versus invalid capture flow |
| User story | Negotiable unit of user value | US-02 search/filter |
| Use case | Detailed actor/system interaction and alternatives | Create application with validation failure path |
| Business rule table | Precise constraints and outcomes | VR-01–08 |
| Data model | Entities, attributes and relationships | Application record fields and unique ID |
| Wireframe | Early interaction/content validation | Form plus filterable table |
| Decision log | Preserve why choices were made | Local-only POC due to no authentication |
| Traceability matrix | Coverage and change impact | BR -> FR -> story -> endpoint -> UAT |
| SWOT | Strategic option discussion | Useful for product direction; not detailed requirements |
| MoSCoW | Relative scope priority | CRUD must; summary should; reminders could |
| Jira | Backlog and workflow tracking | Stories, defects, acceptance criteria and status |
| Confluence | Durable team knowledge | Glossary, decisions, workshop notes and diagrams |
| Visio/Draw.io | Process and architecture diagrams | BPMN and three-tier diagrams |
| Figma | Collaborative wireframes/prototypes | Responsive form and list flow |

## 5. Presentation outline

1. Problem and personas — 2 minutes.
2. Three process levels and future-state flow — 3 minutes.
3. Stories, requirements and validation rules — 4 minutes.
4. Mock-up and traceability — 3 minutes.
5. Open decisions/risks — 2 minutes.
6. Invite feedback and record actions — 1 minute.

Presentation delivery and group feedback must be entered only after the session occurs.
