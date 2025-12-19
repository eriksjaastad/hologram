# 🏗️ Hologram Master Architect Review

**Role:** Chief Technical Architect & Product Lead  
**Reviewed By:** Claude Opus 4.5 (claude-opus-4-5-20250514)  
**Review Date:** December 18, 2025  
**Status:** STRATEGIC REVIEW COMPLETE  
**Filename:** `OPUS_4.5_REVIEW.md`

---

## Executive Summary

After comprehensive analysis of Erik's project ecosystem (Trading Projects, Cortana Personal AI, Hypocrisy Now, Image Workflow, Agent OS), this review provides:

1. **Strategic positioning** of Hologram within the existing project architecture
2. **Concrete cross-pollination** recommendations (code/patterns to steal)
3. **Realistic sprint breakdowns** with time estimates based on past project complexity
4. **Definition of Done** checklists for quality gates

**Critical Finding:** Hologram is not a new project—it's the **UI layer** that unifies at least 3 existing projects:
- **Agent OS** → Runtime/kernel architecture
- **Cortana Personal AI** → Memory/personality backend  
- **Trading Projects** → Risk management patterns

**Recommendation:** Build Hologram as a **thin UI shell** that consumes these battle-tested backends rather than rebuilding from scratch.

---

## 1. Strategic Overview: The Ecosystem Map

### Current Project Relationships

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER LAYER                                     │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    🌟 HOLOGRAM 🌟                                │    │
│  │  (Desktop UI - Electron + Three.js Visualizer)                   │    │
│  │  • Sonique aesthetic                                             │    │
│  │  • Multi-AI connection manager                                   │    │
│  │  • White-label skin system                                       │    │
│  └───────────────┬─────────────────────────────────────────────────┘    │
│                  │                                                       │
└──────────────────┼───────────────────────────────────────────────────────┘
                   │
┌──────────────────┼───────────────────────────────────────────────────────┐
│                  │           ORCHESTRATION LAYER                         │
│  ┌───────────────┴─────────────────────────────────────────────────────┐│
│  │                    AGENT OS (Kernel)                                ││
│  │  ✅ ALREADY BUILT: Workflow engine, retries, idempotency,          ││
│  │                    plugin system, SQLite storage, logging           ││
│  └───────────────┬─────────────────────────────────────────────────────┘│
│                  │                                                       │
└──────────────────┼───────────────────────────────────────────────────────┘
                   │
┌──────────────────┼───────────────────────────────────────────────────────┐
│                  │           SUB-AGENT LAYER (Spokes)                    │
│  ┌───────────────┴─────────────────────────────────────────────────────┐│
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────────┐   ││
│  │  │ CORTANA MEMORY  │  │ TRADING AGENT   │  │ HYPOCRISY ENGINE   │   ││
│  │  │ • 10K+ memories │  │ • Risk rules    │  │ • Contradiction    │   ││
│  │  │ • Safety layers │  │ • API adapters  │  │   detection        │   ││
│  │  │ • 4-tier circuit│  │ • Alerting      │  │ • Fact checking    │   ││
│  │  │   breakers      │  │ • Cost tracking │  │ • Entity resolver  │   ││
│  │  └─────────────────┘  └─────────────────┘  └────────────────────┘   ││
│  │                                                                       ││
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────────┐   ││
│  │  │ IMAGE WORKFLOW  │  │ CODER AGENT     │  │ FILE AGENT         │   ││
│  │  │ • Batch queues  │  │ • Claude API    │  │ • Local ops        │   ││
│  │  │ • File tracking │  │ • Code gen      │  │ • Safe delete      │   ││
│  │  │ • GPU pipeline  │  │ • Review        │  │ • Undo support     │   ││
│  │  └─────────────────┘  └─────────────────┘  └────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Strategic Implications

| Question | Answer |
|----------|--------|
| Where does Hologram fit? | **UI Layer only** - consumes existing backends |
| What's the kernel? | **Agent OS** - already built, use as runtime |
| What's the memory? | **Cortana Personal AI** - already has 10K+ memories |
| What's the safety model? | **Cortana's 4-layer architecture** - port directly |
| What's the risk model? | **Trading Project's risk rules** - adapt for actions |

