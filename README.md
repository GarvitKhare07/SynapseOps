# 🧠 SynapseOps

> **AI-Powered Knowledge Management & Intelligent Document Analysis Platform**

SynapseOps is an AI-powered platform that transforms static documents into an interactive knowledge workspace. Upload documents, chat with them using Retrieval-Augmented Generation (RAG), generate summaries and quizzes, and retrieve contextual insights through a modern, intuitive interface.

---

## ✨ Features

- 📄 Upload and manage PDF, DOCX, PPTX, TXT, and Markdown files
- 🤖 AI-powered document chat using RAG
- 🔍 Semantic document search
- 📝 Automatic quiz and MCQ generation
- 📚 AI-generated summaries and key insights
- 💬 Context-aware question answering
- 🔐 Secure authentication and document management
- 📱 Responsive and modern UI
- ⚡ FastAPI-powered REST APIs
- ☁️ MongoDB-backed document storage

---

## 🛠️ Tech Stack

### Frontend

- React
- TanStack Start
- TypeScript
- Vite
- Tailwind CSS
- ShadCN UI
- Framer Motion

### Backend

- FastAPI
- Python
- MongoDB
- LangChain
- ChromaDB
- Google Gemini API
- PyMuPDF
- Sentence Transformers

---

## 📂 Project Structure

```text
SynapseOps/
│
├── Front-End/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── Back-End/
│   ├── routes/
│   ├── services/
│   ├── database/
│   ├── rag/
│   ├── models/
│   ├── uploads/
│   └── main.py
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SynapseOps.git
cd SynapseOps
```

---

### 2. Backend Setup

```bash
cd Back-End

python -m venv venv
```

#### Activate the virtual environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

#### Install dependencies

```bash
pip install -r requirements.txt
```

#### Start the backend

```bash
uvicorn main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

### 3. Frontend Setup

```bash
cd Front-End

npm install

npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
MONGODB_URI=
GOOGLE_API_KEY=
OPENAI_API_KEY=
JWT_SECRET=
UPLOAD_DIRECTORY=uploads/
```

---

## 📡 API Features

- Document Upload
- AI Chat
- Semantic Search
- Quiz Generation
- AI Summarization
- User Authentication
- Knowledge Retrieval

---

## 🎯 Future Improvements

- Team Workspaces
- Real-time Collaboration
- OCR Support for Scanned Documents
- Voice-Based Interaction
- AI Note Generation
- Role-Based Access Control
- Cloud Storage Integration
- Analytics Dashboard

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push to your branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

