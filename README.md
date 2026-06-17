# AI Support Ticket Intelligence Platform

A full-stack intelligent support system that classifies customer tickets, assigns priority, and generates agent solutions plus customer-ready replies using trained ML models.

| Layer | Stack |
|-------|--------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | FastAPI, scikit-learn, joblib, Pydantic |
| **ML** | TF-IDF + Logistic Regression (classification), TF-IDF Nearest Response (reply generation) |

---

## Features

- **Ticket classification** — category + confidence from `traditional_tfidf_logreg_classifier.joblib`
- **Priority inference** — rule-based priority from category and confidence
- **Response generation** — nearest-neighbor replies via `tfidf_nearest_response_model.joblib`
- **Dynamic model loading** — auto-discovers artifacts at startup; no hardcoded model names
- **Enterprise dashboard** — dark mode, health monitoring, prediction history, toast notifications
- **Production-ready API** — `/health`, `/model-info`, `/predict` with CORS and structured logging

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Next.js)          http://localhost:3000        │
│  Landing · Dashboard · API status · Model info panel        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Axios
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend (FastAPI)           http://localhost:8000          │
│  POST /predict  →  vectorize → classify → generate reply    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  backend/artifacts/  (models — download separately)         │
│  · traditional_tfidf_logreg_classifier.joblib               │
│  · tfidf_response_vectorizer.joblib                           │
│  · tfidf_nearest_response_model.joblib                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
DEPI Project/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/          # health, predict, model-info
│   │   ├── services/        # model loading, inference, response
│   │   ├── schemas/
│   │   ├── core/
│   │   └── utils/
│   ├── artifacts/           # ML models (not in Git — see below)
│   ├── metrics/             # evaluation JSON / CSV
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── app/                 # landing + dashboard pages
│   ├── components/
│   ├── lib/                 # API client + types
│   ├── hooks/
│   └── package.json
├── intelligent-support-ticket-classification-with-rag.ipynb
├── render.yaml              # Backend deploy (Render)
└── vercel.json              # Frontend deploy (Vercel)
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| **Python** | 3.10+ |
| **Node.js** | 18+ |
| **npm** | 9+ |

---

## Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

---

## Step 2 — Download model artifacts

Large model files are **not stored in GitHub** (GitHub limits files to 100 MB).

Download the artifacts archive from Google Drive:

**[Download artifacts.zip](https://drive.google.com/file/d/1rFphFsEmlPGHOX5OfzwtEj5OeSh-ykXU/view?usp=sharing)**

Then:

1. Extract the zip.
2. Copy the contents into `backend/artifacts/`.

**Minimum files required to run the API:**

| File | Purpose |
|------|---------|
| `traditional_tfidf_logreg_classifier.joblib` | Ticket classification |
| `tfidf_response_vectorizer.joblib` | Response vectorization |
| `tfidf_nearest_response_model.joblib` | Customer reply generation |

Your folder should look like:

```
backend/artifacts/
├── traditional_tfidf_logreg_classifier.joblib
├── tfidf_response_vectorizer.joblib
└── tfidf_nearest_response_model.joblib
```

---

## Step 3 — Backend setup

Open a terminal:

```bash
cd backend
pip install -r requirements.txt
```

**Windows (recommended):**

```powershell
cd backend
py -m pip install -r requirements.txt
py -m uvicorn app.main:app --reload
```

Optional — copy environment template:

```bash
cp .env.example .env
```

Default values work for local development. API runs at **http://localhost:8000**.

Verify:

| URL | Description |
|-----|-------------|
| http://localhost:8000/health | Service + model status |
| http://localhost:8000/model-info | Loaded models and metrics |
| http://localhost:8000/docs | Swagger API documentation |

---

## Step 4 — Frontend setup

Open a **second** terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

App runs at **http://localhost:3000**

| Page | URL |
|------|-----|
| Landing | http://localhost:3000 |
| Dashboard | http://localhost:3000/dashboard |

---

## Step 5 — Use the application

1. Open the **Dashboard**.
2. Enter a **ticket title** and **description**.
3. Click **Classify Ticket**.
4. Review:
   - **Category** and **priority**
   - **Confidence** score
   - **Agent solution** (internal playbook)
   - **Customer reply** (message draft)
   - **Models used** (classifier + vectorizer)

---

## API Reference

### `GET /health`

Returns API and model load status.

### `GET /model-info`

Returns selected classifier, vectorizer, response model paths and metrics.

### `POST /predict`

**Request:**

```json
{
  "title": "Payment failed for my order",
  "description": "My card was charged but the order status is still pending."
}
```

**Response:**

```json
{
  "category": "billing_payment",
  "priority": "high",
  "confidence": 0.95,
  "agent_solution": "Verify transaction ID and payment gateway logs...",
  "customer_reply": "Thanks for reaching out. We're reviewing your payment...",
  "model_used": "traditional_tfidf_logreg_classifier",
  "vectorizer_used": "tfidf_response_vectorizer"
}
```

---

## Ticket Categories

| Category | Examples |
|----------|----------|
| `account_login` | login, password, verification |
| `billing_payment` | payment, invoice, charges |
| `order_shipping` | delivery, tracking, packages |
| `refund_return` | refunds, cancellations |
| `technical_app` | app bugs, crashes, errors |
| `product_service` | product quality, features |
| `general_support` | general inquiries |

---

## Deployment

| Service | Config | Folder |
|---------|--------|--------|
| **Frontend** | Vercel | `frontend/` |
| **Backend** | Render (Docker) | `backend/` |

Set `NEXT_PUBLIC_API_URL` on Vercel to your deployed backend URL.  
Set `CORS_ORIGINS` on the backend to your Vercel domain.

---

## ML Training (optional)

The Jupyter notebook `intelligent-support-ticket-classification-with-rag.ipynb` contains the full training pipeline (TF-IDF classifier, hybrid RAG retrieval, Qwen generation) on the [MohammadOthman/mo-customer-support-tweets-945k](https://huggingface.co/datasets/MohammadOthman/mo-customer-support-tweets-945k) dataset.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `app.main:app` not recognized (PowerShell) | Use `py -m uvicorn app.main:app --reload` from `backend/` |
| Prediction failed | Confirm artifacts are in `backend/artifacts/` and restart backend |
| Frontend offline | Check `NEXT_PUBLIC_API_URL` and that backend is running on port 8000 |
| Hydration warning | Hard refresh (`Ctrl + Shift + R`) after frontend restart |

---

## License

Educational and research use.