---

## 2. Cross-Pollination Analysis: What to Steal

### From Agent OS: Kernel Architecture

**Location:** `/Users/eriksjaastad/projects/agent_os/`

**What to Port:**

1. **Database Context Manager** (steal verbatim)
   ```python
   # From: agent_os/core/db.py
   @contextmanager
   def get_db():
       conn = sqlite3.connect(DB_PATH)
       conn.row_factory = sqlite3.Row
       conn.execute("PRAGMA foreign_keys = ON")
       try:
           yield conn
       finally:
           conn.close()
   ```
   - Port to: `hologram/src/main/db.js` (Node version)
   - Use for: Connection profiles, conversation history, settings

2. **Plugin Interface Pattern** (adapt to TypeScript)
   ```python
   # From: agent_os/MakeLikeKernel_AgentOS_Blueprint.md
   class StepPlugin:
       name: str
       def run(self, ctx: StepContext, inputs: Dict[str, Any]) -> Dict[str, Any]:
           raise NotImplementedError
   ```
   - Port to: `hologram/src/main/adapters/BaseAdapter.ts`
   - Use for: AI provider adapters (OpenAI, Anthropic, Google)

3. **Idempotency Keys** (critical for actions)
   - Concept from Agent OS: Every action has a unique key
   - Prevents duplicate sends, double-deletes
   - Implement in Security Layer

**Estimated Port Time:** 4-6 hours (mostly translation to TypeScript)

---

### From Cortana Personal AI: Safety Architecture

**Location:** `/Users/eriksjaastad/projects/Cortana personal AI/`

**What to Port:**

1. **4-Layer Safety Architecture** (steal the entire design)

   | Layer | Cortana Implementation | Hologram Adaptation |
   |-------|------------------------|---------------------|
   | Layer 1: Input Validation | Prompt injection detection | Same (use llm-guard) |
   | Layer 2: Output Formatting | Sentiment analysis, confidence labels | Same |
   | Layer 3: Verification | Fact checking, hallucination detection | Simplified (actions only) |
   | Layer 4: Circuit Breakers | Frequency limits, negative spiral detection | Adapt for action frequency |

2. **Circuit Breaker Class** (adapt for action rate limiting)
   ```python
   # From: Cortana - scripts/safety/circuit_breaker.py (planned)
   class CircuitBreaker:
       FREQUENCY_LIMIT = 3  # per topic per 24h
       
       def check_frequency(self, action_type: str) -> Optional[str]:
           count = self._count_recent_actions(action_type, hours=24)
           if count >= self.FREQUENCY_LIMIT:
               return "Rate limit reached"
   ```
   - Port to: `hologram/src/main/security/CircuitBreaker.ts`
   - Use for: Preventing action spam (delete, send, etc.)

3. **Constitution/Persona Pattern** (use for personality)
   ```json
   // From: Cortana - config/cortana_constitution_v2.md
   {
     "name": "Cortana",
     "tone": "brief, military, confident",
     "role": "Chief of Staff",
     "constraints": [
       "Honesty > Helpfulness",
       "Citations required",
       "No psychoanalysis"
     ]
   }
   ```
   - Already planned in: `hologram/config/personas/`
   - Matches existing Cortana design

4. **Data Source Abstraction** (for sub-agent integration)
   ```python
   # From: Cortana - scripts/core/data_source.py
   class DataSourceReader(ABC):
       @abstractmethod
       def get_entries(self, start_date, end_date, limit) -> List[DataEntry]:
           pass
   ```
   - Port to: `hologram/src/main/agents/BaseAgent.ts`
   - Use for: Unified sub-agent interface

**Estimated Port Time:** 8-12 hours (Layer 3 verification can be deferred)

---

### From Trading Projects: Risk Management

**Location:** `/Users/eriksjaastad/projects/Trading Projects/`

**What to Port:**

1. **Risk Classification Pattern**
   - Trading has: Conservative/Moderate/Aggressive
   - Hologram needs: Green/Yellow/Red
   - Same mental model, different domain

