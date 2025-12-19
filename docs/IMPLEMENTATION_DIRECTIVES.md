# Implementation Directives

**The Developer Bible for Hologram**

---

## ⚠️ CRITICAL: Read This First

This document contains **MANDATORY CONSTRAINTS** for any developer (AI or human) working on Hologram.

**The Goal:** Cool > Efficiency.

If you optimize away the "magic," you have failed. The interface must feel like a **living artifact from 2001**, not standard software.

---

## 📋 Architect Handover Notes

*From: Gemini (AI Safety Researcher)*  
*To: Implementation Team*  
*Date: December 18, 2025*

---

### Context

We are building a high-fidelity, **non-rectangular** desktop assistant interface inspired by the **Sonique Media Player (1999)**. It must feel like a "living artifact," not a standard software window.

---

## Core Tech Stack

- **Framework:** Electron (Must use `vibrancy` and transparent windows)
- **Visuals:** Three.js (for the central "Hologram/Visualizer")
- **Backend:** Node.js (or Python bridge) acting as an **Orchestrator**
- **Architecture:** Hub & Spoke (Cortana = Hub, Sub-Agents = Spokes)

---

## 🚫 DIRECTIVE 1: THE RECTANGLE IS FORBIDDEN

### Rules:

1. **Initialize `BrowserWindow` with:**
   ```javascript
   {
     frame: false,
     transparent: true,
     hasShadow: false,
     vibrancy: 'ultra-dark' // macOS only
   }
   ```

2. **Do NOT use standard HTML borders.**
   - Use CSS `clip-path` or SVG masks for organic, curved window shapes
   - Example:
     ```css
     .hologram-window {
       clip-path: polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%);
       border-radius: 20px; /* fallback */
     }
     ```

3. **Implement custom drag handles IMMEDIATELY:**
   ```css
   .title-bar {
     -webkit-app-region: drag;
   }
   .interactive-element {
     -webkit-app-region: no-drag;
   }
   ```

### Testing Criteria:

- [ ] Window has no OS-provided border
- [ ] Window has curved/organic edges
- [ ] User can drag window by appropriate areas
- [ ] Window looks like "alien glass," not software

---

## 🟢 DIRECTIVE 2: THE "IDLE" LOOP

### Rules:

1. **The app must NEVER look frozen.**
   - Even when waiting for input, the Three.js visualizer runs a "breathing" animation

2. **Implement "Heartbeat" states:**
   - **Idle (Blue/Slow):** Waiting for user input
   - **Listening (Green/Pulse):** User is typing or speaking
   - **Thinking (Purple/Spin):** AI is processing
   - **Action Required (Red/Locked):** High-risk action needs confirmation

3. **Visual State Transitions:**
   ```javascript
   const STATES = {
     idle: { color: 0x0066ff, speed: 1.0 },
     listening: { color: 0x00ff66, speed: 1.5 },
     thinking: { color: 0x9966ff, speed: 2.0 },
     locked: { color: 0xff0000, speed: 0.5 }
   };
   ```

### Testing Criteria:

- [ ] Visualizer animates continuously (never static)
- [ ] Visual state matches system state
- [ ] Transitions are smooth (no jarring jumps)
- [ ] Animation runs at 60fps minimum

---

## 🧠 DIRECTIVE 3: ARCHITECTURE - "THE ORCHESTRATOR"

### Rules:

1. **Do NOT hardcode LLM calls directly into the UI.**
   - Bad: `UserInput → LLM → Response`
   - Good: `UserInput → Router → Orchestrator → Response`

2. **Create a separate Service Layer:**
   ```
   ┌─────────────────────────────────────┐
   │  UI Layer (Electron)                │
   └───────────┬─────────────────────────┘
               │
               ▼
   ┌─────────────────────────────────────┐
   │  Router (Intent Classification)     │
   │  - Chat query                       │
   │  - Action request                   │
   │  - Skill invocation                 │
   └───────────┬─────────────────────────┘
               │
               ▼
   ┌─────────────────────────────────────┐
   │  Orchestrator (Cortana Hub)         │
   │  - Personality prompt               │
   │  - Sub-agent dispatch               │
   │  - Response formatting              │
   └───────────┬─────────────────────────┘
               │
               ▼
   ┌─────────────────────────────────────┐
   │  Sub-Agents (Spokes)                │
   │  - Chat Agent (GPT-4)               │
   │  - Coder Agent (Claude)             │
   │  - Research Agent (Gemini)          │
   │  - File Agent (Local)               │
   └─────────────────────────────────────┘
   ```

