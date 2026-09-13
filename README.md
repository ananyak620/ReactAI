# 🌌 Apex Autonomous AI — ReAct & Human-in-the-Loop (HITL) Agent

> **Production-grade, resilient autonomous AI agent capable of long-horizon execution, live multi-portal data retrieval, multi-constraint policy verification, and zero-compromise Human-in-the-Loop (HITL) safety boundaries.**

---

## 🌟 Overview

Unlike passive conversational chatbots that produce static text or require constant manual button-clicking, **Apex Autonomous AI** operates via a continuous **Event-Driven Execution Loop (ReAct: Read, Reason, Act)**.

The agent independently executes **95% of tedious data retrieval, search, comparison, and form-filling labor**, but enforces an absolute execution halt at **irreversible, high-risk boundaries** (such as final payment submission, wire transfer, or account changes) to yield control to the human operator for review and authorization.

---

## 🏗️ Architecture Blueprint

```
                     [ HUMAN OPERATOR PROMPT ]
                                │
                                ▼
         ┌─────────────────────────────────────────────┐
         │       LAYER 1: CONVERSATIONAL WORKSPACE     │
         │  • Cosmic Glassmorphism Interface           │
         │  • Multi-Source Telemetry & Audit Trails    │
         └──────────────────────┬──────────────────────┘
                                │
                                ▼
         ┌─────────────────────────────────────────────┐
         │       LAYER 2: AGENTIC RAG & RETRIEVAL      │
         │  • Hybrid Vector & BM25 Sparse Search       │
         │  • Cross-Encoder Reranker & Critic Node     │
         │  • Hallucination & Groundedness Auditor     │
         └──────────────────────┬──────────────────────┘
                                │
                                ▼
         ┌─────────────────────────────────────────────┐
         │       LAYER 3: ReAct STATE EXECUTION LOOP   │
         │  • Thought: Multi-constraint policy check   │
         │  • Action: Live web search & portal scrape  │
         │  • Observation: Parse structured results    │
         │  • Self-Healing: Error retry & query tweak  │
         └──────────────────────┬──────────────────────┘
                                │
                 Reaches Irreversible Action?
                                │
               ┌────────────────┴────────────────┐
               │ YES                             │ NO
               ▼                                 ▼
      [ TRIGGER INTERRUPT ]               [ CALL TOOL ]
               │                          (Fill next field)
               ▼
     Freeze State Graph & Traces
               │
               ▼
     Present Review Screen to Human
     (Route, Date, Budget, Baggage)
               │
    [ Human Operator Reviews & Clicks ]
      "Authorize & Complete Payment"
               │
               ▼
    [ RESUME STATE EXECUTION ]
     • Commit payment API dispatch
     • Issue verified PNR reference
     • Persist signed E-Ticket artifact
```

---

## ⚡ Core Operational Capabilities

### 1. The Transactional Boundary Test (Flight Booking)
* **Autonomous Labor (95%):** Searches airline portals, evaluates 4+ flight combinations against strict budget ceilings, checks baggage allowances, verifies free cancellation windows, and pre-fills passenger details.
* **Safety Boundary (5%):** Detects `Next Action = "Submit Payment"`, halts the state graph, freezes execution, and displays an interactive **Human-in-the-Loop Review Card** with verified constraints.
* **Resumption:** Upon human operator authorization, executes reservation, mints PNR, and outputs a downloadable e-ticket markdown artifact to `workspace_outputs/`.

### 2. Multi-Portal E-Commerce Spec & Price Comparison
* Scrapes live prices across **Flipkart, Amazon, and Croma** for hardware/laptops.
* Verifies RAM, SSD, processor tier, and discounts to extract the single best deal without ad bias.

### 3. Dynamic Element Ambiguity & Anti-Distractor Filtering
* Visual & semantic filtering rejects express-checkout third-party popups (Apple Pay, PayPal, Klarna) and newsletter modals, targeting verified canonical checkout anchors.

### 4. Broken Path Self-Healing
* In case of HTTP `404`, connection drops, or unclickable elements, the critic node captures the error trace, reformulates search terms, switches mirrors, and resumes autonomously without crashing.

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

1. **Clone the Repository:**
   ```bash
   git clone <your-repo-url>
   cd reactai
   ```

2. **Install Dependencies:**
   ```bash
   # Install server dependencies
   npm install --prefix server

   # Install client dependencies
   npm install --prefix client
   ```

3. **Configure Environment (Optional):**
   ```bash
   cp server/.env.example server/.env
   ```

4. **Build & Run:**
   ```bash
   # Build the production client
   npm --prefix client run build

   # Start the unified full-stack server
   npm start
   ```

5. **Open in Browser:**
   Navigate to: **[http://localhost:5000](http://localhost:5000)** (or dev mode at `http://localhost:5173`)

---

## 📁 Repository Structure

```
reactai/
├── client/                      # Frontend Application (React + Vite)
│   ├── public/                  # Static assets & cosmic wallpaper
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArchitectureGuide.jsx   # Operational principles modal
│   │   │   └── SettingsModal.jsx       # Reasoning engine & model preferences
│   │   ├── App.jsx                     # Conversational workspace & HITL cards
│   │   └── index.css                   # Cosmic glassmorphism theme & styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Autonomous Backend & Agent Loop
│   ├── agent/
│   │   ├── chatAgent.js         # Conversational agent & HITL boundary controller
│   │   ├── ragEngine.js         # 4-Layer Agentic RAG (BM25, Reranker, Auditor)
│   │   └── reactLoop.js         # State graph execution loop
│   ├── tools/
│   │   ├── anakinGateway.js     # Unified multi-model hub client
│   │   ├── bookingTools.js      # Flight search & PNR reservation tool
│   │   ├── fileTools.js         # Artifact persistence to workspace_outputs/
│   │   ├── newsTools.js         # Live global news synthesizer
│   │   ├── productTools.js      # Multi-platform e-commerce comparison
│   │   ├── registry.js          # Typed tool declarations & schema
│   │   ├── restaurantTools.js   # Dining reservation tool
│   │   ├── webReader.js         # DOM content parser & scraper
│   │   └── webSearch.js         # Web search provider
│   ├── index.js                 # Express server & API endpoints
│   └── package.json
│
├── workspace_outputs/           # Persistent artifacts (E-Tickets, reports, vouchers)
├── .gitignore                   # Ignored files (node_modules, .env, builds)
├── package.json                 # Root orchestration scripts
└── README.md                    # Project documentation
```

---

## 🛡️ License

MIT License. Designed and engineered for high-assurance autonomous agent workflows.