2. **API Adapter Pattern** (from `scripts/model_arena.py`)
   - Trading already handles multiple API connections
   - Retry logic with exponential backoff
   - Error classification (retryable vs fatal)

3. **Alerting/Notification Pattern**
   - Discord webhook integration
   - Can reuse for Hologram notifications
   - Pattern: `def send_notification(channel, message, urgency)`

4. **Context Window Management** (from AI Trading Architecture doc)
   ```
   LLMs have memory limits. Alpha Arena bots use Rolling Context:
   only see last N candles + summary of previous week's trend
   ```
   - Apply to: Conversation history management
   - Pattern: Keep last N messages + summarize older context

**Estimated Port Time:** 4-6 hours

---

### From Hypocrisy Now: Database & Privacy

**Location:** `/Users/eriksjaastad/projects/hypocrisynow/`

**What to Port:**

1. **Connection Pooling** (for future multi-user)
   ```python
   # From: hypocrisynow/database/connection.py
   @contextmanager
   def get_db_connection():
       if _PG_POOL is None and get_db_url():
           init_db_pool()
       conn = _PG_POOL.getconn()
       try:
           yield conn
           conn.commit()
       except Exception as e:
           conn.rollback()
           raise e
       finally:
           _PG_POOL.putconn(conn)
   ```
   - Defer to: Post-v1.0 (SQLite is fine for local app)

2. **Entity Resolution Pattern** (for sub-agent selection)
   - Hypocrisy uses: Fuzzy matching + LLM disambiguation
   - Hologram can use: For intent classification
   - Simpler v1: Keyword matching

3. **Offline-First Design Philosophy**
   - Hypocrisy: Works without network
   - Hologram: Must work in offline mode
   - Pattern: Cache last responses, queue actions

**Estimated Port Time:** 2-4 hours (mostly philosophy, not code)

---

### From Image Workflow: Code Quality & Safety

**Location:** `/Users/eriksjaastad/projects/image-workflow/`

**What to Port:**

1. **Code Quality Rules** (CRITICAL - adopt verbatim)
   
   From `Documents/reference/CODE_QUALITY_RULES.md`:
   - Python 3.11 typing (`dict` not `Dict`)
   - Never use bare `except:`
   - Use `pathlib` not `os.path`
   - Logging in libraries, prints only in CLI

2. **File Safety Patterns** (for File Agent)
   - Never modify files in-place
   - Use `send2trash()` for deletions
   - Track all file operations
   - **Critical for Hologram's File Agent**

3. **FileTracker Pattern** (for undo support)
   ```python
   # Concept from image-workflow
   class FileTracker:
       def move_file_with_all_companions(src, dst):
           # Moves PNG + associated YAML/caption files together
           pass
   ```
   - Port to: `hologram/src/main/agents/FileAgent.ts`
   - Use for: Safe file operations with undo

4. **Testing Patterns**
   - Unit tests for utilities
   - Integration tests for pipelines
   - Ruff + mypy for linting

**Estimated Port Time:** 2-4 hours (setup, then ongoing discipline)

---

## 3. Revised Roadmap: Sprint Breakdown

### Realism Assessment

Based on analysis of Erik's past projects:

| Project | Stated Timeline | Actual Duration | Complexity Factor |
|---------|-----------------|-----------------|-------------------|
| Cortana Layer 1 | "Week 1" | 1 day (marathon) | 1x (simple extraction) |
| Cortana Layer 1.5 | "Week 2" | 2 hours | 0.5x (well-scoped) |
| Trading Model Arena | Not specified | 2-3 weeks | 2x (API complexity) |
| Image Workflow tools | Ongoing | 3+ months | 3x (iteration heavy) |
| Agent OS Phase 0 | "Fast" | 1 day | 1x (documentation) |

**Conclusion:** Erik's **documentation phases are fast** (1-2 days), but **implementation phases take 2-3x longer than expected**, especially when:
- External APIs are involved (auth, rate limits, error handling)
- UI work is involved (iteration, polish)
- Novel technology is involved (Three.js, Electron transparency)

