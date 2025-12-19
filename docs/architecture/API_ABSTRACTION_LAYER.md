# API Abstraction Layer

**Multi-AI Support Architecture**

---

## Overview

Hologram needs to connect to multiple AI services with different APIs, authentication methods, and response formats. The API Abstraction Layer normalizes these differences so the UI can work with any provider.

---

## Core Requirements

1. **Unified Interface** - All AI services expose the same methods to the UI
2. **Connection Profiles** - Users configure multiple AI connections
3. **Secure Storage** - API keys encrypted at rest
4. **Streaming Support** - Real-time token streaming for all providers
5. **Error Handling** - Graceful fallbacks and clear error messages
6. **Parent API Option** - Erik's parent API as a connection type

---

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           Hologram UI Layer                 │
│  (Chat window, visualizer, settings)        │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│      Unified Chat Interface                 │
│  sendMessage(text, connection, options)     │
│  streamResponse(callback)                   │
│  getHistory(connection)                     │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│      API Abstraction Layer                  │
│  ┌─────────────────────────────────┐        │
│  │  Connection Manager             │        │
│  │  - Load profiles                │        │
│  │  - Validate credentials         │        │
│  │  - Route requests               │        │
│  └─────────────────────────────────┘        │
│                                              │
│  ┌─────────────────────────────────┐        │
│  │  Provider Adapters              │        │
│  │  - OpenAI Adapter               │        │
│  │  - Anthropic Adapter            │        │
│  │  - Google Adapter               │        │
│  │  - Custom/Cortana Adapter       │        │
│  └─────────────────────────────────┘        │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│      External AI Services                   │
│  OpenAI | Anthropic | Google | Cortana      │
└─────────────────────────────────────────────┘
```

---

## Connection Profile Schema

Each connection is stored as:

```json
{
  "id": "uuid-v4",
  "name": "GPT-4o",
  "type": "openai",
  "enabled": true,
  "config": {
    "api_key": "sk-...",  // Encrypted in storage
    "model": "gpt-4o",
    "endpoint": "https://api.openai.com/v1",  // Optional override
    "temperature": 0.7,
    "max_tokens": 2000,
    "system_prompt": "You are a helpful assistant."
  },
  "created_at": "2025-12-18T12:00:00Z",
  "last_used": "2025-12-18T14:30:00Z"
}
```

### Special Types:

**OpenAI:**
```json
{
  "type": "openai",
  "config": {
    "api_key": "sk-...",
    "model": "gpt-4o" | "gpt-4" | "gpt-3.5-turbo"
  }
}
```

**Anthropic:**
```json
{
  "type": "anthropic",
  "config": {
    "api_key": "sk-ant-...",
    "model": "claude-3-5-sonnet-20241022" | "claude-3-opus-20240229"
  }
}
```

**Google:**
```json
{
  "type": "google",
  "config": {
    "api_key": "AIza...",
    "model": "gemini-2.0-flash-exp" | "gemini-1.5-pro"
  }
}
```

**Cortana (Custom):**
```json
{
  "type": "custom",
  "config": {
    "endpoint": "http://localhost:8000/cortana/query",
    "auth_type": "bearer" | "api_key" | "none",
    "api_key": "optional-if-needed"
  }
}
```

**Parent API:**
```json
{
  "type": "parent_api",
  "config": {
    "endpoint": "https://erik-parent-api.example.com",
    "api_key": "parent-key-...",
    "target_model": "gpt-4o"  // Which underlying model to use
  }
}
```

---

## Provider Adapter Interface

Each adapter implements:

```javascript
class BaseAdapter {
  constructor(config) {
    this.config = config;
  }

  async sendMessage(messages, options) {
    // Returns: { id, content, model, usage }
    throw new Error("Not implemented");
  }

  async *streamMessage(messages, options) {
    // Yields: { delta, done }
    throw new Error("Not implemented");
  }

  async validateConnection() {
    // Returns: { valid: boolean, error?: string }
    throw new Error("Not implemented");
  }

  normalizeMessages(messages) {
    // Converts internal format to provider format
    throw new Error("Not implemented");
  }
}
```

### Internal Message Format

Hologram uses a unified message format:

```json
[
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": "Hello!"
  },
  {
    "role": "assistant",
    "content": "Hi! How can I help you today?"
  }
]
```

Each adapter converts this to the provider's expected format.

---

## OpenAI Adapter Example

```javascript
class OpenAIAdapter extends BaseAdapter {
  async sendMessage(messages, options = {}) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.api_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages,
        temperature: options.temperature ?? this.config.temperature,
        max_tokens: options.max_tokens ?? this.config.max_tokens
      })
    });

    const data = await response.json();
    
    return {
      id: data.id,
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage
    };
  }

  async *streamMessage(messages, options = {}) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.api_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages,
        temperature: options.temperature ?? this.config.temperature,
        max_tokens: options.max_tokens ?? this.config.max_tokens,
        stream: true
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            yield { delta: '', done: true };
            return;
          }

          const parsed = JSON.parse(data);
          const delta = parsed.choices[0]?.delta?.content || '';
          yield { delta, done: false };
        }
      }
    }
  }

  normalizeMessages(messages) {
    return messages; // OpenAI format is our base format
  }
}
```

---

## Anthropic Adapter Key Differences

Anthropic uses a different message structure:
- `system` is a separate parameter, not a message
- Requires `anthropic-version` header

```javascript
class AnthropicAdapter extends BaseAdapter {
  normalizeMessages(messages) {
    // Extract system message
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    return {
      system: systemMessage?.content || undefined,
      messages: conversationMessages
    };
  }

