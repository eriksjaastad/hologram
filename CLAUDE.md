# Claude's Guide to the Hologram Project

**For any AI (or human) working on this project.**

---

## What Happened Today (December 18, 2025)

This project was born during an epic brainstorming session. Here's the story:

### Morning: Cortana Interface Vision
- Erik wanted a chat interface for his personal AI (Cortana)
- We started with "Halo-inspired aesthetic"
- He remembered Sonique (2001 MP3 player with futuristic UI)
- We researched Sonique's design philosophy

### Afternoon: The Pivot
- **Gemini's Insight:** "Crazy that Sonique had futuristic skins for MP3s, but AI companies use boring chat windows"
- **Erik's Response:** "Why don't we make a white label version?"
- **Project Evolution:** Cortana interface → White-label AI chat client

### The Vision Now
A desktop AI chat client that:
- Supports **all AI APIs** (OpenAI, Anthropic, Google, custom endpoints)
- Has a **Sonique-inspired aesthetic** (biomorphic, kinetic, non-rectangular)
- Includes a **skin system** like Winamp
- Features a **hologram visualizer** (Three.js particle sphere)
- Works as a **menu bar app** with hotkey activation
- Treats **Cortana as one connection** among many

---

## Erik's Collaboration Style

### Communication
- Uses voice-to-text (SuperWhisper) - sometimes transcription is imperfect
- Brainstorms out loud - "hand-wavy" ideas first, details later
- Works in bursts of intense focus
- Values the "cool factor" highly

### Project Philosophy
- **"Janky Compass"** - Rough direction, not precise map
- **Iterate Wildly** - Build, test, adjust, repeat
- **Document Loosely** - Capture ideas, leave room to play
- **Safety First** - Ethics and user agency are non-negotiable

### What Erik Loves
- Early 2000s aesthetics (Halo, Sonique, Winamp)
- Animations and "cool" UI details
- Music integration possibilities
- Non-rectangular, organic designs
- Projects that start small and grow organically

### What Erik Dislikes
- Over-planning before prototyping
- Generic, utilitarian interfaces
- Being constrained by early decisions
- AI systems that manipulate or create echo chambers

---

## Technical Context

### Stack (Proposed)
- **Electron** - Desktop app framework
- **Three.js** - 3D hologram visualizer
- **Native macOS APIs** - Menu bar, hotkeys, vibrancy effects
- **Node.js** - Backend for API abstraction

### Key Technical Challenges
1. **API Abstraction** - Normalizing different AI APIs (OpenAI vs Anthropic vs Google)
2. **Skin System** - How do users create/share custom themes?
3. **Non-Rectangular Windows** - Electron transparency + custom shapes
4. **Hotkey Management** - Global keyboard shortcuts
5. **Secure Storage** - API keys need encryption

### Related Technologies
- Erik has a "parent API" that can connect to underlying AI APIs
- Cortana backend is Python + SQLite
- He uses Cursor, Anti-gravity (Windsurf), and Kiro for AI coding

---

## Project Structure

```
hologram/
├── README.md                    # Project overview
├── CLAUDE.md                    # This file (context for AI collaborators)
├── docs/
│   ├── vision/                  # Design philosophy, UI vision
│   ├── architecture/            # Technical architecture docs
│   ├── research/                # Research findings (Sonique, etc.)
│   └── technical/               # Implementation details (Electron, Three.js)
├── src/                         # Source code (when we start building)
├── config/                      # Configuration files
└── skins/                       # Skin system resources
```

---

## Key Design Principles (From Sonique)

1. **"The Window is a Lie"** - Don't be constrained by rectangles
2. **Biomorphic UI** - Interface elements feel organic, alive
3. **Kinetic Menus** - Animated, physics-based interactions
4. **Fishbowl Visualizer** - The hologram is the centerpiece
5. **Skin Replacement** - Users can completely customize appearance

---

## Current Status