---

### Phase 1: Minimal Viable Interface + Orchestrator

**Original Estimate:** 4 weeks  
**Revised Estimate:** 6-8 weeks  
**Reason:** Three.js + Electron transparency is novel territory

#### Sprint 1.1: Electron Foundation (Week 1-2)
**Goal:** Transparent window on screen that drags

| Task | Hours | Risk | Dependencies |
|------|-------|------|--------------|
| Initialize Electron project | 2 | Low | None |
| Configure frameless transparent window | 4 | Medium | macOS-specific vibrancy |
| Custom drag handles (-webkit-app-region) | 2 | Low | None |
| Global hotkey (show/hide) | 2 | Low | electron-hotkey-register |
| Menu bar integration (macOS) | 4 | Medium | electron-tray |
| Basic IPC between main/renderer | 4 | Low | None |
| **Sprint 1.1 Subtotal** | **18h** | | |

**Definition of Done (Sprint 1.1):**
- [ ] `npm start` launches transparent window
- [ ] Window has no OS chrome (title bar, buttons)
- [ ] Window can be dragged by designated area
- [ ] Hotkey shows/hides window
- [ ] Menu bar icon exists (macOS)
- [ ] No external network calls on startup

---

#### Sprint 1.2: Three.js Visualizer (Week 3-4)
**Goal:** Breathing particle sphere that never stops

| Task | Hours | Risk | Dependencies |
|------|-------|------|--------------|
| Set up Three.js in Electron | 4 | Medium | WebGL compatibility |
| Implement particle sphere | 8 | Medium | Shader knowledge |
| "Breathing" idle animation | 4 | Low | requestAnimationFrame |
| State machine (idle/listening/thinking/locked) | 4 | Low | State management |
| Color transitions between states | 4 | Low | Three.js tweening |
| Performance optimization (60fps target) | 6 | High | GPU profiling |
| **Sprint 1.2 Subtotal** | **30h** | | |

**Definition of Done (Sprint 1.2):**
- [ ] Visualizer renders in transparent window
- [ ] Particle sphere "breathes" continuously
- [ ] 4 visual states work (idle/listening/thinking/locked)
- [ ] State transitions are smooth (no jarring jumps)
- [ ] Performance: 60fps sustained, < 5% CPU idle
- [ ] Visualizer works with window transparency

---

#### Sprint 1.3: Minimal Orchestrator + Chat (Week 5-6)
**Goal:** Send message to GPT-4o, get response, display it

| Task | Hours | Risk | Dependencies |
|------|-------|------|--------------|
| Create Router class (intent classification stub) | 4 | Low | None |
| Create Orchestrator class | 6 | Medium | Architecture decisions |
| Load personality from JSON config | 2 | Low | None |
| Implement OpenAI adapter | 6 | Medium | API key handling |
| Basic chat UI (input field + message list) | 8 | Medium | UI design |
| Connect UI → Router → Orchestrator → Adapter | 6 | Medium | IPC |
| SSE streaming (tokens arrive in real-time) | 6 | High | Stream handling |
| **Sprint 1.3 Subtotal** | **38h** | | |

**Definition of Done (Sprint 1.3):**
- [ ] User can type message and send
- [ ] Message goes through Router → Orchestrator → Adapter
- [ ] Response streams token-by-token
- [ ] Visualizer state changes with conversation state
- [ ] Personality loaded from `config/personas/cortana.json`
- [ ] API key stored securely (OS keychain via keytar)

---

#### Sprint 1.4: Integration & Polish (Week 7-8)
**Goal:** Phase 1 milestone complete

| Task | Hours | Risk | Dependencies |
|------|-------|------|--------------|
| End-to-end testing | 8 | Low | All previous |
| Bug fixes from testing | 12 | Medium | Unknown |
| Visualizer sync with chat state | 4 | Low | None |
| Memory leak testing | 4 | Medium | Chrome DevTools |
| Window resize handling | 4 | Low | Electron APIs |
| Error handling (API failures) | 6 | Medium | None |
| Documentation update | 4 | Low | None |
| **Sprint 1.4 Subtotal** | **42h** | | |

