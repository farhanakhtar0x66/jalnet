# JalNet

> Know your water before it becomes a problem.

JalNet is a planned map-first water intelligence app. It turns citizen evidence into local incidents and checks whether those incidents affect the places and routes people depend on.

**Current state: planning only.** The repository contains the implementation specification, an audit, a dependency analysis and a tracked backlog. No mobile app, backend, AWS infrastructure or live integration has been implemented or verified. Repository publication was explicitly authorized before START; application implementation still awaits explicit START and confirmation that the official hackathon clock permits it.

## Planning documents

- [Primary implementation plan](JalNet_Implementation_Plan.md) — the supplied specification, preserved unchanged; numbered sections 0–100, including the final addendum.
- [Implementation status](docs/IMPLEMENTATION_STATUS.md) — P0 requirements, dependency graph, audit evidence and future verification criteria.
- [Decisions](docs/DECISIONS.md) — architecture choices, specification conflicts and unresolved contracts.
- [Blockers](docs/BLOCKERS.md) — authorization, toolchain, account and device prerequisites.
- [TODO](TODO.md) — phased working checklist.

The implementation plan defines the product. Explicit user instructions govern authorization and supersede earlier planning restrictions where stated. The publication request authorizes this documentation repository; it does not authorize application development or resource provisioning.

## Core workflow to build

```text
Open real map
  → Capture real water issue
  → Upload privately to S3
  → Obtain a live, validated Nova assessment
  → Human confirms or manually classifies
  → Create/fuse an incident
  → Refresh the map
  → Intersect a persisted saved route
  → Show a route warning
  → Award droplets for accepted usefulness
```

This complete loop has priority over every secondary feature. AI proposes conservative visual observations; it does not establish truth or exact water depth. Incident verification is separate from model confidence, and route warnings must not guarantee road safety.

## Intended architecture

| Area | Planned stack |
|---|---|
| Mobile | React Native, Expo development build, TypeScript |
| Maps | MapLibre React Native, Amazon Location dynamic maps |
| State and contracts | TanStack Query, Zustand, shared Zod schemas |
| Authentication | Cognito and API Gateway authorizer |
| Backend | API Gateway HTTP API, TypeScript Lambda |
| Persistence and spatial lookup | DynamoDB, H3, exact distance/intersection checks |
| Evidence | Private encrypted S3 and owned short-lived presigned uploads |
| Media analysis | Amazon Bedrock/Nova with configurable model/inference profile |
| Infrastructure | AWS CDK TypeScript; one infrastructure framework |

Map assets load directly from Amazon Location with a restricted, expiring client map key. Private JalNet APIs use Cognito. Routes are calculated through the backend. Package versions, model access and real integration behavior still need verification.

## Implementation and verification

After START, prove the risky dependencies first: development build on the target phone, map, foreground location, authenticated API, DynamoDB write/read, private phone-to-S3 upload, live Nova image assessment and real route calculation. Then implement the core in phases and run appropriate formatting, lint, typecheck, tests, infrastructure synth and device checks at each milestone.

There are currently no install, run, build, deploy, seed or reset commands. Those commands will be documented after they exist and have actually been executed. Markdown validation verifies only these planning artifacts; it does not establish product completion.

## Scope and disclosures

Water Stress, My Water, TankerOS, IoT, official-source ingestion, video, push, alternative routing, HeatSafe and background route learning remain deferred until P0 is reliable. Any future simulated tank data, demo suppliers or seeded incidents must be visibly labeled. The P0 map, upload, analysis, fusion, persistence and route logic must remain real.

No credentials, private report media, real user routes, supplier integrations or production datasets are included. A prototype media-retention policy must be defined before storing real evidence. See the plan and decisions for privacy boundaries and uncertainty wording.

## Hackathon and acknowledgements

Target: WeMakeDevs × AWS Environmental Hacks, Heat and Water track, October 8–11, 2026. Exact kickoff/deadline hours must be checked against the [official schedule](https://www.wemakedevs.org/aws/env/schedule). The [official rules](https://www.wemakedevs.org/aws/env/rules) govern eligibility, build timing and submission.

The source specification was supplied by the project owner. OpenAI Codex assisted with specification review, the workspace audit, planning documents and repository preparation. No application code has been generated. An open-source license has not yet been selected; licensing and dependency/data attribution remain TODO items.
