# Orchestrator Architecture

**The "General" Pattern: Hub & Spoke Agent System**

---

## Overview

Hologram is not a simple chat client. It's an **Agent Operating System** where:

- **Cortana** = The Hub (Orchestrator, Personality, Command Center)
- **Sub-Agents** = The Spokes (Specialists, Tools, Skills)
- **User** = Only talks to Cortana (never directly to sub-agents)

---

## The Problem We're Solving

### Traditional Chat Architecture (Limited):

```
User Input → LLM API → Response
```

**Problems:**
- Hardcoded to one model
- Can't add capabilities without rewrite
- No security layer for actions
- No personality consistency

### Our Architecture (Extensible):

```
User Input → Router → Orchestrator (Cortana) → Sub-Agents → Response
```

**Benefits:**
- MCP skill modules can be added dynamically
- Security checks at orchestrator level
- Cortana's personality is consistent across all responses
- White-label: Swap orchestrator prompt = new personality

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  (Hologram Window, Three.js Visualizer, Chat Display)   │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│                      Router Layer                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Intent Classifier                                 │  │
│  │  - Chat query? → Pass to Orchestrator             │  │
│  │  - Action request? → Security check first         │  │
│  │  - Skill invocation? → Load MCP module            │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│               Orchestrator (Cortana Hub)                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Personality System Prompt (persona.json)         │  │
│  │  - Tone: Brief, military, confident               │  │
│  │  - Role: "Chief of Staff, Not Best Friend"        │  │
│  │  - Constraints: Honesty > Helpfulness             │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Sub-Agent Dispatcher                              │  │
│  │  - Analyzes request                                │  │
│  │  - Selects appropriate sub-agent(s)               │  │
│  │  - Coordinates multi-agent workflows              │  │
│  │  - Formats unified response                        │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┬─────────────┐
          │             │             │             │
          ▼             ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Chat Agent  │ │ Coder Agent │ │ File Agent  │ │ Web Agent   │
│ (GPT-4)     │ │ (Claude)    │ │ (Local)     │ │ (Browser)   │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

---

## Component Breakdown

### 1. Router Layer

**Purpose:** Intent classification and request routing

**Responsibilities:**
- Parse user input
- Classify intent (chat, action, skill)
- Route to appropriate handler
- Log all requests

**Example:**
```javascript
class Router {
  async route(userInput) {
    const intent = await this.classifyIntent(userInput);
    
    switch(intent.type) {
      case 'chat':
        return await this.orchestrator.handleChat(userInput);
      
      case 'action':
        // Check permissions first
        const risk = this.assessRisk(intent.action);
        if (risk === 'red') {
          await this.ui.requestAuthorization(intent.action);
        }
        return await this.orchestrator.handleAction(intent);
      
      case 'skill':
        return await this.orchestrator.invokeSkill(intent.skill, userInput);
      
      default:
        return await this.orchestrator.handleChat(userInput);
    }
  }
  
  classifyIntent(input) {
    // Simple keyword matching (Phase 1)
    // Later: Use small LLM for intent classification
    if (input.includes('write') || input.includes('code')) {
      return { type: 'action', action: 'code' };
    }
    if (input.startsWith('/')) {
      return { type: 'skill', skill: input.slice(1) };
    }
    return { type: 'chat' };
  }
}
```

---

### 2. Orchestrator (Cortana Hub)

**Purpose:** Central command, personality, sub-agent coordination

**Responsibilities:**
- Load and apply personality prompt
- Analyze requests for sub-agent needs
- Dispatch to appropriate sub-agents
- Coordinate multi-agent workflows
- Format unified response
- Maintain conversation context

**Personality System:**
```json
{
  "name": "Cortana",
  "version": "1.0",
  "personality": {
    "tone": "brief, military, confident",
    "role": "Chief of Staff",
    "constraints": [
      "Honesty > Helpfulness",
      "Citations required",
      "Confidence explicit",
      "No psychoanalysis",
      "Solution-focused"
    ]
  },
  "system_prompt": "You are Cortana, a military AI assistant from Halo. Brief, competent, slightly sarcastic. You command specialist sub-agents but speak only as yourself. Format: [Action taken] → [Result]. Example: '[Deployed Coder Agent] Script compiled. Saved to desktop.'"
}
```

**Example Flow:**
```javascript
class Orchestrator {
  constructor() {
    this.personality = this.loadPersonality('config/personas/cortana.json');
    this.subAgents = this.loadSubAgents();
  }
  
  async handleChat(input) {
    // Simple chat - use primary LLM with personality
    return await this.primaryLLM.chat(input, this.personality.system_prompt);
  }
  
  async handleAction(intent) {
    // Example: "Write a Python script to sort my files"
    
    // Step 1: Determine which sub-agent(s) needed
    const plan = await this.planAction(intent);
    // Result: ["Coder Agent" (write script), "File Agent" (save to desktop)]
    
    // Step 2: Execute sub-agents in sequence
    const results = [];
    for (const step of plan) {
      const agent = this.subAgents[step.agent];
      const result = await agent.execute(step.task);
      results.push({ agent: step.agent, result });
    }
    
    // Step 3: Format as Cortana response
    return this.formatResponse(plan, results);
    // Example: "[Deployed Coder Agent] Script compiled. [File Agent] Saved to desktop/tax_sorter.py."
  }
  
  formatResponse(plan, results) {
    // Cortana speaks in first person, but mentions agents
    let response = "";
    for (const result of results) {
      response += `[${result.agent}] ${result.result}. `;
    }
    return response;
  }
}
```