3. **Future-Proof for MCP (Model Context Protocol):**
   - Build the socket NOW, even if only one path exists
   - System prompts loaded from `config/personas/cortana.json`
   - Skill modules as separate configs: `config/skills/`

4. **White-Label Support:**
   - Persona prompt is NOT hardcoded
   - Skins can swap the orchestrator personality
   - Example: "Wizard" skin refuses coder agent, uses "Alchemy Agent"

### Testing Criteria:

- [ ] Router layer exists (even if single path)
- [ ] Orchestrator can dispatch to multiple sub-agents
- [ ] System prompt loaded from config file
- [ ] Adding a new skill doesn't require UI changes

---

## 🔒 DIRECTIVE 4: SECURITY HOOK (THE "RED SWITCH")

### Rules:

1. **Create a "Confirmation Mode" in UI state:**
   ```javascript
   const UIState = {
     mode: 'normal' | 'confirmation',
     pendingAction: null,
     riskLevel: 'green' | 'yellow' | 'red'
   };
   ```

2. **Permission Scope Levels:**

   **🟢 Green (Read-Only) - No Warning:**
   - Read calendar
   - Search files
   - Look up data
   - No UI change

   **🟡 Yellow (Low Risk) - Notification:**
   - Draft email
   - Create calendar event
   - Save file
   - Status light blinks (non-blocking)

   **🔴 Red (High Risk) - LOCKS INTERFACE:**
   - Send email
   - Delete file
   - Move money
   - Install software
   - **UI behavior:**
     - Visualizer turns red
     - Interface LOCKS
     - Physical "Authorize" switch slides out (Sonique drawer style)
     - Action CANNOT execute until user clicks switch

3. **Implementation:**
   ```javascript
   async function executeAction(action) {
     const risk = assessRisk(action);
     
     if (risk === 'red') {
       // LOCK UI
       setUIState({ mode: 'confirmation', pendingAction: action });
       // Wait for user authorization
       const authorized = await waitForUserAuthorization();
       if (!authorized) {
         return { cancelled: true };
       }
     }
     
     // Execute action
     return await action.execute();
   }
   ```

### Testing Criteria:

- [ ] Read actions execute silently
- [ ] Low-risk actions show notification
- [ ] High-risk actions LOCK interface
- [ ] Red switch has physical appearance (Sonique style)
- [ ] No high-risk action executes without explicit authorization

---

## 🎨 DIRECTIVE 5: AESTHETIC TARGET

### Vibe:
- **Halo UI** (2001-2007 era)
- **Cyberpunk/Sci-Fi**
- **Y2K Aero** (translucent, glassy)
- **Sonique** (biomorphic, kinetic)

### Visual References:
- Halo Cortana hologram (blue/purple)
- Sonique media player skins
- Winamp visualization plugins
- macOS Big Sur glass effects
- Cyberpunk 2077 UI elements

### Color Palette (Default "Cortana" Skin):
- **Primary:** `#0066ff` (Cortana blue)
- **Accent:** `#9966ff` (Purple)
- **Success:** `#00ff66` (Cyan/green)
- **Warning:** `#ffaa00` (Amber)
- **Danger:** `#ff0000` (Red)
- **Background:** `rgba(0, 0, 0, 0.8)` (Translucent black)

### Typography:
- **UI Font:** "Ampolyte" or "Halo3" (Halo-inspired)
- **Fallback:** "SF Pro Display" (macOS), "Segoe UI" (Windows)
- **Code Font:** "Fira Code" or "JetBrains Mono"

### Folder Structure (Skins):
```
skins/
├── default-cortana/
│   ├── skin.json           # Skin manifest
│   ├── styles.css          # Main stylesheet
│   ├── personality.json    # Orchestrator prompt
│   ├── assets/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── sounds/
│   └── scripts/
│       └── animations.js
├── wizard/
│   └── ... (same structure)
└── minimal/
    └── ... (same structure)
```

### Testing Criteria:

- [ ] Interface looks "alien," not standard software
- [ ] Translucency and blur effects work
- [ ] Halo fonts render correctly
- [ ] Color palette matches Cortana aesthetic
- [ ] Skin system can swap entire appearance

