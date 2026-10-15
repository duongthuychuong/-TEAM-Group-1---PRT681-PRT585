# Week 4 — Security, Identity and BA Handover

## 1. Security requirements for CareerTrack NT

### Context and decision

The current proof-of-concept is an unauthenticated local learning application. It must not be publicly deployed or store resumes, credentials or real sensitive notes. Authentication is a future design decision, not an invisible assumption.

### Trust boundaries and assets

| Boundary/asset | Main threats | Required control |
|---|---|---|
| Browser form to API | Tampering, oversized input, script content | Server validation, length limits, 64 KB body cap, text rendering |
| Solution to data store | Injection, corrupt state | Parameterised access and transactions where multi-step consistency is needed |
| Application records | Disclosure or unauthorised changes | Local-only now; identity/authorisation required before shared deployment |
| Logs/errors | Information disclosure | Generic external errors; do not log sensitive content |
| Dependencies/runtime | Vulnerable component | Minimal dependencies, documented supported versions and audit/update process |

### Non-functional security requirements

- SEC-01: All request data is validated on the server even when browser validation exists.
- SEC-02: Database queries use parameter binding; user input is never concatenated into SQL.
- SEC-03: User-provided content is rendered as text, never executable HTML.
- SEC-04: Responses include CSP, frame, MIME, referrer and permissions protections.
- SEC-05: List size and request body size are bounded.
- SEC-06: Unexpected errors return a generic message without stack traces or SQL details.
- SEC-07: No credentials, tokens, real resumes or `.env` files are committed.
- SEC-08: Public/shared deployment is prohibited until authentication, authorisation, privacy and secure hosting requirements are approved and tested.

## 2. Public/private key concepts

Asymmetric cryptography uses a related key pair. A public key may be distributed; the private key must remain controlled by its owner. Data encrypted for confidentiality with the public key is decrypted with the private key, while digital signatures are created with the private key and verified with the public key. Real protocols combine asymmetric cryptography with symmetric encryption and certificate trust rather than encrypting entire applications directly with a key pair.

Common uses include TLS certificates, SSH authentication and signed software. A BA should state the business objective—confidentiality, integrity, authenticity or non-repudiation—rather than writing an imprecise requirement such as “use encryption.”

## 3. Active Directory, authentication and authorisation

Active Directory Domain Services is Microsoft's directory service for identities, groups, computers and policies in a Windows domain. A domain controller validates credentials using protocols such as Kerberos (normally preferred) or NTLM in compatible scenarios. After authentication establishes identity, applications and operating systems use group membership, roles and access-control rules to authorise actions.

Authentication answers **who are you?** Authorisation answers **what are you allowed to do?** Identity management covers the wider lifecycle: creation, proofing, provisioning, role changes, access review, federation and de-provisioning.

### Identity-management approaches

| Approach | Best fit | Key concerns |
|---|---|---|
| Local application accounts | Small standalone service | Password security, recovery, MFA and lifecycle burden |
| Enterprise directory/AD | Managed organisational workforce | Domain/network design, group governance and legacy protocols |
| Cloud identity/Entra ID | Cloud/hybrid workforce and SaaS | Tenant configuration, conditional access, federation and licensing |
| Social identity/OAuth/OIDC | Consumer convenience | Provider dependency, account linking and privacy |
| SAML federation | Enterprise single sign-on | Metadata/certificate lifecycle and role mapping |
| Managed identity service | Teams avoiding custom auth | Vendor risk, cost, data location and configuration |

## 4. Authentication option analysis

Common solution options are:

1. **No identity** — suitable for public content/local prototypes, not protected personal records.
2. **Individual application accounts** — solves app-specific sign-up/sign-in but adds password, recovery and account-lifecycle responsibilities.
3. **Organisation/work accounts** — supports enterprise single sign-on and central identity policy.
4. **Integrated workstation/domain identity** — suitable for managed intranet environments, not general public users.

The group must choose based on users, deployment environment, data sensitivity and support responsibilities—not because one option is easiest in the wizard.

## 5. Authorisation model proposal for a future shared version

| Role | Allowed capability |
|---|---|
| Job seeker | Create/read/update/delete only their own applications |
| Mentor | Read explicitly shared, minimised application information |
| Administrator | Operate service configuration; no routine access to private notes |

Required abuse-case tests include changing another user's ID, guessing identifiers, replaying expired sessions and accessing mentor views after sharing is revoked.

## 6. Final BA handover checklist

- [x] Product vision, capabilities and process levels documented.
- [x] Personas, stories, acceptance criteria and validation rules drafted.
- [x] Functional and non-functional requirements catalogued.
- [x] Low-fidelity mock-up created.
- [x] Traceability and UAT cases prepared.
- [x] Security/identity requirements and scope boundary documented.
- [ ] Group product decision confirmed in Teams.
- [ ] Stakeholder/user validation performed and findings recorded.
- [ ] UAT actual results completed.
- [ ] Backlog entered in the group's chosen tool and assigned.
- [ ] Presentation delivered and questions/actions recorded.
- [ ] Timesheet and meeting evidence entered from actual activity.

## 7. Reflection prompts for Maris

Complete these in your own words after the group work:

1. Which assumption changed after stakeholder or peer feedback?
2. Which BA artefact created the most useful discussion, and why?
3. Where did technical knowledge improve requirement feasibility?
4. Which requirement remains least certain?
5. What would you do differently in the next iteration?