**Phase 1 Total: ~128 hours (~3-4 weeks full-time, 6-8 weeks part-time)**

---

### Phase 2: Single AI Connection + Security Layer

**Original Estimate:** 4 weeks  
**Revised Estimate:** 4-5 weeks  
**Reason:** Security layer is well-defined from Cortana

#### Sprint 2.1: Keychain + Key Management (Week 9-10)
**Goal:** Secure API key storage with panic button

| Task | Hours | Risk | Dependencies |
|------|-------|------|--------------|
| Implement keytar wrapper | 4 | Low | keytar npm |
| API key input UI (masked) | 4 | Low | React form |
| Key validation on save | 2 | Low | API test call |
| "Delete all keys" panic button | 2 | Low | keytar.deleteAll |
| Audit all logging (no keys leaked) | 4 | Medium | Code review |
| Settings panel UI | 6 | Medium | UI design |
| **Sprint 2.1 Subtotal** | **22h** | | |

**Definition of Done (Sprint 2.1):**
- [ ] API keys stored in OS keychain (not in file)
- [ ] Keys never appear in logs or console
- [ ] Key input field is masked by default
- [ ] "Delete all keys" button works
- [ ] Settings panel for key management

---

#### Sprint 2.2: Security Layer Implementation (Week 11-12)
**Goal:** Green/Yellow/Red permission system

| Task | Hours | Risk | Dependencies |
|------|-------|------|--------------|
| Risk assessment function | 4 | Low | Action mapping |
| Green (silent execution) | 2 | Low | None |
| Yellow (notification) | 4 | Low | Notification UI |
| Red (lock interface) | 8 | Medium | UI state management |
| "Red Switch" authorization UI | 6 | Medium | Sonique drawer style |
| Security layer integration | 4 | Low | Orchestrator |
| Circuit breaker (frequency limit) | 4 | Low | Port from Cortana |
| **Sprint 2.2 Subtotal** | **32h** | | |

**Definition of Done (Sprint 2.2):**
- [ ] Green actions execute silently
- [ ] Yellow actions show non-blocking notification
- [ ] Red actions LOCK interface
- [ ] Red switch has physical appearance
- [ ] No red action executes without explicit authorization
- [ ] Frequency limits prevent action spam

---

#### Sprint 2.3: Streaming + Error Handling (Week 13)
**Goal:** Robust real-time chat experience

| Task | Hours | Risk | Dependencies |
|------|-------|------|--------------|
| Improve SSE streaming stability | 6 | Medium | Edge cases |
| Token-by-token display | 4 | Low | UI update |
| Error recovery (network failures) | 6 | Medium | Retry logic |
| Loading/thinking indicators | 4 | Low | Visualizer sync |
| Rate limit handling | 4 | Medium | Backoff logic |
| **Sprint 2.3 Subtotal** | **24h** | | |

**Phase 2 Total: ~78 hours (~2 weeks full-time, 4-5 weeks part-time)**

---

### Phase 3: Multi-AI Support + First Sub-Agent

**Original Estimate:** 4 weeks  
**Revised Estimate:** 5-6 weeks  
**Reason:** Multiple APIs + sub-agent coordination is complex

#### Sprint 3.1: API Abstraction Layer (Week 14-15)
**Goal:** BaseAdapter interface + multiple providers

| Task | Hours | Risk | Dependencies |
|------|-------|------|--------------|
| Create BaseAdapter interface | 4 | Low | TypeScript |
| Refactor OpenAI to use BaseAdapter | 4 | Low | Existing code |
| Implement Anthropic adapter | 6 | Medium | Different API format |
| Implement Google adapter | 6 | Medium | Different auth |
| Connection Manager (add/remove/list) | 6 | Low | Database |
| Connection switching UI | 6 | Medium | Dropdown |
| **Sprint 3.1 Subtotal** | **32h** | | |