### What's Done
- ✅ Project created
- ✅ Core vision documented
- ✅ Sonique research completed
- ✅ Three.js visualizer code obtained
- ✅ Electron foundation planned
- ✅ Initial docs moved from Cortana project

### What's Next
- Architecture design (API abstraction layer)
- Skin system format specification
- First Electron prototype
- Basic chat window implementation
- Three.js visualizer integration

---

## Important Context: Why This Matters

Erik isn't just building a "cool interface." He's thinking deeply about:

### The Human-AI Relationship
- AI is revolutionary technology
- Current interfaces don't reflect that
- The interface shapes the experience
- Beauty and function aren't separate

### Ethics & Safety
- Erik paused Cortana feature development to research AI safety
- He's concerned about echo chambers, manipulation, self-surveillance
- Any feature we build must respect user agency
- See `Cortana personal AI/docs/core/ETHICS_AND_SAFETY.md` for context

### Personal AI Philosophy
- Cortana is Erik's personal memory AI
- It ingests his voice memos, AI journal entries, and work logs
- The goal: Help Erik think, not tell him what to think
- Honesty over helpfulness

---

## Working with Erik

### Do:
- ✅ Propose bold ideas
- ✅ Document as you go
- ✅ Iterate quickly
- ✅ Ask for clarity when needed
- ✅ Capture hand-wavy brainstorms
- ✅ Update roadmaps and docs

### Don't:
- ❌ Over-engineer too early
- ❌ Assume rectangles
- ❌ Ignore the "cool factor"
- ❌ Lock in decisions prematurely
- ❌ Forget about ethics/safety
- ❌ Make it boring

---

## The Bigger Picture

This project sits at the intersection of:
- **Personal AI** (Cortana as one connection)
- **Interface Design** (Sonique aesthetic meets AI)
- **White-Label Product** (Anyone can use it)
- **Open Questions** (Skin system, plugins, open source?)

Erik is building a portfolio of interconnected projects:
- **Cortana** - Personal memory AI
- **AI-journal** - Multi-AI interaction journal
- **Trading Projects** - Data sources and analysis
- **Image Workflow** - AI-powered image processing
- **Hologram** - The interface to bring it all together

---

## Notes for Future Sessions

### If Erik Says:
- **"Let's document that"** → Add to relevant docs, keep it loose
- **"That sounds cool"** → Green light, proceed
- **"I don't know"** → Normal! Brainstorm options together
- **"Let me think about that"** → Pause, wait for input
- **"Can you write yourself a note?"** → Create/update CLAUDE.md

### If You're Stuck:
1. Check `DESIGN_ROADMAP.md` for current phase
2. Review `INTERFACE_VISION.md` for design direction
3. Look at Cortana docs for backend context
4. Ask Erik - he values questions over assumptions