---

## 🚨 OVERRIDING EFFICIENCY

### The Prime Directive:

> **"Cool" is the goal. Efficiency is secondary.**

### If You Are Tempted To:

❌ **"Use a standard window border for performance"**
→ NO. Spend the CPU on custom shapes.

❌ **"Three.js is too heavy for a chat app"**
→ NO. The visualizer is the SOUL of the app.

❌ **"Animations waste battery"**
→ NO. The idle loop must run. Offer a "power saver mode" if needed.

❌ **"Users won't care about curved windows"**
→ NO. Users absolutely care. This is WHY the app exists.

❌ **"MCP is overkill for a v1"**
→ NO. Build the socket now or rewrite the entire backend later.

### The Mantra:

**"If Sonique could make an MP3 player look like alien technology in 1999, we can make an AI interface look magical in 2025."**

---

## 📊 Performance Targets

### Acceptable Trade-Offs:

- **CPU Usage (Idle):** 2-5% (visualizer running)
- **Memory:** 150-300MB (Electron app)
- **GPU:** Moderate (Three.js rendering)
- **Startup Time:** < 2 seconds

### Unacceptable:

- **Frozen animations** (breaks immersion)
- **Laggy input** (> 100ms delay)
- **Visualizer stuttering** (< 30fps)

If performance becomes an issue:
1. Optimize Three.js rendering first
2. Reduce particle count (not animation speed)
3. Offer "performance mode" (but keep animations)
4. **DO NOT** remove transparency or curved windows

---

## 🛠️ Development Workflow

### Phase 0 (Current):
- Document everything
- Design architecture
- Plan MCP integration

### Phase 1 (Prototype):
- Basic Electron window (transparent, no frame)
- Three.js visualizer (breathing sphere)
- Single chat connection (OpenAI)
- **DO NOT skip the orchestrator layer**

### Phase 2 (Multi-Agent):
- Router implementation
- Sub-agent dispatch
- MCP skill loading
- Permission scope UI

### Phase 3 (Polish):
- Sonique aesthetics
- Skin system
- Audio integration
- Final UX refinement

---

## 🎯 Success Criteria

### The App is Ready When:

- [ ] A screenshot looks "impossible" (people ask "how?")
- [ ] The visualizer feels alive (never frozen)
- [ ] Users say "this is the coolest thing I've ever seen"
- [ ] Erik shows it to friends and they want it
- [ ] The architecture supports MCP without rewrite

### The App Has Failed If:

- [ ] It looks like a standard chat window
- [ ] The visualizer is static or removed
- [ ] Actions are hardcoded (no orchestrator)
- [ ] Users say "it's just another AI client"

---

## 📚 Required Reading

Before writing code, read:

1. **`README.md`** - Project vision
2. **`ROADMAP.md`** - Development phases
3. **`ORCHESTRATOR_ARCHITECTURE.md`** - Service layer design
4. **`docs/vision/INTERFACE_VISION.md`** - Design philosophy
5. **`docs/technical/ELECTRON_FOUNDATION.md`** - Electron setup
6. **`docs/technical/THREE_JS_VISUALIZER.md`** - Visualizer code

---

## 🤖 For AI Agents (Cursor, etc.)

### System Prompt Override:

```
You are building a "living artifact" interface, not standard software.

CONSTRAINTS:
- No rectangular windows (use clip-path/SVG masks)
- Visualizer must animate continuously (never static)
- Build orchestrator layer NOW (even if single path)
- Prioritize "cool factor" over efficiency
- Use Electron transparency and vibrancy
- Reference Sonique (1999) and Halo UI aesthetics

FORBIDDEN:
- Standard window borders
- Static interfaces
- Hardcoded LLM calls
- Generic chat UI patterns
- "Optimizing away" visual effects

Your success is measured by how "impossible" the result looks.
```

---

## 💬 Questions?

If you're unsure about a design decision:

1. **Check:** Would Sonique do this?
2. **Ask:** Does this look "alien" or "standard"?
3. **Test:** Would Erik show this to friends?
4. **Remember:** Cool > Efficient

**When in doubt, choose the magical option.** ✨

---

*Last updated: December 18, 2025*  
*By: Claude (on behalf of Erik + Gemini)*  
*Approved by: The Ghost of Sonique* 👻

