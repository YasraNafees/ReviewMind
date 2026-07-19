# 🧠 ReviewMind AI
**Enterprise-Grade Customer Review Intelligence System**

Stop reading thousands of reviews manually. ReviewMind AI transforms raw customer feedback (Amazon, Google Maps, etc.) into actionable business insights using AI Clustering, RAG (Retrieval-Augmented Generation), and Sentiment Analysis.

---

## 🎯 The Problem It Solves

Business owners suffer from **Data Overload**. They know customers are complaining, but they don't know *what* the exact problem is.

ReviewMind doesn't just give "Positive/Negative" counts. It groups complaints (e.g., "Delivery", "Taste") and provides exact suggestions: *"40% complaints are about late delivery. Switch the courier service."*

---

## ✨ Key Features

- **Sentiment Analysis:** Breaks down reviews into Positive, Neutral, and Negative categories with visual percentage bars.
- **Complaint Clustering:** Groups similar complaints together automatically using AI to highlight the most common pain points.
- **AI Manager Insights:** Generates a comprehensive summary of review themes and patterns.
- **Chat with Data (RAG):** Ask questions in plain English (e.g., "Why are people complaining about delivery?") and get answers based strictly on your own review data — no hallucinations.
- **Secure Session Authentication:** Uses Supabase Auth with strict `sessionStorage`. Users are automatically logged out when they close the browser, ensuring high security for sensitive review data.
- **Clean, Human-Centric UI:** Built without default AI-looking templates — warm colors, proper spacing, and SVG icons for a professional feel.

---

## ⚙️ Architecture & Tech Stack

Built with a focus on **cost-efficiency**, **low resource usage**, and **reliability**.

**Frontend:**
- React (Vite)
- CSS Modules (scoped styling for easy debugging)
- Lucide React (clean, consistent SVG icons)
- Axios (API calls)

**Backend:**
- FastAPI (Python)

**Database & Auth:**
- PostgreSQL + `pgvector` (Hosted on Supabase)
- Supabase Auth

**AI Models:**
- OpenRouter API: Gemini 2.0 Flash (summaries/chat) & OpenAI Embeddings (`text-embedding-3-small`)
- Scikit-Learn: KMeans Clustering
- VADER: Local rule-based sentiment analysis

---

## 💡 The "Secret Sauce" (Real-World Engineering)

This project isn't a basic ChatGPT wrapper. It uses specific engineering techniques to make it production-ready:

1. **The Rating Hack (Cost-Effective):** Instead of sending every review to a paid LLM for sentiment, it uses the product's star rating (1–5) to instantly label ~80% of data for free. The LLM is only used for confusing 3-star reviews.
2. **Memory-Safe Chunking:** Processes 500k+ row CSVs on a standard 4GB RAM laptop without crashing by reading data in 1000-row chunks.
3. **Hallucination-Free RAG:** Instead of sending raw reviews to the AI Chatbot, it uses `pgvector` to retrieve *only* the relevant clustered data, forcing the AI to stick to the facts.
4. **Pre-computed Insights:** AI summaries are generated once during processing and stored, saving API costs during dashboard viewing.

---

## 📁 Project Structure

```text
ReviewMind/
├── Backend/
│   ├── config.py             # Centralized settings & API keys
│   ├── logger.py             # Production-grade logging system
│   ├── database.py           # DB connection pooling (RAM safe)
│   ├── models.py             # SQLAlchemy schemas
│   ├── main.py               # FastAPI app entry point
│   ├── requirements.txt
│   ├── services/             # 🧠 The AI Brain
│   │   ├── sentiment_service.py  # The Rating Hack
│   │   ├── embedding_service.py  # Vectorization
│   │   ├── clustering_service.py # KMeans grouping
│   │   ├── summary_service.py    # Gemini prompting
│   │   └── chat_service.py       # RAG implementation
│   └── routes/               # 🌉 API endpoints
│       ├── upload.py
│       ├── dashboard.py
│       └── ai_routes.py
│
└── reviewmind_ui/
    ├── public/
    └── src/
        ├── components/        # UI building blocks
        │   ├── LoginScreen.jsx
        │   ├── SideBar.jsx
        │   ├── OverviewPage.jsx
        │   ├── KpiCards.jsx
        │   └── ...
        ├── styles/            # CSS Modules
        │   ├── global.css     # <-- change colors here to update whole app
        │   └── ...
        ├── hooks/             # Reusable state logic
        │   ├── useAuth.js     # Login/logout/session handling
        │   └── useDashboard.js
        ├── config/
        │   └── supabase.js
        ├── utils/
        │   └── logger.js      # Custom error tracker
        ├── App.jsx
        └── main.jsx
```

---

## 🔄 Pipeline Flow

1. **Ingestion:** User uploads CSV → Pandas processes in safe chunks → saved to PostgreSQL.
2. **Analysis:** Reviews labeled via the Rating Hack → saved.
3. **Vectorization:** Embeddings generated → stored in `pgvector`.
4. **Clustering:** KMeans groups reviews by mathematical similarity (e.g., Group 0 = packaging issues).
5. **Insights:** Gemini reads clusters and generates human-readable summaries.
6. **Interaction:** User chats via RAG bot → bot searches `pgvector` for context → answers strictly based on the user's own data.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm
- Supabase account (free tier works)
- OpenRouter API key (for AI features)

### 1. Database Setup (Supabase)
Run this in the Supabase SQL Editor:
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    raw_text TEXT NOT NULL,
    clean_text TEXT,
    score INTEGER,
    review_date DATE,
    sentiment_label VARCHAR(20),
    sentiment_score FLOAT,
    cluster_id INTEGER,
    embedding vector(1536)
);
```

Also enable Auth: **Authentication → Providers → Email**, then create a test user under **Authentication → Users** (tick **Auto Confirm User** to skip email verification).

### 2. Backend Setup
```bash
cd Backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
```
Create a `.env` file inside `Backend/`:
```env
OPENROUTER_API_KEY=your_openrouter_key
DATABASE_URL=postgresql://postgres.[your-ref]:[your-password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```
Run the server:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd reviewmind_ui
npm install
```
Create a `.env` file inside `reviewmind_ui/`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*(Variables must start with `VITE_` to be read by Vite.)*

Run the app:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔒 Security Implementation

Unlike standard SPAs that keep users logged in for weeks using `localStorage`, ReviewMind uses **`sessionStorage`**.

**Why?** Review data can be sensitive. If a user closes the browser tab or window, the session token is permanently destroyed — opening the app again requires a fresh login.

---

## 🎨 How to Customize the Theme

No need to touch component files to change colors:

1. Open `src/styles/global.css`.
2. Change the CSS variables under `:root`:
   ```css
   :root {
     --accent: #2A9D8F;   /* brand color */
     --negative: #E63946; /* error/negative color */
   }
   ```
3. Save — the entire app updates instantly.

---

## 🐛 Debugging & Development

**Error tracking:** If an API call fails, check the browser console — the custom logger pinpoints exactly where it broke:
```
[12:04:05] [ERROR] [useDashboard.js → fetchDashboardData] Failed to fetch data
```

**CSS styling:** If something looks wrong, you don't need to search the whole codebase — each component has its own `.module.css` file (e.g. `ChatBot.jsx` → `styles/Chatbot.module.css`).

---

## 🛠️ Future Scope

- [ ] Upload history tracking (who uploaded what and when)
- [ ] Delete/manage datasets
- [ ] PDF/CSV export of AI reports
- [ ] Live webhook integration (Google Maps / Shopify)

---

## 📄 License

This project is proprietary software. All rights reserved.