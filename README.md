# ReactAI

> **Autonomous ReAct (Reason + Act) & Human-in-the-Loop (HITL) AI Agent** capable of executing real-world web search, multi-constraint policy validation, price comparisons, and autonomous reservations with zero-compromise safety boundaries.

---

## 🌟 What ReactAI Does

Traditional chatbots answer passively with text instructions, leaving the actual execution to you. **ReactAI** actively searches live portals, compares options across sources, verifies policies, pre-fills forms, and reserves tickets autonomously:

* ✈️ **Autonomous Flight Booking:** Searches live airline routes, checks budget limits (e.g. `< ₹6,000`), selects baggage tiers, verifies cancellation windows, and pre-fills traveler details.
* 🛡️ **Human-in-the-Loop (HITL) Safety:** Executes 95% of tedious data retrieval and form-filling labor, but enforces an absolute halt at irreversible financial boundaries (e.g. *"Submit Payment - ₹4,680"*), freezing execution state to require your explicit authorization.
* 💻 **Multi-Portal Hardware Comparison:** Evaluates laptop specs and scrapes live pricing across **Flipkart, Amazon India, and Croma** to identify the best deal.
* 📰 **Real-Time News Synthesis:** Synthesizes breaking global headlines with source attribution.
* 🍽️ **Dining Reservations:** Finds tables matching party size, date, and cuisine, generating confirmed reservation vouchers.

---

## 🛠️ Core Tech Stack & Frameworks

| Component | Framework / Technology | Purpose |
| :--- | :--- | :--- |
| **State Orchestrator** | **LangGraph / State Graph (ReAct Loop)** | Manages event-driven execution (`Thought ➔ Action ➔ Observation ➔ Reflection`) and handles state freeze/interrupts at safety boundaries. |
| **Retrieval Engine** | **Agentic RAG Pipeline (4 Layers)** | Hybrid dense vector + sparse **BM25** search, **Cross-Encoder Reranker**, **Critic/Evaluator Node**, and **Hallucination Auditor**. |
| **Multi-Model Hub** | **Anakin.ai API Gateway** | Unified zero-setup API hub providing dynamic model routing to **Claude 3.7 Sonnet** and **GPT-4o**. |
| **Backend Runtime** | **Node.js + Express** | High-throughput REST & Event-Driven API server hosting native tool execution. |
| **Frontend UI** | **React + Vite** | Cosmic glassmorphism conversational workspace with interactive HITL review cards. |

---

## 🏗️ Execution Architecture & State Graph

```
                     [ USER TASK PROMPT ]
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │       1. AGENTIC RETRIEVAL PIPELINE          │
        │  • Dense Vector + Sparse BM25 Search         │
        │  • Cross-Encoder Document Reranker           │
        │  • Critic Node (Sufficiency & Reformulation) │
        └──────────────────────┬───────────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │          2. ReAct REASONING LOOP             │
        │  • Thought: Multi-constraint policy check    │
        │  • Action: Live web search & portal query    │
        │  • Observation: Parse structured results     │
        │  • Self-Healing: Error retry & query tweak   │
        └──────────────────────┬───────────────────────┘
                               │
                Encounter Irreversible Action?
                               │
               ┌───────────────┴───────────────┐
               │ YES                           │ NO
               ▼                               ▼
      [ TRIGGER INTERRUPT ]              [ CALL TOOL ]
               │                         (Fill next field)
               ▼
     Freeze State Graph & Log
               │
               ▼
   Yield Control to Human Operator
   (Interactive Review Card in UI)
               │
    [ Human Reviews & Authorizes ]
      "Complete Payment (₹4,680)"
               │
               ▼
    [ RESUME STATE EXECUTION ]
     • Dispatch payment commit tool
     • Mint PNR reference code
     • Persist signed E-Ticket artifact
```

---

## 🧪 Implementation Plan & Edge-Case Scenarios

ReactAI is designed to withstand 4 complex real-world edge cases:

### Scenario 1: The Transactional Boundary Test (Flight Booking)
* **Challenge:** Multi-step funnel navigation with upsell traps.
* **Resolution:** The agent independently filters flights, selects dates, rejects upsells (insurance/seats), and fills passenger data. Upon reaching *"Submit Payment"*, it emits a state graph `INTERRUPT`, halts execution, and displays an approval card with 5 verified constraint badges.

### Scenario 2: Dynamic Element Ambiguity & "Distractor" Buttons
* **Challenge:** Third-party Express Checkout buttons (PayPal, Apple Pay) and promotional newsletter popups.
* **Resolution:** Semantic DOM parsing targets canonical `aria-label` and `button[type="submit"]` elements, ignoring ad banners and iframe overlays.

### Scenario 3: Broken Path & Self-Healing Loop
* **Challenge:** HTTP `404 Not Found` or `ElementNotInteractable` exceptions.
* **Resolution:** The critic node captures the stack trace in its scratchpad, reformulates the search query, switches to alternative mirrors/engines, and resumes progress without crashing.

### Scenario 4: Multi-Constraint Validation
* **Challenge:** Simultaneous conflicting constraints (e.g. `< ₹6,000`, direct route, specific date, baggage included, free cancellation).
* **Resolution:** The agent validates all constraints in memory and performs a pre-flight assertion check before presenting the review screen to prevent selecting non-refundable tiers.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ananyak620/ReactAI.git
   cd ReactAI
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
   # Add your ANAKIN_API_KEY (optional - defaults to offline demo mode)
   ```

4. **Build & Launch:**
   ```bash
   # Build the production frontend
   npm --prefix client run build

   # Start the unified full-stack server
   npm start
   ```

5. **Open in Browser:**
   Navigate to: **[http://localhost:5000](http://localhost:5000)** (or dev mode at `http://localhost:5173`)

---

## 📁 Repository Structure

```
ReactAI/
├── client/                      # React + Vite Frontend
│   ├── public/                  # Static assets (galaxy wallpaper)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArchitectureGuide.jsx   # Principles modal
│   │   │   └── SettingsModal.jsx       # Model & provider settings
│   │   ├── App.jsx                     # Conversational workspace & HITL cards
│   │   └── index.css                   # Cosmic glassmorphism design system
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Autonomous Backend & Agent Loop
│   ├── agent/
│   │   ├── chatAgent.js         # Conversational agent & HITL boundary controller
│   │   ├── ragEngine.js         # 4-Layer Agentic RAG (BM25, Reranker, Auditor)
│   │   └── reactLoop.js         # LangGraph state graph execution loop
│   ├── tools/
│   │   ├── anakinGateway.js     # Anakin.ai multi-model gateway client
│   │   ├── bookingTools.js      # Flight search & PNR reservation tool
│   │   ├── fileTools.js         # Artifact persistence to workspace_outputs/
│   │   ├── newsTools.js         # Real-time news synthesizer
│   │   ├── productTools.js      # Multi-platform e-commerce comparison
│   │   ├── registry.js          # Typed tool declarations & schema
│   │   ├── restaurantTools.js   # Dining reservation tool
│   │   ├── webReader.js         # DOM content parser & scraper
│   │   └── webSearch.js         # Web search provider
│   ├── index.js                 # Express server & API endpoints
│   └── package.json
│
├── workspace_outputs/           # Persistent artifacts (E-Tickets, comparison reports)
├── .gitignore                   # Excludes node_modules, .env, and build artifacts
├── package.json                 # Root run scripts
└── README.md                    # Project documentation
```

---

## 🛡️ License

MIT License. Engineered for autonomous agent workflows with human safety boundaries.
