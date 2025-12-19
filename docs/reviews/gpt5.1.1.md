# GPT 5.1 Codex max review — Hologram

## 1) Strategic Overview
- Hologram as hub: local-first AI OS that reuses proven patterns—trading guardrails for Red/Yellow/Green risk gating, Cortana’s persona+memory spine for consistent orchestration, Hypocrisy Now’s offline-first + sandbox discipline, and image-workflow’s GPU-safe pipelines for the Three.js visualizer.
- Trust stance: “No account. No cloud. No telemetry.” Keys in OS keychain; signed builds with published checksums; direct provider calls (no relays).
- UX stance: Sonique-inspired, non-rectangular, always-alive visualizer; orchestrator from day one so sub-agents remain swappable without UI rewrites.

## 2) Revised Roadmap (2-week sprints, eng hours)
Estimates anchor to prior work (Trading integration ~30h, Cortana UI shells ~40h, Hypocrisy queues ~40h, image-workflow safety ~40h).

- **Sprint 0 (Phase 0 wrap, 30–40h)**  
  Finalize security checklist integration, repo/npm/Electron bootstrap, skin manifest draft, advisor feedback loop.

- **Sprint 1 (Phase 1 Wk1-2, 45–55h)**  
  Frameless/vibrant window, drag regions, menu bar + global hotkey, strict CSP (no remote assets), router skeleton + state store, resize/jank tests, “no network calls” assertion.

- **Sprint 2 (Phase 1 Wk3-4, 50–60h)**  
  Three.js breathing sphere integrated (bundled libs, no CDN), state driver (Idle/Listening/Thinking/Locked), chat stub, persona load from config, idle loop never stops, perf baseline (fps + memory).

- **Sprint 3 (Phase 2 Wk5-6, 45–55h)**  
  OS keychain (keytar), masked key UI, OpenAI adapter with SSE streaming, logging audit for key leaks, retry/backoff + circuit breaker for stream stability.

- **Sprint 4 (Phase 2 Wk7-8, 55–70h)**  
  Security layer (risk assessor), Permission UI, Red Switch lock/authorize flow, panic button, stream UI polish, chaos tests for error paths.

- **Sprint 5 (Phase 3 Wk9-10, 55–65h)**  
  Connection Manager + BaseAdapter, OpenAI refactor, Anthropic adapter, profile CRUD UI, connection switcher, first sub-agent (Coder, Claude).

- **Sprint 6 (Phase 3 Wk11-12, 60–75h)**  
  Custom/Cortana adapter, File Agent (allowlisted writes), Web Agent (read-only), conversation history manager, multi-agent workflow/fallbacks, File Agent sandbox tests.

Flagged risk: Visual polish (Phases 4–5) and MCP/skin community (Phases 6–7) need separate design/security tracks; Cortana adapter depends on backend readiness.

## 3) Technical Recommendations (borrowed patterns)
- **Red Switch / permissioning:** Use Trading Guardrail Extension’s “block until condition” flow for high-risk (send/delete/install) actions—UI lock + explicit auth before execution.
- **Reliability & latency:** Trading middleware pattern—per-adapter retry/backoff, timeout budgets, circuit breaker, and pre-warmed adapter instances to cut cold starts.
- **Key handling:** Hypocrisy Now Phase 0 key discipline + trading `.env.example` separation; keys only in OS keychain, never in logs; release checksums published.
- **Persona & memory:** Cortana constitution rules (honesty > agreement, evidence + confidence, agency preservation) baked into persona configs and orchestrator formatter; skins remain assets-only + hashed.
- **Offline & censorship resilience:** Hypocrisy Now ingestion queues—hash-dedup, backpressure, DLQ; bundle all assets/fonts (no CDN); explicit offline mode with cached settings.
- **File/GPU safety:** Image-workflow invariants—move-not-modify, companions together, single writer (File Agent) with audit logs; frame-time + memory telemetry for the visualizer to avoid battery/GPU spikes.
- **Streaming UI:** Trading SSE parsing pattern for token streams; expose stream state to visualizer (color/state changes) with graceful reconnection.

## 4) Definition of Done (v1.0 gate)
- **Window/UX:** Frameless transparent window resizes without artifacts; drag on curved edges; hotkey reliable; ≥60fps visualizer; no remote assets; CSP enforced.
- **Visualizer:** Never static; state-linked animation/color; libs bundled locally; 60m soak shows <5% memory drift; perf budget recorded.
- **Security:** Keys only in OS keychain; zero key/log leakage under chaos tests; permission system enforces Green/Yellow/Red with Red lock; panic button wipes keys/profiles; release signed/notarized with SHA-256 published.
- **Networking:** All provider calls direct; retry/backoff + circuit breaker; offline mode degrades gracefully (UI + visualizer live, cached settings load).
- **Adapters:** OpenAI/Anthropic/Google/Custom validate; connection switching without restart; BaseAdapter contract shared; Coder sub-agent dispatched via orchestrator.
- **File Agent:** Writes only inside allowlists; logs every op; move-not-modify rule; refuses out-of-scope actions per risk level.
- **Orchestrator/Router:** Routes chat/action/skill intents; risk assessment invoked for actions; persona load from config; multi-agent workflows with fallback and confidence surfaced.
- **Docs & Trust:** Security & Privacy page published; all network calls documented; changelog + checksums shipped; “No account. No cloud. No telemetry.” verified in build.
- **Testing:** Automated smoke for window lifecycle, SSE stream, permission lock, keychain CRUD, adapter happy/failure paths, 60m memory-leak soak, file-agent sandbox tests.

## 5) Gap Detection
- Visualizer sample imports Three.js from CDN—must bundle locally to honor “no remote assets.”
- No GPU/battery budget yet—add frame-time + power telemetry and a perf ceiling (e.g., <8ms/frame on M-series) early.
- Streaming/backoff policy unspecified—lift trading retry/circuit-breaker defaults to avoid UI stalls on SSE hiccups.
- File Agent constraints undefined—import image-workflow rules (single writer, move-not-modify, companions together, audit logs).
- No DLQ/backpressure for multi-agent orchestration—reuse Hypocrisy Now ingestion queue + DLQ model.
- Skin/skill safety: enforce assets-only + hash verification; sandbox skills; explicit permission prompts; no code in skins.

