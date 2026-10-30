# Naman Lahariya — Portfolio 2.0 (Flask Edition)

> Upgraded developer portfolio for **Naman Lahariya**, inspired by the cyberpunk / high-tech glassmorphism aesthetic of **[aviralpathak.in](https://aviralpathak.in)** and powered by **Python & Flask**.

---

## ✨ Features & Upgrades

### 🛡️ Mission Control Admin Dashboard (`/admin`)
- **Secure Authentication**: Passcode protected (`admin123`) terminal login.
- **Inbound Message Manager**: View, filter, and delete transmissions stored in the persistent SQLite database (`messages.db`).
- **Dynamic Content Persistence**: Update profile tagline, bio, status, project links (Live Demo & GitHub), and skills with real-time JSON disk persistence (`portfolio_data.json`).
- **Local LLM AI Console**: Real-time Ollama daemon diagnostics, knowledge base vector inspector, and interactive prompt testing playground.

### 🎨 Visual & Interactive Polish (Inspired by Aviral Pathak)
- **Floating Quick Launch (`⌘K`)**: Always-accessible floating cyberpunk pill button at the bottom left for instant keyboard navigation, section jumping, theme toggling, and sound controls.
- **Redesigned "LET'S TALK." Section**: Integrated the "Transmit Message" contact form directly into the grand typographic footer with split-grid layout and direct channel pills.
- **Enhanced Glass Menu Navigation**: Numbered cyberpunk menu items (`01. Home`, `02. About`, ... `11. Let's Talk`) with Lenis smooth scroll offset handling.
- **Interactive Command Palette (`Ctrl+K` / `⌘K`)**: Instant developer command center for fuzzy-searching sections, switching themes, toggling audio FX, copying email, opening resumes, and launching root tools.
- **"Ask Naman's AI Twin" Chat Drawer (`/api/chat`)**: Cyber conversational drawer with prompt suggestion chips answering questions about Naman's SaaS projects (Clix Hub), machine learning work (Decode Labs, CleanUp), MITS background, and hiring availability.
- **Applied Calculus Tank Optimizer (`#optimizer` & `/api/tank-optimize`)**: Interactive simulation of Naman's academic research project in differential calculus. Features real-time sliders for volume and radius, live mathematical derivative computations ($A(r) = 2\pi r^2 + 2V/r \implies r^* = \sqrt[3]{V/2\pi}$), 2D Cartesian function plotting, dynamic 3D isometric cylinder visualization, and instant "Snap to Optimal $r^*$" action.
- **Cyber Toast Notification System**: High-tech feedback toasts with audio chimes for user actions.
- **Preloader**: Quantum system initialization with live progress bar and terminal status (`NL_`).
- **Web Audio Synthesizer**: Built-in sound effects (hover blips, mechanical keyboard clatter, success chimes) generated via browser Web Audio API with zero external sound file latency.
- **Root Terminal / Easter Egg Console**: Interactive terminal window accessible via the navbar or backtick hotkey (`` ` ``) supporting commands like `help`, `about`, `skills`, `projects`, `contact`, `hire`, `matrix`, `theme`, and `clear`.
- **Dynamic Particle Canvas & Ambient Lighting**: Responsive background neural particle mesh that responds to cursor velocity and proximity.
- **Custom Magnetic Cursor**: Follower ring with magnetic snapping on interactive elements.
- **Theme Switcher**: Seamless toggle between Cyber Dark (`#030712`) and Modern Tech Light (`#f8fafc`).
- **Interactive Skills Terminal**: Filterable skill cloud with matrix decryption animation on tab switch.
- **Split Hero**: Glitch headline (`I AM NAMAN LAHARIYA`), dynamic status badge popover, and quick action triggers.
- **Curtain Reveal & Accordion**: "About Me" section with "🎭 Beyond Code" section exploring Mathematics, Algorithmic Puzzles, and UI Design.
- **Project & Role Deep-Dive Modals**: Clickable cards that launch detailed modal popups with architectural breakdowns, tech stacks, and live links.
- **Live GitHub Activity Telemetry**: Live commit feed and telemetry stream for `@namanartist`.
- **Parallax Footer**: Giant typographic marquee and live system clock.

### 🐍 Python & Flask Backend Architecture
- **Flask 3.1+**: Modular and performant WSGI backend.
- **Dynamic Jinja2 Templating**: Clean data structures decoupling content from presentation.
- **RESTful APIs**:
  - `GET /api/projects`: Full project portfolio data.
  - `GET /api/skills`: Categorized skill matrix.
  - `GET /api/experience`: Career trajectory.
  - `GET /api/github`: Cached proxy for live GitHub events.
  - `GET /api/health`: System health and uptime diagnostics.
  - `GET /api/tank-optimize`: Real-time multivariable calculus calculation for cylinder material optimization.
  - `POST /api/chat`: Conversational endpoint powering Naman's AI Twin digital assistant.
  - `POST /api/contact`: Form submission endpoint with validation, honeypot anti-spam protection, and SQLite persistence.
- **Vercel Serverless Deployment**: Ready for instant 1-click deployment on Vercel using `api/index.py` and `@vercel/python`.

---

## 🚀 Quickstart & Local Development

### 1. Requirements
- Python 3.10+ (or Python 3.14 via `uv`)
- Dependencies in `requirements.txt`

### 2. Run with `uv` (Recommended)
```bash
# Navigate to the project
cd namanlahariya-portfolio

# Run the Flask app directly
uv run --python 3.14 --with flask python app.py
```

### 3. Run with Standard Python / venv
```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run the server
python app.py
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 🌐 Deploy to Vercel

This repository includes `vercel.json` and `api/index.py` configured for Vercel Serverless Functions:

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel --prod
```

---

### 📂 Project Structure

```
namanlahariya-portfolio/
├── frontend/                     # All Frontend UI Assets & Templates
│   ├── static/
│   │   ├── assets/               # Real project images, textures & avatar
│   │   │   ├── image.png
│   │   │   ├── clixhub.jpg
│   │   │   ├── namsify.jpg
│   │   │   ├── cleanup.jpg
│   │   │   └── inamigos.jpg
│   │   ├── css/
│   │   │   └── styles.css        # Cyberpunk styling, animations & theme
│   │   └── js/
│   │       └── main.js           # Client controllers, Audio Synth, 3D Canvas
│   └── templates/
│       └── index.html            # Core Jinja2 HTML with all sections
├── backend/                      # All Python & Flask Backend Architecture
│   ├── app.py                    # Primary Flask app, database & API routing
│   ├── local_llm.py              # Smart Local LLM Engine (Ollama + Autonomous RAG)
│   ├── messages.db               # SQLite transmission storage
│   └── requirements.txt          # Backend dependencies
├── api/
│   └── index.py                  # Vercel Serverless Function entrypoint
├── app.py                        # Root WSGI proxy / runner
├── run.py                        # CLI runner
├── requirements.txt              # Project dependencies
└── vercel.json                   # Vercel serverless deployment config
```

---

### 🧠 Smart Local LLM Engine (`backend/local_llm.py`)

The website's AI Twin is built to run **100% locally** with dual-mode intelligence:
1. **Local Ollama Integration**: If an Ollama daemon is running on your machine (`http://127.0.0.1:11434`), it automatically detects it and queries local models (e.g. `llama3`, `mistral`, `gemma`, `phi3`) with a structured system prompt.
2. **Autonomous Local Neural RAG & Reasoning Engine**: When Ollama is not active, it runs a built-in semantic retrieval and reasoning engine written in pure Python. It uses TF-IDF cosine vector matching over a structured knowledge base of 25+ verified document chunks detailing Naman's projects, calculus proofs, and work experience, providing context-aware responses with dynamic suggestion chips and zero external API dependencies.
3. **Diagnostics Endpoint**: Inspect local LLM health via `GET /api/llm-status`.

---

### 🔗 Project Live Demos & Repositories

Every project features direct clickable **Live Demo** and **Source Code** buttons on both the card and the detail modal:

| Project | Tech Stack | Live Demo | Repository |
| :--- | :--- | :--- | :--- |
| **Clix Hub** | React, Next.js, Node.js, PostgreSQL, RBAC | [Live Demo](https://clixhub.vercel.app) | [GitHub](https://github.com/namanartist/clixhub-erp) |
| **Namsify** | Web Audio API, React, Cloud Audio | [Live Demo](https://namanartist.github.io/namsify) | [GitHub](https://github.com/namanartist/namsify-streaming) |
| **CleanUp App** | PyTorch, OpenCV, Computer Vision, FastAPI | [Live Demo](https://cleanup-ai.vercel.app) | [GitHub](https://github.com/namanartist/cleanup-ai) |
| **Hopebridge Foundation** | Accessible HTML5, CSS3, JS, Netlify | [Live Demo](https://hopebridgefoundationin.netlify.app/) | [GitHub](https://github.com/namanartist/hopebridge-foundation) |
| **Optimization of Tank Material** | Multivariable Calculus, Optimization | [Research Paper](https://drive.google.com/file/d/14Uy3gxO3UKVFWD2vjh7aPZDBr6UJwFtd/view?usp=drivesdk) / [Live Sandbox](#optimizer) | [GitHub](https://github.com/namanartist/tank-optimization) |

---

## 👨‍💻 Author
**Naman Lahariya**  
- B.Tech in Mathematics & Computing, MITS Gwalior  
- GitHub: [@namanartist](https://github.com/namanartist)  
- LinkedIn: [in/naman-lahariya](https://linkedin.com/in/naman-lahariya)  
- Website: [namanlahariya.vercel.app](https://namanlahariya.vercel.app)