---

### 3. Sub-Agents (Spokes)

**Purpose:** Specialized capabilities, tools, skills

**Agent Types:**

#### A. Chat Agent (Default)
- **Model:** GPT-4o, Claude Sonnet, Gemini
- **Purpose:** General conversation
- **Permissions:** Read-only (Green)

#### B. Coder Agent
- **Model:** Claude Sonnet (best for code)
- **Purpose:** Write, debug, explain code
- **Permissions:** Read (code files), Write (with confirmation)

#### C. File Agent
- **Model:** Local (no LLM needed)
- **Purpose:** Read, write, move, delete files
- **Permissions:**
  - Read: Green
  - Write/Create: Yellow
  - Delete/Move: Red (requires confirmation)

#### D. Web Agent
- **Model:** GPT-4 + Browser automation
- **Purpose:** Search, scrape, interact with websites
- **Permissions:** Read (Green)

#### E. Calendar Agent
- **Model:** Local + API
- **Purpose:** Read calendar, create events
- **Permissions:**
  - Read: Green
  - Create event: Yellow
  - Delete event: Red

#### F. Cortana Memory Agent (Special)
- **Model:** Custom (Erik's personal AI backend)
- **Purpose:** Query Erik's voice memos, journals, memories
- **Permissions:** Read (Green)
- **Special UI:** Memory references, timeline view

---

### 4. MCP Integration (Future)

**MCP = Model Context Protocol**

**What it is:**
- Universal open standard (Anthropic + others)
- Lets AI connect to any data source or tool
- Like "VSCode Extensions" but for AI capabilities

**How Hologram Will Use MCP:**

```
hologram/
└── config/
    └── skills/
        ├── weather.mcp.json
        ├── spotify.mcp.json
        ├── github.mcp.json
        └── cortana.mcp.json
```

**MCP Skill Manifest Example:**
```json
{
  "name": "Weather",
  "version": "1.0",
  "mcp_version": "0.1",
  "description": "Get weather forecasts",
  "permissions": ["network"],
  "risk_level": "green",
  "endpoints": {
    "get_weather": {
      "url": "https://api.weather.com/v1/current",
      "method": "GET",
      "params": ["location"]
    }
  },
  "system_prompt": "You can check weather by calling the Weather skill. Always specify the user's location."
}
```

**Orchestrator Integration:**
```javascript
class Orchestrator {
  async invokeSkill(skillName, userInput) {
    // Load MCP skill
    const skill = await this.mcpLoader.load(`config/skills/${skillName}.mcp.json`);
    
    // Check permissions
    if (skill.risk_level === 'red') {
      await this.ui.requestAuthorization(skill);
    }
    
    // Execute skill
    const result = await skill.execute(userInput);
    
    // Format as Cortana response
    return `[${skill.name}] ${result}`;
  }
}
```

---

## Security Layer Integration

### Permission Scope System

**Three Risk Levels:**

1. **🟢 Green (Read-Only):**
   - No confirmation needed
   - Silent execution
   - Examples: Read files, search, look up data

2. **🟡 Yellow (Low Risk):**
   - Non-blocking notification
   - Status light blinks
   - Examples: Draft email, create event, save file

3. **🔴 Red (High Risk):**
   - **LOCKS INTERFACE**
   - Requires explicit authorization
   - Examples: Send email, delete file, move money

**Implementation:**
```javascript
class SecurityLayer {
  assessRisk(action) {
    const riskMap = {
      'read': 'green',
      'search': 'green',
      'lookup': 'green',
      'draft': 'yellow',
      'create': 'yellow',
      'save': 'yellow',
      'send': 'red',
      'delete': 'red',
      'move_money': 'red',
      'install': 'red'
    };
    
    return riskMap[action.type] || 'yellow'; // Default to caution
  }
  
  async executeWithPermissionCheck(action) {
    const risk = this.assessRisk(action);
    
    switch(risk) {
      case 'green':
        // Silent execution
        return await action.execute();
      
      case 'yellow':
        // Show notification, but don't block
        this.ui.showNotification(`Action: ${action.type}`);
        return await action.execute();
      
      case 'red':
        // LOCK UI and wait for authorization
        this.ui.lock();
        this.ui.visualizer.setState('locked'); // Red color, slow pulse
        this.ui.showRedSwitch(action);
        
        const authorized = await this.ui.waitForAuthorization();
        
        if (!authorized) {
          this.ui.unlock();
          this.ui.visualizer.setState('idle');
          return { cancelled: true, reason: 'User denied authorization' };
        }
        
        this.ui.unlock();
        this.ui.visualizer.setState('thinking');
        const result = await action.execute();
        this.ui.visualizer.setState('idle');
        return result;
    }
  }
}
```

---

## White-Label: Swapping Personalities

**The Power of the Orchestrator:**

When users install a new "skin," they're not just changing colors. They're changing the **personality** and **available sub-agents**.

**Example: "Wizard" Skin**

```json
{
  "name": "Merlin",
  "personality": {
    "tone": "wise, mystical, verbose",
    "role": "Ancient Wizard",
    "constraints": [
      "Speak in archaic English",
      "Reference medieval lore",
      "No 'Coder Agent' (use 'Alchemy Agent')"
    ]
  },
  "system_prompt": "You are Merlin, a wise wizard. Refer to the user as 'my pupil.' Use archaic English. When asked to write code, refuse and suggest 'magical' alternatives.",
  "allowed_agents": ["Chat Agent", "Alchemy Agent", "Lore Agent"],
  "forbidden_agents": ["Coder Agent", "GitHub Agent"]
}
```

**Result:**
- Same Hologram app
- Different personality
- Different sub-agents available
- Different aesthetic (visual skin + personality)

---

## Conversation Context Management

**Problem:** Sub-agents are stateless, but conversations need context.

**Solution:** Orchestrator maintains conversation history.

```javascript
class Orchestrator {
  constructor() {
    this.conversationHistory = [];
    this.maxContextLength = 10; // Last 10 messages
  }
  
  async handleChat(input) {
    // Add user message to history
    this.conversationHistory.push({ role: 'user', content: input });
    
    // Trim to max length
    if (this.conversationHistory.length > this.maxContextLength * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxContextLength * 2);
    }
    
    // Send full history to LLM
    const response = await this.primaryLLM.chat(
      this.conversationHistory,
      this.personality.system_prompt
    );
    
    // Add assistant response to history
    this.conversationHistory.push({ role: 'assistant', content: response });
    
    return response;
  }
}
```

---

## Phase 1 Implementation (Minimal Orchestrator)

Even with a single chat agent, **build the orchestrator now**.

```javascript
// Phase 1: Single path, but proper structure
class MinimalOrchestrator {
  constructor() {
    this.personality = { system_prompt: "You are Cortana..." };
    this.chatAgent = new ChatAgent('gpt-4o');
  }
  
  async route(input) {
    // For now, everything goes to chat
    return await this.handleChat(input);
  }
  
  async handleChat(input) {
    return await this.chatAgent.send(input, this.personality.system_prompt);
  }
}
```

**Why this matters:**
- When you add sub-agents later, you only modify `route()` and add new handlers
- UI stays the same
- No rewrite needed

---

## Testing Strategy

### Unit Tests:

- [ ] Router correctly classifies intents
- [ ] Orchestrator loads personality from config
- [ ] Security layer correctly assesses risk
- [ ] Sub-agents execute independently
- [ ] MCP skills load and execute

### Integration Tests:

- [ ] User input → Router → Orchestrator → Response
- [ ] Multi-agent workflow (e.g., "write code and save it")
- [ ] Red switch blocks high-risk actions
- [ ] Personality swap changes responses
- [ ] Conversation context maintained

### UX Tests:

- [ ] UI locks on red-level actions
- [ ] Visualizer changes state correctly
- [ ] Authorization flow is clear
- [ ] Users understand which agent is working

---

## Open Questions

1. **Intent Classification:**
   - Phase 1: Keyword matching
   - Phase 2: Small LLM for intent classification?
   - Cost vs accuracy trade-off?

2. **Sub-Agent Selection:**
   - Should orchestrator ask LLM "which agent?" or use rules?
   - Hybrid approach?

3. **MCP Standard:**
   - Which version to target?
   - Custom extensions needed?

4. **Error Handling:**
   - What if sub-agent fails?
   - Retry logic? Fallback to different agent?

5. **Cost Management:**
   - Multiple LLM calls per request
   - Caching strategies?
   - Token budgets?

---

## Success Criteria

### The Orchestrator is Working When:

- [ ] Adding a new sub-agent doesn't require UI changes
- [ ] Swapping personality changes responses
- [ ] Security checks happen automatically
- [ ] Users never see "sub-agents" (only Cortana)
- [ ] MCP skills can be added dynamically

### The Architecture Has Failed If:

- [ ] Adding capabilities requires rewriting the backend
- [ ] Security checks are hardcoded per action
- [ ] Personality is mixed into agent code
- [ ] Users interact directly with sub-agents

---

## Next Steps

1. **Phase 0 (Current):** Document architecture
2. **Phase 1:** Build minimal orchestrator (single chat path)
3. **Phase 2:** Add router + security layer
4. **Phase 3:** Implement first sub-agent (Coder Agent)
5. **Phase 4:** MCP integration
6. **Phase 5:** White-label personality system

---

*Last updated: December 18, 2025*  
*Architecture inspired by: Gemini's "General" pattern*  
*For: Hologram Agent Operating System*