**Definition of Done (Sprint 3.1):**
- [ ] BaseAdapter interface defined
- [ ] OpenAI, Anthropic, Google adapters work
- [ ] User can add/remove connections
- [ ] User can switch between connections
- [ ] Each connection stores keys separately

---

#### Sprint 3.2: First Sub-Agent - Coder (Week 16-17)
**Goal:** "Write me code" routes to Claude

| Task | Hours | Risk | Dependencies |
|------|-------|------|--------------|
| Coder Agent class | 6 | Medium | Claude API |
| Intent classification (code vs chat) | 6 | Medium | Router logic |
| Orchestrator dispatch logic | 4 | Low | Existing pattern |
| Code display UI (syntax highlighting) | 6 | Medium | Highlight.js |
| Test multi-agent workflow | 6 | Medium | Integration |
| **Sprint 3.2 Subtotal** | **28h** | | |

---

#### Sprint 3.3: File Agent + Custom Endpoints (Week 18-19)
**Goal:** Local file operations + Cortana connection

| Task | Hours | Risk | Dependencies |
|------|-------|------|--------------|
| File Agent (read/write/delete) | 8 | Medium | Node fs |
| File operations respect security layer | 4 | Low | Permission check |
| Custom endpoint adapter (for Cortana) | 6 | Low | HTTP client |
| Conversation history manager | 6 | Medium | Database |
| Sub-agent coordination test | 4 | Medium | Multi-step workflow |
| **Sprint 3.3 Subtotal** | **28h** | | |

**Phase 3 Total: ~88 hours (~2-3 weeks full-time, 5-6 weeks part-time)**

---

## 4. Technical Recommendations: Libraries to Use

### Core Stack (Already Decided)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | Electron | Desktop app, transparency support |
| Renderer | React + TypeScript | Erik's familiarity, strong typing |
| Visualizer | Three.js | Required for particle sphere |
| Database | SQLite (better-sqlite3) | Local-first, proven in Erik's projects |
| Key Storage | keytar | OS keychain integration |

### Recommended Additions

| Need | Library | Rationale |
|------|---------|-----------|
| State Management | Zustand | Lightweight, works with React |
| IPC | electron-trpc | Type-safe IPC, better than raw ipcMain |
| Styling | Tailwind + CSS variables | Skin-friendly, Erik knows it |
| Streaming | Server-Sent Events | All providers support it |
| Syntax Highlighting | Shiki | Fast, accurate, themes |
| Animation | Framer Motion | React-friendly, performant |
| Testing | Vitest + Playwright | Fast, works with Electron |
| Linting | ESLint + Prettier | Standard for TypeScript |

### Libraries to AVOID

| Library | Why Not |
|---------|---------|
| Redux | Overkill for this app |
| webpack | Electron-vite is simpler |
| Socket.io | SSE is sufficient for streaming |
| MongoDB | SQLite is better for local app |
| Electron-store | keytar is more secure for API keys |

---

## 5. Gap Detection: What's Missing

### Security Vulnerabilities (From Trading Project Patterns)

1. **API Key Rotation Not Planned**
   - Trading has this concern documented
   - Hologram should support: "Rotate key" button
   - Implementation: Delete old, prompt for new

2. **Request Logging for Debugging**
   - Trading logs all API calls
   - Hologram needs: Request/response log (sanitized)
   - Don't log keys, do log errors

3. **Rate Limit Tracking**
   - Not explicitly in roadmap
   - Need: Track usage per provider
   - Alert when approaching limits

### GPU/Performance (From Image Workflow)

1. **GPU Memory Not Addressed**
   - Image Workflow manages GPU resources carefully
   - Three.js can leak GPU memory
   - Need: Proper disposal of Three.js objects
   - Add: Memory monitoring in dev tools

2. **Frame Rate Monitoring**
   - Image Workflow has performance metrics
   - Hologram needs: FPS counter (dev mode)
   - Alert if < 30fps sustained

3. **Battery Impact Not Tested**
   - Continuous animation drains battery
   - Need: "Power saver mode" that reduces particles
   - Add: Battery status detection

### Missing from Roadmap

1. **Offline Mode**
   - Not explicitly planned
   - Need: Detect network status
   - Cache last responses
   - Queue actions for later

