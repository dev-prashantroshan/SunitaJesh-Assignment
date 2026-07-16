# Project Decisions

Each decision lists the reason, trade-off, and what could change in production.

| Decision | Reason | Trade-off | Production change |
| --- | --- | --- | --- |
| Node.js | Fits MERN assessment and JavaScript ecosystem. | Single runtime may not suit every team. | Keep or split services by domain. |
| Express | Simple and readable routing. | Fewer built-in conventions than larger frameworks. | Add stricter request schemas and observability. |
| TypeScript | Reduces shape mistakes across API and UI. | More setup than plain JavaScript. | Keep with stricter linting. |
| MongoDB | Flexible document data for steps, journeys, and runs. | Relational reporting is less direct. | Add indexes and aggregation strategy. |
| Mongoose | Familiar schema layer and validators. | Adds ORM-like abstraction. | Keep or move to native driver for specialized performance. |
| React | Common frontend choice for assessment. | Needs state/design discipline. | Add tests and accessibility checks. |
| Vite | Fast local builds and simple setup. | Preview script differs from typical dev server here. | Use standard dev server for active development. |
| React Router | Clear route mapping. | Client routes require proper hosting fallback. | Configure production rewrite rules. |
| CSS Modules | Scoped styles without extra library. | Shared theme needs discipline. | Add design system if app grows. |
| Plus Jakarta Sans | Matches supplied mobile design. | External font dependency. | Self-host font for production. |
| Lucide React | Lightweight icons. | Not every Figma icon is exact. | Replace with custom exported icons where needed. |
| No Redux | Page state is local and simple. | Shared state would grow awkward later. | Add React Query or state manager if data grows. |
| No authentication | Out of assignment scope. | Not production-secure. | Add auth provider and protected routes. |
| `x-device-id` | Simple sample identity. | Header can be spoofed. | Replace with authenticated user id. |
| Controller/service/model separation | Easy for junior MERN developers to follow. | Not a full enterprise architecture. | Add request schemas and domain modules if needed. |
| Embedded route coordinates | Simple run-route retrieval. | Large routes could bloat documents. | Store route points separately or in object storage. |
| Separate JourneyFavorite model | Avoids mutating journey documents per device. | Requires extra lookup. | Add indexes and user-based favorites. |
| Idempotent favorite/unfavorite | Better mobile retry behavior. | Duplicate calls do not signal conflict. | Keep idempotency. |
| Steps 4 and 8 single-select | Matches written requirements. | Figma helper text sometimes differed. | Keep product requirements as source of truth. |
| Step 6 details optional | User can select Yes without being forced to type. | Less medical context. | Add required reason only if product needs it. |
| Step 6 clears details when No selected | Prevents stale sensitive data. | Requires explicit unset in MongoDB. | Keep this privacy behavior. |
| External content normalized | UI receives stable shape. | Source content is generic. | Replace with real content service. |
| In-memory cache | Simple, no Redis dependency. | Cache resets on restart and is per instance. | Use Redis or CDN cache. |
| Static map assets | Matches design without map SDK complexity. | Not interactive or geographically exact. | Add Mapbox, Google Maps, or Leaflet. |
| Presentation-only values | Keeps scope focused on requested APIs. | Some UI values are not persisted. | Add user profile and habit models. |
| Separate test database | Prevents development data loss. | Requires env setup. | Use isolated CI database or containers. |
| 7 focused integration tests | Covers highest-risk behavior without over-testing. | Not exhaustive. | Add frontend and contract tests. |
| Postman included | Helps evaluators test manually. | Manual tests can drift. | Add collection tests and CI. |
| Docker as bonus | Not required and not implemented. | Manual setup needed. | Add Dockerfile and Compose later. |
| 375 x 812 target | Matches provided mobile Figma. | Desktop is not redesigned. | Add responsive layouts if product expands. |
| Reusable components | Avoids duplicate onboarding UI. | Some page-specific styling remains. | Extract a fuller design system later. |
