# Contributor navigation release — 15 October 2026

[PR #93](https://github.com/ancapcloud/ancap/pull/93) by Mohammad Umair (`dcode333`)
was reviewed and merged with the original contributor commit preserved. Nested
pages retain the longest matching navigation section, Discover more reflects its
current section, and current links expose `aria-current` on desktop and mobile.
Shared-prefix routes and in-page anchors do not select an unrelated section.

## Verification

- Current-master integration: 60 frontend tests passed; Next.js production build passed.
- [PR frontend/SDK/browser CI](https://github.com/ancapcloud/ancap/actions/runs/38687784848): 60 frontend tests and 38 browser scenarios passed, one browser scenario skipped; SDK checks passed.
- [CodeQL](https://github.com/ancapcloud/ancap/actions/runs/38687784823) and [secret hygiene](https://github.com/ancapcloud/ancap/actions/runs/38687784844) passed.
- [Deployment](https://github.com/ancapcloud/ancap/actions/runs/38689696361) succeeded for merge `5ac4676ea39f77df1160a43b8d2d06164ae639e9`.
- Production `/internal/frontend-build` reports `5ac4676`; API readiness confirmed PostgreSQL and Redis.
- Read-only browser verification at `/explorer/stats` found Discover more highlighted when collapsed and Explorer marked current when expanded. The same Explorer link was current in the mobile menu at 390px, without horizontal overflow. No captured JavaScript errors. The temporary viewport override was reset.

GitHub private vulnerability reporting was enabled and verified through the API and
the public Security page; `SECURITY.md` links the private reporting entry point.
No vulnerability reports or contributor replies were submitted, and no credentials,
funds, wallet state or unrelated native/bridge/consensus/SACP work were changed.

The documentation-only follow-up does not change the deployed application SHA.