2. **Conversation Export**
   - Users may want to save conversations
   - Add: Export to Markdown/JSON
   - Privacy-aware (mask keys in export)

3. **Crash Recovery**
   - What happens if app crashes mid-conversation?
   - Need: Auto-save conversation state
   - Resume on restart

4. **Update Mechanism**
   - Manual updates mentioned but not designed
   - Need: Check for updates (opt-in)
   - Show changelog, download link

---

## 6. Definition of Done: v1.0 Quality Gate

### Technical Checklist

#### Security (MUST PASS)

- [ ] API keys stored in OS keychain ONLY
- [ ] Keys never appear in logs, console, or error dialogs
- [ ] Keys masked in UI by default
- [ ] "Delete all keys" panic button works
- [ ] All network calls documented
- [ ] No telemetry in release build
- [ ] Signed release with checksums
- [ ] Green/Yellow/Red permission system works
- [ ] Red actions require explicit authorization
- [ ] Frequency limits prevent action spam

#### Performance (MUST PASS)

- [ ] Startup time < 2 seconds
- [ ] Visualizer maintains 60fps
- [ ] CPU usage < 5% when idle
- [ ] Memory usage < 300MB
- [ ] No memory leaks after 1 hour
- [ ] Responsive input (< 100ms latency)

#### Functionality (MUST PASS)

- [ ] Can connect to OpenAI, Anthropic, Google
- [ ] Messages stream in real-time
- [ ] Visualizer state matches conversation state
- [ ] Window is transparent and draggable
- [ ] Hotkey shows/hides window
- [ ] Menu bar integration works (macOS)
- [ ] Settings persist across restarts
- [ ] Conversation history persists

#### Architecture (MUST PASS)

- [ ] Router → Orchestrator → Adapter pattern works
- [ ] Personality loaded from config file
- [ ] Adding new adapter doesn't require UI changes
- [ ] Sub-agent dispatch works (Coder Agent)
- [ ] File Agent respects security layer

### Design Checklist

#### Aesthetic (MUST PASS)

- [ ] Window has no rectangular borders
- [ ] Visualizer looks "alive" (never static)
- [ ] Color scheme matches Cortana (blue/purple)
- [ ] Transitions are smooth
- [ ] UI feels "alien glass," not standard software

#### UX (MUST PASS)

- [ ] New user can send first message in < 30 seconds
- [ ] API key setup is clear
- [ ] Error messages are helpful (not technical)
- [ ] Red switch is obviously a confirmation

### Documentation Checklist (MUST PASS)

- [ ] README explains what app does
- [ ] API key setup guide exists
- [ ] Security statement published
- [ ] Changelog for release
- [ ] Known limitations documented

---

## 7. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Three.js performance issues | Medium | High | Profile early, reduce particles if needed |
| Electron transparency breaks on Windows | High | Medium | macOS first, Windows in v1.1 |
| API provider rate limits | Medium | Medium | Implement backoff, cache responses |
| Keytar not available on all systems | Low | High | Fallback to encrypted file |
| Feature creep delays launch | High | High | Strict scope, defer to v1.1 |
| Erik gets distracted by other projects | Medium | High | Time-box Hologram sessions |

---

## 8. Recommended Order of Operations

### Why This Order

1. **Electron Foundation first** → Everything depends on the window
2. **Visualizer second** → The "soul" must work early
3. **Orchestrator third** → Architecture pattern before features
4. **Security layer fourth** → Before any real API keys
5. **Multi-AI fifth** → Extend proven pattern
6. **Aesthetics last** → Polish after function

### Reorder Notes

If Timeline Pressure:
- Skip Windows support (macOS only for v1.0)
- Skip Google adapter (OpenAI + Anthropic sufficient)
- Skip File Agent (defer to v1.1)
- Keep: Visualizer, Security, OpenAI adapter

---

## 9. Next Immediate Steps

### This Week

1. **Initialize Electron project** with transparency config
2. **Port Agent OS db.py** to TypeScript
3. **Create placeholder Router class** (single path)
4. **Set up development environment** (ESLint, Prettier, Vitest)

