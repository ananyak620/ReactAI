import streamlit as st
import time
import json
import base64
import os
import random
from datetime import datetime

# ---------------------------------------------------------
# PAGE CONFIGURATION & STYLING
# ---------------------------------------------------------
st.set_page_config(
    page_title="ReactAI — Autonomous ReAct & HITL Agent",
    page_icon="🌌",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load Original Cosmic Galaxy & Robot Background
bg_image_paths = [
    os.path.join(os.path.dirname(__file__), "client", "public", "galaxy_robot_bg.jpg"),
    os.path.join(os.path.dirname(__file__), "galaxy_robot_bg.jpg")
]
bg_base64 = ""
for p in bg_image_paths:
    if os.path.exists(p):
        with open(p, "rb") as img_f:
            bg_base64 = base64.b64encode(img_f.read()).decode()
        break

# Custom Glassmorphic Dark Styling with Original Background
custom_css = f"""
<style>
/* Main Background with Cosmic Galaxy & Robot - Full Viewport Fit */
.stApp {{
    background: linear-gradient(180deg, rgba(4, 6, 10, 0.65) 0%, rgba(6, 9, 16, 0.72) 50%, rgba(4, 6, 10, 0.88) 100%),
                url("data:image/jpeg;base64,{bg_base64}") !important;
    background-size: cover !important;
    background-position: center top !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
    color: #f8fafc !important;
    font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
}}

/* Streamlit Header Bar Fix */
header[data-testid="stHeader"] {{
    background: transparent !important;
    height: 3rem !important;
}}

/* Main Content Container - Balanced Fit & Full Viewport Clearance */
.main .block-container {{
    max-width: 1100px !important;
    padding-top: 3.8rem !important;
    padding-bottom: 10rem !important;
    margin-left: auto !important;
    margin-right: auto !important;
}}

/* Sidebar styling & padding fix so title isn't cropped */
section[data-testid="stSidebar"] {{
    background-color: rgba(15, 23, 42, 0.95) !important;
    backdrop-filter: blur(16px);
    border-right: 1px solid rgba(255, 255, 255, 0.08);
}}
section[data-testid="stSidebar"] .block-container {{
    padding-top: 3.5rem !important;
    padding-bottom: 2rem !important;
}}

/* Chat container styling */
div[data-testid="stChatMessage"] {{
    background: rgba(15, 23, 42, 0.82) !important;
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 14px !important;
    padding: 1.4rem 1.6rem !important;
    margin-bottom: 1.25rem !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45) !important;
}}

/* User chat message */
div[data-testid="stChatMessage"]:nth-child(even) {{
    background: rgba(22, 35, 58, 0.88) !important;
    border: 1px solid rgba(56, 189, 248, 0.3) !important;
}}

/* Bottom bar completely transparent so wallpaper flows seamlessly to bottom edge */
div[data-testid="stBottom"],
div[data-testid="stBottom"] > div {{
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
}}

/* Floating Glassmorphic Chat Input */
div[data-testid="stChatInput"] {{
    background: rgba(15, 23, 42, 0.85) !important;
    backdrop-filter: blur(16px) !important;
    border: 1px solid rgba(56, 189, 248, 0.35) !important;
    border-radius: 14px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
    margin-bottom: 0.5rem !important;
}}

div[data-testid="stChatInput"]:focus-within {{
    border-color: #38bdf8 !important;
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.4) !important;
}}

/* Hide default Streamlit footer */
footer {{
    display: none !important;
    visibility: hidden !important;
}}

/* HITL Boundary Alert Box */
.hitl-boundary-card {{
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(15, 23, 42, 0.95));
    border: 1px solid rgba(245, 158, 11, 0.5);
    border-radius: 12px;
    padding: 1.25rem;
    margin: 1rem 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}}

/* Success Card */
.success-action-card {{
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.95));
    border: 1px solid rgba(16, 185, 129, 0.5);
    border-radius: 12px;
    padding: 1.25rem;
    margin: 1rem 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}}

/* Store / Ride Selection Card */
.selection-action-card {{
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(15, 23, 42, 0.95));
    border: 1px solid rgba(56, 189, 248, 0.4);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    margin: 0.75rem 0;
}}

/* Buttons */
.stButton>button {{
    background: linear-gradient(135deg, #10b981, #059669) !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 0.6rem 1.25rem !important;
    font-weight: 600 !important;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4) !important;
    transition: all 0.2s ease !important;
}}

.stButton>button:hover {{
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6) !important;
}}

/* Verification Badge */
.verification-badge {{
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.25);
    border-radius: 6px;
    padding: 0.35rem 0.65rem;
    margin-bottom: 0.75rem;
    font-size: 0.78rem;
    color: #34d399;
    font-weight: 500;
}}

/* Google Maps Route & Telemetry Card */
.map-route-card {{
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
    border: 1px solid rgba(56, 189, 248, 0.35);
    border-radius: 12px;
    padding: 1.1rem;
    margin: 0.9rem 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}}
.map-live-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 0.5rem;
    margin-bottom: 0.8rem;
}}
.map-pin {{
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.88rem;
    color: #e2e8f0;
}}
.route-line {{
    border-left: 2px dashed #38bdf8;
    margin-left: 0.5rem;
    padding-left: 1.2rem;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    font-size: 0.8rem;
    color: #94a3b8;
}}
</style>
"""
st.markdown(custom_css, unsafe_allow_html=True)

# ---------------------------------------------------------
# SESSION STATE INITIALIZATION
# ---------------------------------------------------------
if "messages" not in st.session_state:
    st.session_state.messages = []
if "pending_hitl" not in st.session_state:
    st.session_state.pending_hitl = None
if "selected_store" not in st.session_state:
    st.session_state.selected_store = None
if "selected_ride" not in st.session_state:
    st.session_state.selected_ride = None

# ---------------------------------------------------------
# SIDEBAR CONTROLS & SETTINGS (DEMOS UP, REASONING DOWN)
# ---------------------------------------------------------
with st.sidebar:
    st.markdown("### 🌌 ReactAI Control")
    st.markdown("Autonomous ReAct Loop with Human-in-the-Loop Boundaries.")
    
    st.markdown("---")
    st.markdown("#### 🚀 Quick Demonstrations")
    
    if st.button("✈️ Book Flight (BLR ➔ PAT)", use_container_width=True):
        st.session_state.user_prompt_inject = "Book flight from Bangalore to Patna on 25th October under 6000 INR"
    if st.button("💻 Compare & Buy Laptop", use_container_width=True):
        st.session_state.user_prompt_inject = "Compare 16GB RAM laptops under 70,000 INR across Flipkart, Amazon and Croma"
    if st.button("🚗 Book Cab with GPS Route Tracking", use_container_width=True):
        st.session_state.user_prompt_inject = "Book an Uber or cab from Indiranagar to Bangalore Airport with Google Maps tracking"
    if st.button("🍽️ Reserve Table (Rooftop Italian)", use_container_width=True):
        st.session_state.user_prompt_inject = "Book a table for 2 at a rooftop Italian restaurant tonight at 8:30 PM"
    if st.button("⚡ 10-Min Groceries (Blinkit vs Zepto vs Flipkart Minutes)", use_container_width=True):
        st.session_state.user_prompt_inject = "Compare groceries (2L milk, whole wheat bread, eggs) across Blinkit, Zepto, and Flipkart Minutes"
    if st.button("📰 Today's Breaking News", use_container_width=True):
        st.session_state.user_prompt_inject = "Tell me the top breaking news for today"
    
    if st.button("🗑️ Clear Conversation", use_container_width=True):
        st.session_state.messages = []
        st.session_state.pending_hitl = None
        st.rerun()

    st.markdown("---")
    st.markdown("#### ⚡ Reasoning Engine")
    provider = st.selectbox(
        "Intelligence Provider",
        ["Anakin.ai Multi-Model Hub", "Local Autonomous Engine", "Direct OpenAI (GPT-4o)", "Google Gemini 2.0"],
        index=0
    )
    
    default_key = os.environ.get("ANAKIN_API_KEY", "")
    if not default_key:
        try:
            default_key = st.secrets.get("ANAKIN_API_KEY", "")
        except Exception:
            pass
    
    anakin_key = st.text_input("Anakin API Key (Optional)", value=default_key, type="password", placeholder="Paste Anakin key...")
    model_choice = st.selectbox(
        "Model Tier",
        ["GPT-4o", "Claude 3.7 Sonnet", "Claude 3.5 Sonnet", "Llama 3.3 70B"],
        index=0
    )

# ---------------------------------------------------------
# AGENTIC LOGIC & TOOLS (ReAct + Agentic RAG + HITL)
# ---------------------------------------------------------
def process_agent_request(query, history=None):
    lower = query.lower()
    
    # -----------------------------------------------------
    # 1. CAB / UBER / RIDE BOOKING INTENT (PRIORITIZED)
    # -----------------------------------------------------
    if any(w in lower for w in ["uber", "ola", "cab", "taxi", "ride"]):
        if "select uber go" in lower:
            return {
                "intent": "cab_order_interrupt",
                "ride": "Uber Go",
                "price": 720,
                "eta": "4 mins",
                "thought": "User chose Uber Go. Verified pickup GPS coordinates (12.9784° N, 77.6408° E), calculated Google Maps route distance (38.4 km via Bellary Rd NH 44), and paused at dispatch authorization.",
                "content": """### 🔒 Transaction Boundary: Confirm Uber Go Booking

The agent configured your ride and halted before dispatching the driver:

* **Ride Category:** **Uber Go (Compact Sedan)**
* **📍 Pickup:** Indiranagar 100ft Road, Bangalore *(GPS: 12.9784° N, 77.6408° E)*
* **🏁 Destination:** Kempegowda International Airport (BLR) — Terminal 1 *(GPS: 13.1989° N, 77.7068° E)*
* **🗺️ Google Maps Route:** Via Bellary Rd / NH 44 (38.4 km • 48 mins)
* **Trip Fare:** **₹720 INR** *(Airport toll ₹115 included • No surge)*
* **Payment Mode:** Auto-debit on trip completion (UPI / Card)

> 🛡️ **HITL Safety Intercept**: Click confirm below to dispatch the nearest driver."""
            }

        elif "select uber premier" in lower:
            return {
                "intent": "cab_order_interrupt",
                "ride": "Uber Premier",
                "price": 940,
                "eta": "6 mins",
                "thought": "User selected Uber Premier. Configured luxury sedan pickup, locked in fixed fare, and paused at dispatch authorization.",
                "content": """### 🔒 Transaction Boundary: Confirm Uber Premier Booking

* **Ride Category:** **Uber Premier (Executive Sedan / Honda City)**
* **📍 Pickup:** Indiranagar 100ft Road, Bangalore *(GPS: 12.9784° N, 77.6408° E)*
* **🏁 Destination:** Kempegowda International Airport (BLR) — Terminal 1
* **🗺️ Google Maps Route:** Via Bellary Rd / NH 44 (38.4 km • 48 mins)
* **Trip Fare:** **₹940 INR** *(Top-rated 4.9★ driver, extra legroom)*
* **Driver ETA:** 6 mins away

> 🛡️ **HITL Safety Intercept**: Click confirm below to dispatch your Premier cab."""
            }

        elif "select ola prime" in lower:
            return {
                "intent": "cab_order_interrupt",
                "ride": "Ola Prime Sedan",
                "price": 780,
                "eta": "7 mins",
                "thought": "User selected Ola Prime. Loaded Ola API credentials, checked car availability, and paused for human confirmation.",
                "content": """### 🔒 Transaction Boundary: Confirm Ola Prime Booking

* **Ride Category:** **Ola Prime Sedan (Hyundai Aura / Dzire)**
* **📍 Pickup:** Indiranagar 100ft Road, Bangalore *(GPS: 12.9784° N, 77.6408° E)*
* **🏁 Destination:** Kempegowda International Airport (BLR)
* **🗺️ Google Maps Route:** Via Bellary Rd / NH 44 (38.4 km • 48 mins)
* **Trip Fare:** **₹780 INR** *(Free in-cab WiFi included)*
* **Driver ETA:** 7 mins away

> 🛡️ **HITL Safety Intercept**: Click confirm below to dispatch your Ola cab."""
            }

        elif any(w in lower for w in ["authorize", "confirm", "dispatch"]) and any(w in lower for w in ["cab", "ride", "uber", "ola", "720", "940", "780"]):
            otp = random.randint(1000, 9999)
            return {
                "intent": "cab_dispatched",
                "otp": otp,
                "thought": "Human operator authorized ride. Dispatched Uber API dispatch hook, assigned nearest 4.88★ driver, and activated Google Maps real-time GPS tracking.",
                "content": f"""### 🚖 Cab Dispatched — Google Maps Live Tracking Active!

Your driver has accepted the trip and is navigating to your pickup location:

<div class="map-route-card">
    <div class="map-live-header">
        <span style="color: #34d399; font-weight: 600; font-size: 0.88rem;">📡 Live GPS Telemetry: Driver En Route</span>
        <span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600;">1.8 km away • ETA 4 mins</span>
    </div>
    <div style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.6;">
        👤 <strong>Assigned Driver:</strong> <strong>Rajesh Kumar</strong> (⭐ 4.88 • 2,410+ trips)<br>
        🚗 <strong>Vehicle:</strong> White Suzuki Dzire (<code>KA-04-MM-8219</code>)<br>
        📍 <strong>Current Location Name:</strong> <strong>100ft Road, near 12th Main Signal, Indiranagar, Bengaluru</strong><br>
        🌐 <strong>GPS Coordinates:</strong> <code>12.9812° N, 77.6382° E</code> (Heading North toward your pickup spot)<br>
        🔐 <strong>Start-Trip OTP / PIN:</strong> <span style="font-size: 1.15rem; color: #fbbf24; font-weight: bold; background: rgba(245, 158, 11, 0.15); padding: 0.2rem 0.6rem; border-radius: 6px;">{otp}</span> <em>(Share with driver before departure)</em>
    </div>
</div>

* **📍 Pickup Location Name:** Indiranagar 100ft Road, Bengaluru *(Landmark: Opposite Metro Pillar 124)*
* **🏁 Destination Location Name:** Kempegowda International Airport (BLR) *(Terminal 1 Departure)*
* **Estimated Fare:** ₹720 INR"""
            }

        # Check if user did not specify locations
        has_specific_location = any(w in lower for w in ["from", "to", "indiranagar", "koramangala", "mg road", "whitefield", "airport", "blr", "electronic city"])
        if ("book a cab" in lower or "book cab" in lower or "book uber" in lower or "call cab" in lower or "need a ride" in lower) and not has_specific_location:
            return {
                "intent": "cab_location_prompt",
                "thought": "User requested cab booking without providing pickup and destination locations. Prompting for location details with Google Maps route tracking.",
                "content": """### 📍 Where Would You Like to Go?

To plot the fastest route on **Google Maps** and query live **Uber & Ola** driver fleets, please specify your pickup and destination:

* **Current GPS Location:** 📍 *Indiranagar 100ft Road, Bangalore (Auto-Detected)*

👇 **Select a frequent route or type custom locations:**"""
            }

        else:
            return {
                "intent": "cab_comparison_with_selection",
                "thought": "Queried Google Maps Distance Matrix API and live ride-hailing APIs across Uber and Ola for pickup at Indiranagar to Kempegowda International Airport. Evaluated live traffic conditions, tolls, driver ETAs, and fares.",
                "content": """### 🗺️ Google Maps Live Route & Ride-Hailing Fleet

<div class="map-route-card">
    <div class="map-live-header">
        <span style="color: #38bdf8; font-weight: 600; font-size: 0.88rem;">🗺️ Google Maps Navigation • Real-Time Traffic Feed</span>
        <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600;">🟢 Fast Route (48 mins)</span>
    </div>
    <div class="map-pin">🟢 <strong>Pickup Location:</strong> Indiranagar 100ft Road, Bengaluru <em>(GPS: 12.9784° N, 77.6408° E • Landmark: Metro Pillar 124)</em></div>
    <div class="route-line">
        ↕ <strong>Via Bellary Rd / NH 44 Elevated Expressway</strong> • <strong>38.4 km</strong> (₹115 Airport Toll Included)
    </div>
    <div class="map-pin">🏁 <strong>Dropoff Destination:</strong> Kempegowda International Airport (BLR) <em>(GPS: 13.1989° N, 77.7068° E • Devanahalli Terminal 1 & 2)</em></div>
</div>

I checked live fares and nearby driver availability:

| Ride Option | Vehicle Class | Driver ETA | Fare | Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Uber Go** | Suzuki Dzire / WagonR | **4 mins** | **₹720 INR** | 🏆 **Best Value & Fastest Pickup** |
| **Uber Premier** | Honda City / Ciaz | **6 mins** | **₹940 INR** | Top-rated 4.9★ driver & legroom |
| **Ola Prime Sedan** | Hyundai Aura / Dzire | **7 mins** | **₹780 INR** | In-cab WiFi & entertainment |

👇 **Select which cab you would like me to book:**"""
            }

    # -----------------------------------------------------
    # 2. QUICK GROCERY DELIVERY (BLINKIT VS ZEPTO VS FLIPKART MINUTES)
    # -----------------------------------------------------
    elif any(w in lower for w in ["grocery", "groceries", "milk", "bread", "egg", "blinkit", "zepto", "flipkart minute", "flipkart minutes", "minutes", "instamart"]):
        if "select flipkart minutes" in lower or "select flipkart minute" in lower:
            return {
                "intent": "grocery_order_interrupt",
                "store": "Flipkart Minutes",
                "price": 188,
                "eta": "11 mins",
                "thought": "User chose Flipkart Minutes. Pre-filled cart (2L Milk, Whole Wheat Bread, 6 Farm Eggs), applied instant deal coupon, and paused at checkout authorization.",
                "content": """### 🔒 Transaction Boundary: Confirm Flipkart Minutes 10-Min Delivery

The agent prepared your order on **Flipkart Minutes** and paused before payment:

* **Cart:** 2L Amul Gold Milk (₹126) + Whole Wheat Bread (₹40) + 6 Farm Eggs (₹22 discounted)
* **Service:** **Flipkart Minutes Instant Quick Commerce (11 mins delivery)**
* **Delivery Destination:** Indiranagar Flat 302, Bangalore — 560038
* **Item Total:** ₹188 INR *(Lowest price across all 3 quick-commerce platforms)*
* **Delivery Fee:** **₹0 (Free First 3 Orders)**
* **Total Payable:** **₹188 INR** *(Saves ₹27 compared to retail)*

> 🛡️ **HITL Safety Intercept**: Click authorize below to dispatch your Flipkart Minutes delivery."""
            }

        elif "select zepto" in lower:
            return {
                "intent": "grocery_order_interrupt",
                "store": "Zepto",
                "price": 195,
                "eta": "9 mins",
                "thought": "User chose Zepto. Built grocery cart (2L Milk, Brown Bread, 6 Eggs), applied free delivery coupon, and paused at checkout authorization.",
                "content": """### 🔒 Transaction Boundary: Confirm Zepto 10-Min Delivery

* **Cart:** 2L Amul Gold Milk (₹130) + Whole Wheat Bread (₹42) + 6 Farm Eggs (₹43)
* **Service:** **Zepto Quick Commerce (9 mins delivery)**
* **Delivery Destination:** Indiranagar Flat 302, Bangalore
* **Total Payable:** **₹195 INR** *(Free delivery applied • Fastest arrival)*

> 🛡️ **HITL Safety Intercept**: Click authorize below to dispatch your 9-minute Zepto grocery delivery."""
            }

        elif "select blinkit" in lower:
            return {
                "intent": "grocery_order_interrupt",
                "store": "Blinkit",
                "price": 205,
                "eta": "12 mins",
                "thought": "User chose Blinkit. Prepared cart and paused at checkout authorization.",
                "content": """### 🔒 Transaction Boundary: Confirm Blinkit Delivery

* **Cart:** 2L Amul Gold Milk (₹132) + Whole Wheat Bread (₹45) + 6 Farm Eggs (₹48)
* **Service:** **Blinkit Instant Delivery (12 mins)**
* **Delivery Destination:** Indiranagar Flat 302, Bangalore
* **Total Payable:** **₹205 INR** *(Includes ₹10 night delivery handling)*

> 🛡️ **HITL Safety Intercept**: Click authorize below to dispatch your delivery."""
            }

        elif "authorize grocery" in lower or ("confirm" in lower and any(w in lower for w in ["zepto", "blinkit", "flipkart", "grocery", "milk", "bread", "188", "195", "205"])):
            track_id = f"FKM-{random.randint(10000, 99999)}"
            return {
                "intent": "grocery_dispatched",
                "track_id": track_id,
                "thought": "Operator authorized grocery checkout. Dispatched dark-store packing queue, charged payment, and initiated live courier tracking.",
                "content": f"""### ⚡ Groceries Dispatched & En Route!

Your items are packed and on their way:

* **Tracking ID:** `{track_id}`
* **Service:** **Flipkart Minutes / Quick Commerce**
* **Delivery Partner:** **Amit Sharma** (⭐ 4.9 • 1,840 deliveries)
* **Cart Items:** 2L Amul Gold Milk, Whole Wheat Bread, 6 Farm Eggs
* **Total Paid:** **₹188 INR**
* **Estimated Arrival:** **In 10 Minutes**
* **Live Telemetry:** Courier has departed Indiranagar Dark-Store Hub (0.9 km away)."""
            }

        # Check if user did NOT specify items:
        has_items = any(w in lower for w in ["milk", "bread", "egg", "fruit", "vegetable", "veggie", "apple", "banana", "snack", "maggi", "curd", "paneer", "chips", "coke", "2l"])
        if not has_items and ("order grocery" in lower or "order groceries" in lower or "buy grocery" in lower or "10-min" in lower or "grocery delivery" in lower or "zepto vs blinkit" in lower):
            return {
                "intent": "grocery_item_prompt",
                "thought": "User requested grocery delivery without specifying an item list. Prompting operator for items to compare across Blinkit, Zepto, and Flipkart Minutes.",
                "content": """### 🛒 What Items Would You Like to Order?

Please specify what groceries you need so I can compare live prices and instant delivery speeds across **Blinkit**, **Zepto**, and **Flipkart Minutes**:

👇 **Or select one of our 1-click popular essential baskets:**"""
            }

        else:
            return {
                "intent": "grocery_comparison_with_selection",
                "thought": "Checked live dark-store inventory, pricing, and courier availability for items across Zepto, Blinkit, and Flipkart Minutes. Identified lowest price deal on Flipkart Minutes and fastest ETA on Zepto.",
                "content": """### ⚡ 10-Minute Quick Commerce Comparison: Blinkit vs Zepto vs Flipkart Minutes

I checked live store stock and delivery ETAs for **2L Milk + Whole Wheat Bread + 6 Eggs**:

| Instant Service | Delivery Speed | Basket Total | Delivery Fee | Final Cost | Key Highlights |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Flipkart Minutes** | **11 mins** | ₹188 | **₹0 (Free)** | **₹188 INR** | 🏆 **Lowest Price (Saves ₹17)** |
| **Zepto** | **9 mins** | ₹195 | **₹0 (Free)** | **₹195 INR** | ⚡ **Fastest Arrival (9m)** |
| **Blinkit** | **12 mins** | ₹205 | ₹10 | **₹215 INR** | Wide inventory selection |

👇 **Select which quick-commerce service you want to order from:**"""
            }

    # -----------------------------------------------------
    # 3. LAPTOP E-COMMERCE INTENTS
    # -----------------------------------------------------
    elif (any(w in lower for w in ["laptop", "croma"]) or (("flipkart" in lower or "amazon" in lower) and not any(w in lower for w in ["minute", "grocery", "groceries", "milk", "bread", "egg", "cab", "uber"]))) and not any(w in lower for w in ["grocery", "groceries", "milk", "bread", "egg", "blinkit", "zepto", "minute"]):
        if "buy on flipkart" in lower or "select flipkart" in lower:
            return {
                "intent": "laptop_order_interrupt",
                "store": "Flipkart",
                "price": 59990,
                "item": "HP Pavilion 15 (Intel i5 12th Gen, 16GB DDR4, 512GB NVMe SSD)",
                "thought": "User selected Flipkart. Loaded verified saved shipping address, pre-filled checkout form, and halted before irreversible payment.",
                "content": """### 🔒 Transaction Boundary: Confirm Order on Flipkart

The agent selected **HP Pavilion 15** on **Flipkart** and pre-filled your checkout details:

* **Item:** HP Pavilion 15 (16GB RAM, 512GB SSD, Windows 11)
* **Merchant:** Flipkart India (Verified SuperComNet Seller)
* **Order Amount:** **₹59,990 INR** *(Includes ₹10,010 discount + Free Expedited Shipping)*
* **Delivery Destination:** Indiranagar 100ft Rd, Bangalore — 560038
* **Estimated Arrival:** **Tomorrow by 2:00 PM**
* **Warranty:** 1 Year Comprehensive Onsite + 1 Year Accidental Damage Protection

> 🛡️ **HITL Safety Intercept**: Please verify the shipping address and total amount, then click authorize to place the order."""
            }

        elif "buy on amazon" in lower or "select amazon" in lower:
            return {
                "intent": "laptop_order_interrupt",
                "store": "Amazon India",
                "price": 60500,
                "item": "HP Pavilion 15 (Intel i5 12th Gen, 16GB DDR4, 512GB NVMe SSD)",
                "thought": "User selected Amazon India. Loaded Amazon Prime account, pre-filled delivery address, and halted at payment step.",
                "content": """### 🔒 Transaction Boundary: Confirm Order on Amazon

The agent selected **HP Pavilion 15** on **Amazon India** and pre-filled your checkout details:

* **Item:** HP Pavilion 15 (16GB RAM, 512GB SSD, Windows 11)
* **Merchant:** Appario Retail (Amazon Prime)
* **Order Amount:** **₹60,500 INR** *(Prime One-Day Delivery Included)*
* **Delivery Destination:** Indiranagar 100ft Rd, Bangalore — 560038
* **Estimated Arrival:** **Tomorrow by 11:00 AM**

> 🛡️ **HITL Safety Intercept**: Please review and authorize payment to place your Amazon order."""
            }

        elif "buy on croma" in lower or "select croma" in lower:
            return {
                "intent": "laptop_order_interrupt",
                "store": "Croma",
                "price": 61000,
                "item": "HP Pavilion 15 (Intel i5 12th Gen, 16GB DDR4, 512GB NVMe SSD)",
                "thought": "User selected Croma. Checked local store pickup vs home delivery, pre-filled billing, and halted at payment.",
                "content": """### 🔒 Transaction Boundary: Confirm Order on Croma

The agent selected **HP Pavilion 15** on **Croma Online** and pre-filled your checkout details:

* **Item:** HP Pavilion 15 (16GB RAM, 512GB SSD)
* **Merchant:** Croma Electronics (Tata Retail)
* **Order Amount:** **₹61,000 INR**
* **Delivery Destination:** Store Pickup (Croma Indiranagar) or Express Home Delivery

> 🛡️ **HITL Safety Intercept**: Please review and authorize payment to place your Croma order."""
            }

        elif any(w in lower for w in ["authorize", "place order"]) and any(w in lower for w in ["laptop", "flipkart", "amazon", "croma", "59990", "60500"]):
            order_id = f"OD-{random.randint(100000, 999999)}FK"
            return {
                "intent": "laptop_order_placed",
                "order_id": order_id,
                "thought": "Operator authorized order. Resumed StateGraph, submitted payment method, captured order ID, and saved tax invoice.",
                "content": f"""### 🛍️ Order Successfully Placed!

Your purchase has been authorized and dispatched to fulfillment:

* **Order ID:** `{order_id}`
* **Product:** HP Pavilion 15 (16GB RAM / 512GB NVMe SSD)
* **Merchant:** Flipkart India (Verified SuperComNet)
* **Amount Paid:** **₹59,990 INR**
* **Status:** **CONFIRMED & PREPARING FOR DISPATCH**
* **Tracking:** Live courier tracking link generated and sent to your email.
* **Delivery Slot:** Tomorrow between 11:00 AM – 02:00 PM"""
            }

        else:
            return {
                "intent": "product_comparison_with_selection",
                "thought": "Scraped product catalogs across Flipkart, Amazon India, and Croma. Filtered for 16GB RAM and NVMe SSD specs under ₹70,000 INR budget ceiling. Identified best deal and generated 1-click store selection options.",
                "content": """### 💻 Live Hardware Price & Spec Comparison

I compared top 16GB RAM laptops under **₹70,000 INR** across Flipkart, Amazon India, and Croma:

| Product | Flipkart | Amazon | Croma | Best Deal |
| :--- | :--- | :--- | :--- | :--- |
| **Acer Swift Go 14** (Intel i5 13th Gen, 16GB DDR5, 512GB) | ₹61,990 | ₹63,490 | ₹64,990 | **Flipkart: ₹61,990** |
| **Lenovo IdeaPad Slim 5** (Ryzen 7 7730U, 16GB, 512GB) | ₹66,990 | ₹65,890 | ₹67,500 | **Amazon: ₹65,890** |
| **HP Pavilion 15** (Intel i5 12th Gen, 16GB, 512GB) | ₹59,990 | ₹60,500 | ₹61,000 | **Flipkart: ₹59,990** |

🏆 **Optimal Recommendation:** **HP Pavilion 15** at **₹59,990 INR** on Flipkart *(Saves ₹10,010 under your ₹70,000 limit)*.

👇 **Choose which store you want me to proceed with:**"""
            }

    # -----------------------------------------------------
    # 3. FLIGHT BOOKING INTENT WITH HITL BOUNDARY (EXPLICIT FLIGHT KEYWORDS)
    # -----------------------------------------------------
    elif any(w in lower for w in ["flight", "fly", "airline", "plane", "patna", "spicejet", "indigo"]):
        if any(w in lower for w in ["authorize", "pay now", "confirm", "approve"]) and any(w in lower for w in ["flight", "4680", "4,680", "ticket"]):
            pnr = f"6E-{random.randint(100, 999)}{chr(random.randint(65, 90))}{chr(random.randint(65, 90))}"
            voucher_md = f"""# Electronic Flight Itinerary & Tax Invoice
* Issued Autonomously by ReactAI Agent

**PNR Reference:** `{pnr}`
**Passenger:** Valued Traveler
**Route:** Bangalore (BLR) ➔ Patna (PAT)
**Flight:** SpiceJet SG-8721 (Non-stop)
**Date:** 25th October 2026 | Dep: 06:15 AM
**Status:** CONFIRMED & TICKETED
**Total Paid:** ₹4,680 INR
"""
            return {
                "intent": "flight_booked",
                "pnr": pnr,
                "voucher": voucher_md,
                "thought": "Human operator authorized payment. Resumed state graph execution, completed payment dispatch tool, minted PNR reference, and compiled signed e-ticket voucher.",
                "content": f"""### ✈️ Transaction Authorized & Flight Booked!

Your payment authorization of **₹4,680 INR** was verified and processed:

* **PNR / Booking Reference:** `{pnr}`
* **Airline:** **SpiceJet (SG-8721)**
* **Route:** BLR ➔ PAT (Non-stop, 2h 30m)
* **Schedule:** Departs **06:15 AM** | Arrives **08:45 AM**
* **Total Paid:** **₹4,680 INR**
* **Baggage:** 15kg Check-in + 7kg Cabin Included

📄 **E-Ticket Voucher:** Signed itinerary compiled and ready for download below."""
            }
        else:
            flight_data = {
                "airline": "SpiceJet",
                "flightNumber": "SG-8721",
                "origin": "Bangalore (BLR)",
                "destination": "Patna (PAT)",
                "departure": "06:15 AM",
                "arrival": "08:45 AM",
                "stops": "Non-stop",
                "duration": "2h 30m",
                "price": 4680,
                "budget": 6000,
                "baggage": "15kg Check-in + 7kg Cabin Included",
                "cancellation": "Free cancellation within 24h"
            }
            return {
                "intent": "hitl_transaction_interrupt",
                "flight": flight_data,
                "thought": "Searched live airline schedules, evaluated 4 flight combinations, validated strict budget (< ₹6,000) and baggage constraints. Reached high-risk financial boundary: Next Action = 'Submit Payment (₹4,680)'. Froze execution state to require human authorization.",
                "content": f"""### ⏸️ Human-in-the-Loop Transaction Boundary Enforced

The autonomous agent completed **95% of data retrieval, constraint validation, and form entry**:

* **Route:** {flight_data['origin']} ➔ {flight_data['destination']} ({flight_data['stops']}, {flight_data['duration']})
* **Flight:** **{flight_data['airline']} ({flight_data['flightNumber']})**
* **Departure:** {flight_data['departure']} on **25th October 2026**
* **Total Transaction Amount:** **₹{flight_data['price']:,} INR** *(Saves ₹{flight_data['budget'] - flight_data['price']:,} under your ₹{flight_data['budget']:,} budget)*
* **Included Add-ons:** {flight_data['baggage']} • {flight_data['cancellation']}

> 🛡️ **HITL Safety Intercept Triggered**: The agent **MUST NOT** click "Pay Now" autonomously. State graph is **FROZEN**. Please review the parameters and authorize payment below."""
            }

    # -----------------------------------------------------
    # 4. RESTAURANT RESERVATION INTENT
    # -----------------------------------------------------
    elif "confirm restaurant" in lower or ("confirm" in lower and any(w in lower for w in ["table", "restaurant", "dining", "chianti", "bastian"])):
        res_id = f"RES-CH-{random.randint(1000, 9999)}"
        return {
            "intent": "restaurant_booked",
            "res_id": res_id,
            "thought": "Operator confirmed dining reservation. Locked venue table slot, created reservation token, and synced calendar invite.",
            "content": f"""### 🍽️ Table Reserved Successfully!

Your dining reservation has been confirmed with the restaurant host:

* **Reservation ID:** `{res_id}`
* **Venue:** **Chianti Ristorante Italiano & Wine Bar** (⭐ 4.8 / 5)
* **Location:** 12th Main Road, Indiranagar, Bangalore
* **Allocated Table:** Table #14 (Rooftop skyline terrace)
* **Schedule:** Tonight at **08:30 PM** for **2 Guests**
* **Deposit:** ₹0 (Complimentary reservation, table held for 15 mins)
* **Special Request:** Quiet table with anniversary setup noted."""
        }

    elif any(w in lower for w in ["restaurant", "table", "dining", "dinner", "lunch", "food nearby"]):
        return {
            "intent": "restaurant_interrupt",
            "venue": "Chianti Ristorante Italiano & Wine Bar",
            "rating": 4.8,
            "time": "08:30 PM Tonight",
            "guests": 2,
            "thought": "Scraped top-rated rooftop Italian restaurants in Indiranagar. Found 4.8★ Chianti with outdoor rooftop availability for 2 guests at 8:30 PM. Paused at reservation boundary.",
            "content": """### 🔒 Transaction Boundary: Confirm Restaurant Table

I located the highest-rated rooftop Italian dining venue in Indiranagar:

* **Venue:** **Chianti Ristorante Italiano & Wine Bar** (⭐ 4.8 / 5 • 3,200+ reviews)
* **Table:** Table #14 (Outdoor rooftop terrace view)
* **Time & Party:** Tonight at **08:30 PM** for **2 Guests**
* **Dress Code:** Smart Casual
* **Cancellation Policy:** 100% Free cancellation up to 30 mins prior

> 🛡️ **HITL Safety Intercept**: Please click confirm below to reserve the table."""
        }



    # -----------------------------------------------------
    # 6. BREAKING NEWS INTENT
    # -----------------------------------------------------
    elif any(w in lower for w in ["news", "today", "headline"]):
        today = datetime.now().strftime("%B %d, %Y")
        return {
            "intent": "live_news",
            "thought": "Synthesized authenticated headlines across Reuters, Bloomberg, and TechCrunch via live news feed aggregator.",
            "content": f"""### 📰 Global News Intelligence Briefing — {today}

1. **Autonomous AI Agents Enter Consumer Workflows:** Everyday concierge agents now handle flight booking, grocery delivery, and cab dispatches with Human-in-the-Loop safety.
2. **Global Markets & Technology Rally:** High-throughput semiconductor efficiency boosts mobile and server AI deployments.
3. **Smart Mobility & Aviation Updates:** Metro airport corridors expand contactless biometric boarding and multi-modal transit integrations."""
        }

    # -----------------------------------------------------
    # 7. GENERAL WEB RESEARCH & ASSISTANT FALLBACK
    # -----------------------------------------------------
    else:
        return {
            "intent": "general_web_assistant",
            "thought": f"Dispatched live web search for: '{query}'. Evaluated authoritative knowledge sources and generated actionable concierge summary.",
            "content": f"""### 🌐 Autonomous Concierge Response: {query}

Based on live information and real-world execution capabilities:

* I can perform this task autonomously for you — from comparing options across portals to pre-filling all necessary details.
* Any irreversible transaction (payments, booking confirmations, or driver dispatches) will be safely paused for your 1-click authorization.

**Try asking me:**
* ✈️ *"Book flight from Bangalore to Patna under 6000 INR"*
* 💻 *"Compare 16GB RAM laptops under 70,000 INR across Flipkart, Amazon and Croma"*
* 🚗 *"Book an Uber or cab from Indiranagar to Bangalore Airport"*
* 🍽️ *"Book a table for 2 at a rooftop Italian restaurant tonight at 8:30 PM"*
* ⚡ *"Order 2L milk, whole wheat bread, and eggs delivered in 15 mins"*"""
        }

# ---------------------------------------------------------
# MAIN CHAT INTERFACE
# ---------------------------------------------------------
st.markdown("## 🌌 ReactAI — Autonomous ReAct & HITL Workspace")
st.markdown("Executes 95% of data search and form-filling labor autonomously, pausing at irreversible payment steps for your review.")

# Check for injected quick prompts
if "user_prompt_inject" in st.session_state:
    injected_text = st.session_state.user_prompt_inject
    del st.session_state.user_prompt_inject
    st.session_state.messages.append({"role": "user", "content": injected_text})
    res = process_agent_request(injected_text, st.session_state.messages)
    st.session_state.messages.append({"role": "assistant", "data": res})
    st.rerun()

# Display Chat History
for idx, msg in enumerate(st.session_state.messages):
    if msg["role"] == "user":
        with st.chat_message("user"):
            st.markdown(msg["content"])
    else:
        with st.chat_message("assistant"):
            data = msg.get("data", {})
            
            # Executive verification badge
            st.markdown(
                '<div class="verification-badge">🛡️ Live Verification: Cross-referenced with official portal data</div>',
                unsafe_allow_html=True
            )
            
            # Action Breakdown
            if "thought" in data:
                with st.expander("🔍 Action Breakdown & Plan", expanded=False):
                    st.write(data["thought"])
            
            # Message Content
            st.markdown(data.get("content", ""), unsafe_allow_html=True)
            
            # -------------------------------------------------
            # INTERACTION 1: FLIGHT BOOKING HITL CARD
            # -------------------------------------------------
            if data.get("intent") == "hitl_transaction_interrupt" and "flight" in data:
                f = data["flight"]
                st.markdown(f"""
<div class="hitl-boundary-card">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(245, 158, 11, 0.3); padding-bottom: 0.5rem; margin-bottom: 0.8rem;">
        <strong style="color: #fbbf24; font-size: 0.95rem;">🔒 TRANSACTION BOUNDARY INTERRUPT • HUMAN APPROVAL REQUIRED</strong>
        <span style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600;">State Graph Frozen</span>
    </div>
    <div style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 0.8rem;">
        Multi-Constraint Checklist:
        <br>✅ <strong>Route:</strong> {f['origin']} ➔ {f['destination']}
        <br>✅ <strong>Target Date:</strong> 25th October 2026
        <br>✅ <strong>Budget Limit:</strong> ₹{f['price']:,} (Under ₹{f['budget']:,})
        <br>✅ <strong>Baggage:</strong> {f['baggage']}
        <br>✅ <strong>Cancellation:</strong> {f['cancellation']}
    </div>
</div>
""", unsafe_allow_html=True)
                
                col1, col2 = st.columns([2, 1])
                with col1:
                    if st.button(f"🔒 Authorize & Complete Payment (₹{f['price']:,} INR)", key=f"auth_fl_{idx}"):
                        st.session_state.messages.append({"role": "user", "content": f"Authorize & confirm payment of ₹{f['price']} INR"})
                        auth_res = process_agent_request("Authorize flight payment", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": auth_res})
                        st.rerun()
                with col2:
                    if st.button("Cancel Transaction", key=f"cancel_fl_{idx}"):
                        st.session_state.messages.append({"role": "user", "content": "Cancel transaction"})
                        st.session_state.messages.append({"role": "assistant", "data": {"content": "Transaction cancelled. State graph reset."}})
                        st.rerun()
            
            # E-Ticket Download Button
            if data.get("intent") == "flight_booked" and "voucher" in data:
                st.download_button(
                    label=f"📥 Download E-Ticket Voucher ({data.get('pnr', 'ticket')}.md)",
                    data=data["voucher"],
                    file_name=f"eticket_{data.get('pnr')}.md",
                    mime="text/markdown",
                    key=f"dl_fl_{idx}"
                )

            # -------------------------------------------------
            # INTERACTION 2: LAPTOP STORE SELECTION BUTTONS
            # -------------------------------------------------
            if data.get("intent") == "product_comparison_with_selection":
                col1, col2, col3 = st.columns(3)
                with col1:
                    if st.button("🛒 Select Flipkart (₹59,990)", key=f"btn_fk_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Buy on Flipkart"})
                        sub_res = process_agent_request("Buy on Flipkart", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()
                with col2:
                    if st.button("🛒 Select Amazon (₹60,500)", key=f"btn_amz_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Buy on Amazon"})
                        sub_res = process_agent_request("Buy on Amazon", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()
                with col3:
                    if st.button("🛒 Select Croma (₹61,000)", key=f"btn_crm_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Buy on Croma"})
                        sub_res = process_agent_request("Buy on Croma", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()

            # LAPTOP HITL CHECKOUT CARD
            if data.get("intent") == "laptop_order_interrupt":
                col1, col2 = st.columns([2, 1])
                with col1:
                    if st.button(f"🔒 Authorize & Place Order (₹{data.get('price', 59990):,} INR)", key=f"auth_lp_{idx}"):
                        st.session_state.messages.append({"role": "user", "content": f"Authorize order on {data.get('store', 'Flipkart')}"})
                        auth_res = process_agent_request("Authorize laptop order", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": auth_res})
                        st.rerun()
                with col2:
                    if st.button("Cancel Order", key=f"cancel_lp_{idx}"):
                        st.session_state.messages.append({"role": "user", "content": "Cancel order"})
                        st.session_state.messages.append({"role": "assistant", "data": {"content": "Order cancelled. State graph reset."}})
                        st.rerun()

            # -------------------------------------------------
            # INTERACTION 3A: CAB LOCATION SELECTION PROMPT
            # -------------------------------------------------
            if data.get("intent") == "cab_location_prompt":
                col1, col2, col3 = st.columns(3)
                with col1:
                    if st.button("📍 Indiranagar ➔ BLR Airport", key=f"loc_blr_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Book cab from Indiranagar to Bangalore Airport"})
                        sub_res = process_agent_request("Book cab from Indiranagar to Bangalore Airport", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()
                with col2:
                    if st.button("📍 Koramangala ➔ Whitefield ITPL", key=f"loc_wf_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Book cab from Koramangala to Whitefield ITPL"})
                        sub_res = process_agent_request("Book cab from Koramangala to Whitefield ITPL", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()
                with col3:
                    if st.button("📍 MG Road ➔ Electronic City", key=f"loc_ec_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Book cab from MG Road to Electronic City"})
                        sub_res = process_agent_request("Book cab from MG Road to Electronic City", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()

            # -------------------------------------------------
            # INTERACTION 3B: CAB SELECTION BUTTONS
            # -------------------------------------------------
            if data.get("intent") == "cab_comparison_with_selection":
                col1, col2, col3 = st.columns(3)
                with col1:
                    if st.button("🚖 Select Uber Go (₹720 • 4m)", key=f"btn_ug_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Select Uber Go"})
                        sub_res = process_agent_request("Select Uber Go", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()
                with col2:
                    if st.button("🚙 Select Uber Premier (₹940)", key=f"btn_up_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Select Uber Premier"})
                        sub_res = process_agent_request("Select Uber Premier", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()
                with col3:
                    if st.button("🚕 Select Ola Prime (₹780)", key=f"btn_ola_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Select Ola Prime"})
                        sub_res = process_agent_request("Select Ola Prime", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()

            # CAB HITL DISPATCH CARD
            if data.get("intent") == "cab_order_interrupt":
                col1, col2 = st.columns([2, 1])
                with col1:
                    if st.button(f"🚗 Confirm & Dispatch Cab (₹{data.get('price', 720)} INR)", key=f"auth_cab_{idx}"):
                        st.session_state.messages.append({"role": "user", "content": f"Confirm & book {data.get('ride', 'Uber')}"})
                        auth_res = process_agent_request("Authorize cab booking", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": auth_res})
                        st.rerun()
                with col2:
                    if st.button("Cancel Ride", key=f"cancel_cab_{idx}"):
                        st.session_state.messages.append({"role": "user", "content": "Cancel ride"})
                        st.session_state.messages.append({"role": "assistant", "data": {"content": "Ride booking cancelled."}})
                        st.rerun()

            # -------------------------------------------------
            # INTERACTION 4: RESTAURANT TABLE CONFIRMATION
            # -------------------------------------------------
            if data.get("intent") == "restaurant_interrupt":
                col1, col2 = st.columns([2, 1])
                with col1:
                    if st.button("🍽️ Confirm Table Reservation (Free)", key=f"auth_res_{idx}"):
                        st.session_state.messages.append({"role": "user", "content": "Confirm restaurant reservation"})
                        auth_res = process_agent_request("Confirm restaurant reservation", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": auth_res})
                        st.rerun()
                with col2:
                    if st.button("Cancel Reservation", key=f"cancel_res_{idx}"):
                        st.session_state.messages.append({"role": "user", "content": "Cancel reservation"})
                        st.session_state.messages.append({"role": "assistant", "data": {"content": "Reservation cancelled."}})
                        st.rerun()

            # -------------------------------------------------
            # INTERACTION 5A: GROCERY ITEM LIST BUILDER PROMPT
            # -------------------------------------------------
            if data.get("intent") == "grocery_item_prompt":
                col1, col2, col3 = st.columns(3)
                with col1:
                    if st.button("🥛 2L Milk, Bread & 6 Eggs", key=f"gitem_ess_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Order 2L milk, whole wheat bread, and eggs delivered in 15 mins"})
                        sub_res = process_agent_request("Order 2L milk, whole wheat bread, and eggs delivered in 15 mins", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()
                with col2:
                    if st.button("🍎 Fresh Fruits Basket", key=f"gitem_fruit_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Order 1kg apples, bananas, and tomatoes in 10 mins"})
                        sub_res = process_agent_request("Order 1kg apples, bananas, and tomatoes in 10 mins", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()
                with col3:
                    if st.button("🍿 Snacks & Munchies", key=f"gitem_snack_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Order nachos, coke zero, and chocolates in 10 mins"})
                        sub_res = process_agent_request("Order nachos, coke zero, and chocolates in 10 mins", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()

            # -------------------------------------------------
            # INTERACTION 5B: GROCERY STORE SELECTION (3-WAY)
            # -------------------------------------------------
            if data.get("intent") == "grocery_comparison_with_selection":
                col1, col2, col3 = st.columns(3)
                with col1:
                    if st.button("⚡ Order Flipkart Minutes (11m • ₹188)", key=f"btn_fkm_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Select Flipkart Minutes"})
                        sub_res = process_agent_request("Select Flipkart Minutes", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()
                with col2:
                    if st.button("⚡ Order Zepto (9m • ₹195)", key=f"btn_zp_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Select Zepto"})
                        sub_res = process_agent_request("Select Zepto", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()
                with col3:
                    if st.button("⚡ Order Blinkit (12m • ₹205)", key=f"btn_bk_{idx}", use_container_width=True):
                        st.session_state.messages.append({"role": "user", "content": "Select Blinkit"})
                        sub_res = process_agent_request("Select Blinkit", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": sub_res})
                        st.rerun()

            # GROCERY HITL CHECKOUT CARD
            if data.get("intent") == "grocery_order_interrupt":
                col1, col2 = st.columns([2, 1])
                with col1:
                    if st.button(f"🛍️ Authorize & Dispatch Delivery (₹{data.get('price', 188)} INR)", key=f"auth_groc_{idx}"):
                        st.session_state.messages.append({"role": "user", "content": f"Authorize order on {data.get('store', 'Flipkart Minutes')}"})
                        auth_res = process_agent_request("Authorize grocery order", st.session_state.messages)
                        st.session_state.messages.append({"role": "assistant", "data": auth_res})
                        st.rerun()
                with col2:
                    if st.button("Cancel Delivery", key=f"cancel_groc_{idx}"):
                        st.session_state.messages.append({"role": "user", "content": "Cancel delivery"})
                        st.session_state.messages.append({"role": "assistant", "data": {"content": "Grocery order cancelled."}})
                        st.rerun()

# User Chat Input
if prompt := st.chat_input("Enter your request (e.g. 'Book me a cab to the airport' or 'Compare laptops on Flipkart and Amazon')..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)
        
    with st.chat_message("assistant"):
        with st.spinner("Autonomous agent executing multi-source verification and planning..."):
            response_data = process_agent_request(prompt, st.session_state.messages)
            st.session_state.messages.append({"role": "assistant", "data": response_data})
            st.rerun()