  async sendMessage(messages, options = {}) {
    const { system, messages: normalizedMessages } = this.normalizeMessages(messages);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.config.api_key,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: normalizedMessages,
        system: system,
        max_tokens: options.max_tokens ?? this.config.max_tokens ?? 4096,
        temperature: options.temperature ?? this.config.temperature
      })
    });

    const data = await response.json();
    
    return {
      id: data.id,
      content: data.content[0].text,
      model: data.model,
      usage: data.usage
    };
  }
}
```

---

## Connection Manager

```javascript
class ConnectionManager {
  constructor() {
    this.connections = new Map();
    this.adapters = {
      'openai': OpenAIAdapter,
      'anthropic': AnthropicAdapter,
      'google': GoogleAdapter,
      'custom': CustomAdapter,
      'parent_api': ParentAPIAdapter
    };
  }

  async loadConnections() {
    // Load from encrypted storage
    const profiles = await SecureStorage.getAll('connections');
    
    for (const profile of profiles) {
      const AdapterClass = this.adapters[profile.type];
      const adapter = new AdapterClass(profile.config);
      this.connections.set(profile.id, { profile, adapter });
    }
  }

  getConnection(id) {
    return this.connections.get(id);
  }

  async addConnection(profile) {
    // Validate
    const AdapterClass = this.adapters[profile.type];
    const adapter = new AdapterClass(profile.config);
    const validation = await adapter.validateConnection();
    
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Save
    profile.id = crypto.randomUUID();
    await SecureStorage.set(`connections.${profile.id}`, profile);
    this.connections.set(profile.id, { profile, adapter });
    
    return profile.id;
  }

  async removeConnection(id) {
    this.connections.delete(id);
    await SecureStorage.delete(`connections.${id}`);
  }

  listConnections() {
    return Array.from(this.connections.values())
      .map(({ profile }) => ({
        id: profile.id,
        name: profile.name,
        type: profile.type,
        enabled: profile.enabled,
        last_used: profile.last_used
      }));
  }
}
```

---

## UI Integration

### Settings Panel

Users configure connections in a settings panel:

```
┌──────────────────────────────────────┐
│  Hologram Settings                   │
├──────────────────────────────────────┤
│  Connections:                        │
│                                      │
│  ✅ GPT-4o              [Edit] [🗑️] │
│  ✅ Claude Sonnet       [Edit] [🗑️] │
│  ✅ Cortana             [Edit] [🗑️] │
│  ❌ Gemini (disabled)   [Edit] [🗑️] │
│                                      │
│  [+ Add New Connection]              │
└──────────────────────────────────────┘
```

### Chat Window

Switch between connections via dropdown:

```
┌──────────────────────────────────────┐
│  [GPT-4o ▼]                    [⚙️]  │
├──────────────────────────────────────┤
│                                      │
│  💙 You: Hello!                      │
│                                      │
│  🤖 GPT-4o: Hi! How can I help?      │
│                                      │
│  💙 You: [Type your message...]      │
└──────────────────────────────────────┘
```

---

## Security Considerations

### API Key Storage

- **Encryption:** Use OS keychain (macOS Keychain, Windows Credential Manager)
- **Never in plaintext:** No API keys in config files
- **Per-connection:** Each connection has its own encrypted credential

### Recommended: electron-store + keytar

```javascript
const Store = require('electron-store');
const keytar = require('keytar');

class SecureStorage {
  static async set(key, value) {
    // Store non-sensitive data in electron-store
    const { api_key, ...publicData } = value;
    await store.set(key, publicData);
    
    // Store API key in keychain
    if (api_key) {
      await keytar.setPassword('hologram', key, api_key);
    }
  }

  static async get(key) {
    const publicData = store.get(key);
    const api_key = await keytar.getPassword('hologram', key);
    
    return { ...publicData, api_key };
  }
}
```

---

## Future Extensions

### Planned Features:
- [ ] **Plugin System** - Third-party adapters
- [ ] **Conversation History** - Per-connection chat history
- [ ] **Cost Tracking** - Token usage and cost estimation
- [ ] **Model Comparison** - Send same prompt to multiple models
- [ ] **Prompt Templates** - Reusable system prompts
- [ ] **Rate Limiting** - Respect API rate limits

### Open Questions:
- Should we support local models (Ollama, LM Studio)?
- Should conversation history sync across connections?
- Should we build a "Parent API" service for users without APIs?

---

## Next Steps

1. **Prototype Connection Manager** - Basic add/remove/list
2. **Implement OpenAI Adapter** - Test with real API
3. **Build Settings UI** - Connection management panel
4. **Add Streaming Support** - Real-time token display
5. **Integrate with Chat Window** - End-to-end flow

---

*Last updated: December 18, 2025*