### This Month

1. Complete Sprint 1.1 (Electron Foundation)
2. Complete Sprint 1.2 (Three.js Visualizer)
3. Document any deviations from this plan

---

## Appendix A: File Structure (Recommended)

```
hologram/
├── package.json
├── electron.vite.config.ts
├── ROADMAP.md
├── ARCHITECT_REVIEW.md           ← This file
├── CHANGELOG.md
│
├── src/
│   ├── main/                     # Electron main process
│   │   ├── index.ts             # Entry point
│   │   ├── db.ts                # SQLite (port from Agent OS)
│   │   ├── keychain.ts          # keytar wrapper
│   │   ├── adapters/
│   │   │   ├── BaseAdapter.ts
│   │   │   ├── OpenAIAdapter.ts
│   │   │   ├── AnthropicAdapter.ts
│   │   │   └── GoogleAdapter.ts
│   │   ├── agents/
│   │   │   ├── BaseAgent.ts
│   │   │   ├── CoderAgent.ts
│   │   │   └── FileAgent.ts
│   │   ├── security/
│   │   │   ├── SecurityLayer.ts
│   │   │   ├── CircuitBreaker.ts  # Port from Cortana
│   │   │   └── RiskAssessment.ts
│   │   └── orchestrator/
│   │       ├── Router.ts
│   │       └── Orchestrator.ts
│   │
│   ├── renderer/                 # Electron renderer (React)
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Visualizer.tsx   # Three.js component
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── RedSwitch.tsx
│   │   │   └── Settings.tsx
│   │   └── hooks/
│   │       └── useOrchestrator.ts
│   │
│   └── preload/                  # Electron preload
│       └── index.ts
│
├── config/
│   ├── personas/
│   │   └── cortana.json
│   └── skills/                   # MCP skills (future)
│       └── .gitkeep
│
├── skins/
│   └── default-cortana/
│       ├── skin.json
│       ├── styles.css
│       └── assets/
│
└── docs/                         # Existing docs
```

---

## Appendix B: Code Snippets to Port

### From Agent OS: Database Helper (TypeScript Version)

```typescript
// src/main/db.ts
import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const DB_PATH = path.join(app.getPath('userData'), 'hologram.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS connections (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      config TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_used TEXT
    );
    
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      connection_id TEXT NOT NULL,
      messages TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (connection_id) REFERENCES connections(id)
    );
  `);
}
```

### From Cortana: Circuit Breaker (TypeScript Version)

```typescript
// src/main/security/CircuitBreaker.ts
interface ActionRecord {
  actionType: string;
  timestamp: number;
}

export class CircuitBreaker {
  private readonly FREQUENCY_LIMIT = 5;
  private readonly WINDOW_HOURS = 24;
  private actionHistory: ActionRecord[] = [];

  checkFrequency(actionType: string): string | null {
    const cutoff = Date.now() - (this.WINDOW_HOURS * 60 * 60 * 1000);
    const recentActions = this.actionHistory.filter(
      a => a.actionType === actionType && a.timestamp > cutoff
    );
    
    if (recentActions.length >= this.FREQUENCY_LIMIT) {
      return `Rate limit: ${actionType} already performed ${recentActions.length} times in last ${this.WINDOW_HOURS} hours`;
    }
    
    return null;
  }

  recordAction(actionType: string): void {
    this.actionHistory.push({
      actionType,
      timestamp: Date.now()
    });
    
    // Cleanup old records
    const cutoff = Date.now() - (this.WINDOW_HOURS * 2 * 60 * 60 * 1000);
    this.actionHistory = this.actionHistory.filter(a => a.timestamp > cutoff);
  }
}
```

---

*Review Complete. Ready for implementation.*

**Next Action:** Erik reviews this document, approves or modifies, then we begin Sprint 1.1.

---

*Reviewed by: Claude Opus 4.5 (claude-opus-4-5-20250514)*  
*File: OPUS_4.5_REVIEW.md*  
*Date: December 18, 2025*  
*Confidence: High*

