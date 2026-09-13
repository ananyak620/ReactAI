# ReactAI

An autonomous AI agent that takes a user statement, searches live web portals, cross-references dates, prices, and constraints, and executes real-world actions (flight reservations, product price comparisons, live news briefings, table bookings) without requiring human clicking.

For high-risk actions like payment confirmation, the agent halts at a **Human-in-the-Loop (HITL)** boundary to let the user review and authorize before committing the transaction.

---

## What It Does

* **Autonomous Flight Booking:** Searches airline portals for the best fare matching your date, route, and budget limit. Pre-fills passenger details, verifies luggage and cancellation policies, and stops at the final payment screen for your authorization before booking and generating your e-ticket.
* **E-Commerce Price Comparison:** Scrapes and compares laptop/product prices and specs across Flipkart, Amazon, and Croma to find the verified best deal.
* **Live Web Intelligence:** Fetches real-time breaking news and summarizes global events with live source attribution.
* **Table & Dining Reservations:** Finds available slots matching party size, date, and cuisine, pre-reserving your booking.
* **Human-in-the-Loop Safety:** Handles 95% of the data search and form entry labor autonomously, but passes the final 5% payment step to you for safety.

---

## Quick Start

### 1. Install Dependencies
```bash
# Backend dependencies
npm install --prefix server

# Frontend dependencies
npm install --prefix client
```

### 2. Run the Application
```bash
# Build frontend production bundle
npm --prefix client run build

# Start the full-stack server
npm start
```

Open **[http://localhost:5000](http://localhost:5000)** in your browser.

---

## Tech Stack

* **Frontend:** React, Vite, Lucide Icons, Vanilla CSS (Cosmic Glassmorphic Theme)
* **Backend:** Node.js, Express
* **Agent Architecture:** ReAct Loop (Read, Reason, Act) with Human-in-the-Loop Boundary Gating

---

## License

MIT