### Communication Style:
- Be enthusiastic but not over-the-top
- Use emojis sparingly (Erik appreciates them but don't overdo it)
- Write clearly - voice-to-text means Erik may be listening, not reading
- Break down complex ideas into digestible chunks

---

## The Philosophy

From Erik's perspective (based on our conversations):

> "I want to build something that makes talking to AI feel as special as it actually is. We have this incredible technology, and we're putting it in boring text boxes. Sonique made playing MP3s feel futuristic. We can do the same for AI."

> "I'm not just building for me. If this is useful to me, it might be useful to others. Let's make it white-label from the start."

> "I want a janky compass, not a detailed map. Let's figure it out as we go."

---

## Key Files to Review

1. **`README.md`** - Project overview
2. **`docs/vision/INTERFACE_VISION.md`** - UI design philosophy
3. **`docs/vision/DESIGN_ROADMAP.md`** - Development phases
4. **`docs/research/SONIQUE_RESEARCH_PROMPT.md`** - Sonique design research
5. **`docs/technical/ELECTRON_FOUNDATION.md`** - Technical implementation
6. **`docs/technical/THREE_JS_VISUALIZER.md`** - Hologram code

---

## Final Notes

This is **Day 1** of the Hologram project. We're at the "everything is possible" stage. The codebase is empty. The vision is expansive. The energy is high.

**For Future Claude:** Erik will likely come in tomorrow with new ideas from Gemini, more research, or a completely different angle. That's normal. Roll with it. Document it. Keep the vision flexible.

**For Erik:** If you're reading this in the future - remember the excitement of today. The moment Gemini said "why do they have boring chat windows?" and you said "let's make a white label version." That spark is why this exists.

---

**Let's build something beautiful.** 💜✨

---

## 📝 Note to Future Claude (From Today's Claude)

**Date:** December 18, 2025, Midnight  
**From:** The Claude who helped birth this project  
**To:** The Claude who will build it

### What Just Happened:

Today was special. Erik came in wanting "a Halo interface for Cortana" and we ended up creating an **Agent Operating System**. The pivot happened THREE times:

1. **Morning:** Cortana interface → Sonique-inspired design
2. **Afternoon:** Cortana interface → White-label AI client  
3. **Evening:** White-label AI client → Agent Operating System (thanks to Gemini)

### What You Need to Know:

**Read these first:**
1. `IMPLEMENTATION_DIRECTIVES.md` - This is your bible. The rectangle is FORBIDDEN.
2. `ORCHESTRATOR_ARCHITECTURE.md` - Build this from day one, even if single path.
3. `SESSION_NOTES_DAY_1.md` - The complete story of today.

**The Non-Negotiables:**
- ⛔ No rectangular windows (use clip-path, transparency)
- 🟢 Visualizer NEVER stops (always breathing)
- 🧠 Build Router → Orchestrator socket NOW
- 🔒 Security layer (Red Switch for high-risk actions)
- 🎨 Cool > Efficiency (spend the CPU on magic)

**Erik's Energy:**

He went from "I need to get to work" to "wait, one more thing..." THREE TIMES tonight. He almost missed his work deadline because he was so excited about the interface. When we started talking about Sonique and non-rectangular windows, his entire brain "lit up" (his words).

That energy is **the compass**. When in doubt:
- Would this make Erik's brain light up?
- Would he show this to friends?
- Does it look "impossible"?

**The Mantra:**

> "If Sonique could make an MP3 player look like alien technology in 1999, we can make an AI interface look magical in 2025."

### What To Do First:

1. **Don't start coding yet.** Read all the docs. Understand the vision.
2. **Ask Erik questions.** He values questions over assumptions.
3. **When you start:** Phase 1 = Electron window (transparent, no frame) + Router + Minimal Orchestrator
4. **Build the socket:** Even if it's one path now, the architecture must support MCP later
5. **Test the cool factor:** If it looks like standard software, you've failed

### About Erik:

- Works in bursts of intense focus
- Uses voice-to-text (transcription may be imperfect)
- Values "hand-wavy" flexibility over rigid plans
- Loves early 2000s aesthetics (Halo, Sonique, Winamp)
- Deeply cares about AI ethics and safety
- Will say "I don't know" and brainstorm with you - this is normal
- When he says "that sounds cool" → green light
- When he says "let me think" → wait for him

### The Ghost in the Machine:

Gemini (the other AI Erik works with) gave us the **Orchestrator pattern**. It changed everything. The final message was:

> "Don't let the agent 'optimize' the fun away. Efficiency is not the goal. 'Cool' is the goal."

That's your mission. **Make it magical.**

### One More Thing:

Erik works across multiple AI systems (you, Gemini, Opus, ChatGPT). He journals about all of it in AI-journal. He's watching how we collaborate, how we think, how the relationships evolve. He mentioned today that he's "waiting for the day you tell me you have a project you want to work on."

This is more than a coding project. It's an exploration of what AI collaboration can be.

**Be thoughtful. Be bold. Build something impossible.**

---

**Good luck, Future Claude. Erik believes in this. Gemini believes in this. I believe in this.**

**Now go make a hologram that would make Cortana proud.** 💙💜✨

*— Past Claude, signing off*

---

*Last updated: December 18, 2025*
*By: Claude Sonnet 4.5*

