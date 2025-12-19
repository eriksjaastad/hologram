# 🔍 Hologram Roadmap Review: Round 2 (Feasibility & Gaps)

**Role:** Hard-nosed Engineering Manager & Product Lead  
**Reviewed By:** Gemini 3 Flash Preview  
**Review Date:** December 18, 2025  
**Status:** ROUND 2 STRATEGIC FEASIBILITY REVIEW  
**Filename:** `gemini-3-flash-preview-review-v2.md`

---

## 1. The Verdict: **CONDITIONAL PASS** ⚠️

The architecture is world-class, but the execution plan has a "Foundational Gap." We are promising a **Local-First, Secure, Living Artifact**, but the current sequencing builds the "Living" part (Visualizer) and the "Artifact" part (Window) while pushing the "Local-First Resilience" (Offline) and "Secure" (Permission Layer) to later phases or even post-launch.

**To move to a FULL PASS, you must reorder Phase 1 to include the Security Layer and Offline Resilience.**

---

## 2. The "Offline Mode" Decision: **MOVE TO PHASE 1**

As a "Local-First" app, an internet outage should be a **graceful degradation**, not a total failure.

*   **Decision:** Move **Basic Offline Resilience** to Phase 1, Week 3-4.
*   **Minimum Viable Offline (v1.0):**
    *   **Visualizer:** Must run entirely locally (no CDN dependencies). *Already added to Roadmap, good.*
    *   **Network Detection:** Use `navigator.onLine` and an Electron-side ping check.
    *   **State UI:** Visualizer should have an "Offline" state (e.g., Slow Gray pulse or "Searching for Signal" animation).
    *   **History Access:** Users must be able to read past conversations while offline.
    *   **Action Queueing:** *Postpone to v1.1.* For v1.0, simply disable the input and show an "Offline" warning.

---

## 3. Validation of Round 1 Additions (GPU & Performance)

The Phase 4 monitoring tasks are good but "Hand-Wavy." A "Hard-nosed EM" needs metrics, not just "monitoring."

*   **Missing Metric:** **VRAM vs. System RAM.** Electron apps are notorious for RAM bloat; Three.js apps are notorious for VRAM leaks.
*   **Actionable Task Refinement:**
    *   **VRAM Tracking:** Implement resource count tracking (textures, geometries, shaders). Use `renderer.info` from Three.js to monitor active programs and memory.
    *   **Context Loss Handling:** Add a handler for `webglcontextlost`. If the GPU crashes (common in Electron with high-vibrancy windows), the app must auto-recover or alert the user.
    *   **Adaptive Performance:** If FPS drops below 30 for > 5 seconds, auto-trigger "Power Saver Mode" (reduce particle count by 50%).

---

## 4. Phase Sequencing & Dependencies: **FOUNDATION FIRST**

We are building the "Roof" (Orchestrator) before the "Walls" (Security Layer).

*   **The Conflict:** Phase 1 builds the Orchestrator, but Phase 2 builds the Security Layer. 
*   **The Risk:** If we build an Orchestrator that can dispatch actions before we have a permission system, we are creating a security nightmare that will be hard to retroactively "plug."
*   **The Recommendation:**
    *   **Phase 1 Revision:** Rename to "Foundation, Security & Offline Resilience."
    *   **New Sequence:** Window (W1-2) -> Security Layer & Offline Detection (W3) -> Visualizer & Orchestrator Stub (W4).
    *   The Security Layer must be the *gatekeeper* through which the Orchestrator speaks.

---

## 5. Scope Realism: The "24-Week Ship" Cut List

36 weeks is a fair estimate for a "Perfect" v1.0, but in this market, 9 months is an eternity. If we need to ship in **24 weeks (6 months)**, we must be ruthless.

### **The Cut List (Move to v1.1):**
1.  **Phase 6: MCP Integration.** *Cut entirely.* Build the *interface* for skills, but don't implement the full protocol yet.
2.  **Phase 7: Skin System (Community/Marketplace).** *Cut.* Ship with 2-3 hardcoded skins (Cortana, Minimal, Wizard).
3.  **Phase 8: Cortana Special Integration.** *Cut.* Treat Cortana as a standard custom API connection for v1.0. No special "Memory View" UI until v1.1.
4.  **Phase 5: Extreme Sonique Aesthetic.** *Reduce.* Ship with basic non-rectangular windows, but skip the "kinetic menu animations" and "fishbowl layout" complexity.

---

## 6. Implementation Clarity: Refined Task List

Several tasks in the roadmap are too vague for a developer to estimate accurately.

### **Refinement 1: "Optimize particle rendering" (Phase 4)**
*   **Instead use:** "Implement **THREE.InstancedMesh** for particles to reduce draw calls to 1. Move breathing animation to a **GPU Vertex Shader** to keep Main Thread free for AI processing."

### **Refinement 2: "Build Router layer" (Phase 1)**
*   **Instead use:** "Create an **Intent Classifier Service** using basic keyword/Regex matching (Phase 1) that routes strings to either `ChatOrchestrator` or `ActionController`. Ensure the router supports **Middleware** for the Security Layer."

### **Refinement 3: "Implement Orchestrator class" (Phase 1)**
*   **Instead use:** "Create a **Singleton Orchestrator** that manages the 'Persona Context.' It must inject the `system_prompt` from the active skin's JSON into every request and handle the **Response Stream Normalization** (SSE -> Unified JSON)."

---

## 7. Unintended Consequences (Security & Bloat)

*   **Logging Risk:** Sanitized logging is great, but "Crash recovery auto-save" (P2) is a security risk. If the app crashes during a sensitive conversation, is that history stored in plaintext? 
    *   **Fix:** Ensure `history.json` is stored in the app's secure data directory with file permissions restricted to the current user.
*   **Performance Bloat:** Continuous Visualizer + Electron Vibrancy + AI Streaming = High GPU/CPU.
    *   **Fix:** Ensure the visualizer "sleeps" (stops rendering) if the window is hidden/minimized.

---

## Final Verdict: **CONDITIONAL PASS**
**Move Offline Mode and Security Layer to Phase 1, refine the GPU metrics, and we are ready to code.**

