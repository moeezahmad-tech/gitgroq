<p align="center">
  <img src="frontend/public/GitGrok.png" alt="GitGrok Logo" width="120" />
</p>

<h1 align="center">GitGrok</h1>
<p align="center"><strong>The AI Commit Explainer</strong></p>


<p align="center">
  Paste a GitHub repo URL or commit hash, GitGrok explains what changed, why it likely changed, and what impact it has.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Repository Analysis** | Fetch full repo details, stars, forks, language, license, and more |
| **Commit History** | View up to 100 recent commits with author, date, and message |
| **File Tree** | Collapsible nested directory tree with folder/file icons |
| **Bubble View** | Interactive force-directed graph showing repo structure with drag & expand |
| **Fullscreen Mode** | Expand any view to fullscreen for better exploration |
| **Dark Mode** | Developer-friendly dark UI as default |

---

## 🏗️ Project Structure

```
GitGrok/
├── backend/                  # Express.js API server
│   ├── config/               # Database connection config
│   ├── controllers/          # Route handlers (request/response)
│   ├── middleware/           # Auth, upload, validation
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express route definitions
│   ├── services/             # Business logic & GitHub API integration
│   ├── utils/                # Shared helpers
│   ├── server.js             # App entry point
│   └── .env                  # Environment variables
│
├── frontend/                 # React + Vite SPA
│   ├── public/               # Static assets (logo, icons)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── BubbleView.jsx        # Force-directed graph visualization
│   │   │   ├── FileTree.jsx           # Collapsible file tree
│   │   │   ├── FullscreenWrapper.jsx  # Fullscreen overlay component
│   │   │   ├── MarkdownRenderer.jsx   # Markdown display
│   │   │   └── Navbar.jsx             # Navigation bar
│   │   ├── pages/            # Route pages
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Analyze.jsx   # Main analysis dashboard
│   │   │   ├── About.jsx     # About & principles
│   │   │   ├── Contact.jsx   # Contact form
│   │   │   └── NotFound.jsx  # 404 page
│   │   ├── lib/              # API client & utilities
│   │   ├── App.jsx           # Root component with routing
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles & Tailwind
│   ├── index.html            # HTML template
│   └── vite.config.js        # Vite configuration
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a cloud URI
- **npm** 

### 1. Clone the repository

```bash
git clone https://github.com/your-username/GitGrok.git
cd GitGrok
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file (or edit the existing one):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gitgrok
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Analyze a GitHub repo or commit URL |
| `GET` | `/api/health` | Health check |

### POST /api/analyze

**Request:**
```json
{
  "url": "https://github.com/facebook/react"
}
```

**Response:**
```json
{
  "summary": [
    { "label": "Full Name", "value": "facebook/react" },
    { "label": "Stars", "value": "225000" }
  ],
  "commits": [
    { "sha": "abc1234", "message": "Fix bug", "author": "Dan", "date": "5/20/2026" }
  ],
  "fileTree": [
    { "path": "src/index.js", "type": "blob" },
    { "path": "src/components", "type": "tree" }
  ],
  "impact": "Repository has 800 open issues..."
}
```

---

## 🎨 Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Architecture:** MVC (Model → Service → Controller → Route)

### Frontend
- **Build Tool:** Vite
- **UI Library:** React 19
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Visualization:** Custom canvas-based force-directed graph

---

## 🧩 Key Components

### Bubble View (Force-Directed Graph)
An interactive network visualization of the repository structure:
- Nodes represent files and folders
- Edges show parent-child relationships
- Drag nodes to reposition them
- Double-click folders to expand/collapse
- Physics simulation keeps nodes separated

### File Tree
A traditional collapsible tree view:
- Folders expand/collapse on click
- Sorted: directories first, then files alphabetically
- Shows item count per directory

### Fullscreen Mode
Every panel supports fullscreen:
- Click the expand icon (top-right)
- Press Escape or click X to exit
- Content auto-resizes to fill the viewport

---

## 🛠️ Development

### Backend Scripts

```bash
npm start        # Production start
npm run dev      # Development with nodemon
npm run lint     # Run ESLint
```

### Frontend Scripts

```bash
npm run dev      # Vite dev server (HMR)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📋 Architecture Principles

1. **Models** define Mongoose schemas only, no business logic
2. **Services** contain business logic, framework-agnostic
3. **Controllers** handle request/response, call services, never touch DB directly
4. **Routes** are thin, map HTTP verbs to controllers
5. **Components** follow separation, presentational vs. feature vs. page

---

## 🗺️ Roadmap

- [ ] AI-powered commit explanations (OpenAI/Anthropic integration)
- [ ] GitHub OAuth for private repos
- [ ] Commit diff viewer with syntax highlighting
- [ ] History of analyzed repos (saved to MongoDB)
- [ ] Team workspaces & shared analysis
- [ ] VS Code extension

---

## 📄 License

This project is licensed under the MIT License, see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  A project of (Techkreative.)[https://techkreative.com]<br/>
  <strong>GitGrok</strong>, Understand code, not just read it.
</p>
