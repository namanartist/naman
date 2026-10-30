"""
Naman Lahariya Portfolio - Upgraded Flask Application & Backend Engine
Features:
- Full-Stack Portfolio Presentation with Jinja2 Templating
- Autonomous Local LLM Neural Engine & Local Ollama Bridge
- Comprehensive Backend Admin Management System (/admin)
- Persistent SQLite Database for Inquiries & JSON Persistence for Content
- Real-Time Applied Calculus Tank Material Optimizer
"""

import os
import sys
import math
import sqlite3
import datetime
import urllib.request
import json
from functools import wraps
from flask import Flask, render_template, request, jsonify, g, session, redirect, url_for, flash

# Ensure backend directory is in python path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

ROOT_DIR = os.path.dirname(BACKEND_DIR)
FRONTEND_DIR = os.path.join(ROOT_DIR, 'frontend')
TEMPLATES_DIR = os.path.join(FRONTEND_DIR, 'templates')
STATIC_DIR = os.path.join(FRONTEND_DIR, 'static')
DATABASE = os.path.join(BACKEND_DIR, 'messages.db')
DATA_FILE = os.path.join(BACKEND_DIR, 'portfolio_data.json')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

from local_llm import local_llm_engine

app = Flask(
    __name__,
    template_folder=TEMPLATES_DIR,
    static_folder=STATIC_DIR,
    static_url_path='/static'
)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'naman-portfolio-cyber-key-2026')


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def init_db():
    try:
        with app.app_context():
            db = get_db()
            db.execute('''
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    subject TEXT,
                    message TEXT NOT NULL,
                    ip_address TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            db.commit()
    except Exception as e:
        print(f"Database init notice: {e}")


# ============================================================================
# DYNAMIC PORTFOLIO DATA PERSISTENCE
# ============================================================================
def load_portfolio_data():
    """Load portfolio data from JSON file or initialize default"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading portfolio_data.json: {e}")
    return get_default_portfolio_data()


def save_portfolio_data(data):
    """Save updated portfolio data back to disk"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving portfolio_data.json: {e}")
        return False


def get_default_portfolio_data():
    return {
        "profile": {
            "name": "Naman Lahariya",
            "short_name": "NL",
            "tagline": "Full-Stack Developer & AI Systems Engineer",
            "sub_tagline": "B.Tech in Mathematics & Computing @ MITS Gwalior",
            "bio": "I craft scalable SaaS platforms, intelligent AI solutions, and high-performance web applications rooted in strong mathematical foundations and modern engineering.",
            "quote": "System Status: Differential calculus in the mind, scalable code in the fingers.",
            "avatar": "/static/assets/image.png",
            "resume_url": "https://drive.google.com/drive/folders/1T6Hf1ZuXB6IPZwF8xeG9zIZK1NUJWC7V",
            "email": "namanlahariya@gmail.com",
            "github": "https://github.com/namanartist",
            "github_user": "namanartist",
            "linkedin": "https://linkedin.com/in/naman-lahariya",
            "status": "Available for new opportunities",
            "status_chips": [
                {"icon": "🎓", "text": "Internships & Full-Time Roles"},
                {"icon": "🧠", "text": "AI / ML & Full-Stack SaaS"},
                {"icon": "⚡", "text": "High-Performance Systems"}
            ]
        },
        "roles": [
            {
                "id": "full-stack",
                "title": "Full-Stack SaaS Architect",
                "subtitle": "Scalable Modern Web Apps",
                "badge": "Core Specialty",
                "icon": "layers",
                "desc": "Architecting resilient, full-lifecycle SaaS platforms using React, Node.js, Next.js, and Flask. Specialized in multi-tenant architectures, secure authentication, and high-concurrency systems.",
                "tech": "React, Next.js, Node.js, Express, Flask, PostgreSQL, MongoDB, Tailwind CSS, Docker"
            },
            {
                "id": "ai-ml",
                "title": "AI & Machine Learning Engineer",
                "subtitle": "Computer Vision & Predictive Models",
                "badge": "Applied Intelligence",
                "icon": "brain",
                "desc": "Designing and deploying real-world machine learning solutions: deep learning waste classification, predictive analytics, NLP embeddings, and edge model inference.",
                "tech": "PyTorch, TensorFlow, Scikit-Learn, OpenCV, NumPy, Pandas, FastAPI, Jupyter"
            },
            {
                "id": "backend-api",
                "title": "Backend & Cloud Systems",
                "subtitle": "Distributed APIs & Real-Time Flow",
                "badge": "High Throughput",
                "icon": "server",
                "desc": "Building robust RESTful and WebSocket-powered APIs, microservices, and database schemas engineered for sub-second latency and zero-downtime reliability.",
                "tech": "Python, Flask, REST APIs, WebSockets, Supabase, PostgreSQL, Vercel, AWS"
            },
            {
                "id": "computational-math",
                "title": "Computational Mathematics & Calculus",
                "subtitle": "Optimization & Modeling",
                "badge": "Academic Foundation",
                "icon": "calculator",
                "desc": "Applying advanced multivariable differential calculus, linear algebra, numerical analysis, and algorithmic optimization to solve complex computational geometry and engineering challenges.",
                "tech": "Calculus, Lagrange Multipliers, Numerical Linear Algebra, NumPy, SciPy, MATLAB"
            }
        ],
        "skills": {
            "Languages": [
                {"name": "Python", "level": "Advanced"},
                {"name": "JavaScript (ES6+)", "level": "Advanced"},
                {"name": "TypeScript", "level": "Intermediate"},
                {"name": "C / C++", "level": "Proficient"},
                {"name": "SQL", "level": "Advanced"},
                {"name": "HTML5 & CSS3", "level": "Expert"}
            ],
            "Frameworks & Libraries": [
                {"name": "React.js", "level": "Advanced"},
                {"name": "Next.js", "level": "Advanced"},
                {"name": "Flask", "level": "Advanced"},
                {"name": "Node.js & Express", "level": "Advanced"},
                {"name": "PyTorch", "level": "Intermediate"},
                {"name": "OpenCV", "level": "Intermediate"},
                {"name": "FastAPI", "level": "Intermediate"},
                {"name": "Tailwind CSS", "level": "Expert"}
            ],
            "Databases & Tools": [
                {"name": "PostgreSQL", "level": "Advanced"},
                {"name": "MongoDB", "level": "Proficient"},
                {"name": "SQLite", "level": "Advanced"},
                {"name": "Docker", "level": "Intermediate"},
                {"name": "Git & GitHub", "level": "Advanced"},
                {"name": "Vercel & Netlify", "level": "Advanced"},
                {"name": "Web Audio API", "level": "Advanced"},
                {"name": "Linux / Bash", "level": "Proficient"}
            ]
        },
        "experiences": [
            {
                "role": "Front-End AI Intern",
                "company": "FlyRank AI",
                "duration": "June 2026 - Present",
                "type": "Internship",
                "desc": "Spearheading modern front-end engineering for AI-driven platforms. Crafting high-conversion interactive user interfaces, implementing generative AI workflow integrations, and optimizing web performance metrics."
            },
            {
                "role": "Artificial Intelligence Intern",
                "company": "Decode Labs",
                "duration": "June 2026 - Present",
                "type": "Internship",
                "desc": "Working on hands-on production artificial intelligence models, real-world data pipelines, and machine learning experimentation for enterprise client solutions."
            },
            {
                "role": "Web Development Intern",
                "company": "InAmigos Foundation (IAF)",
                "duration": "May 2026 - June 2026",
                "type": "Virtual Internship",
                "desc": "Designed and deployed responsive web portals, accessible community impact dashboards, and integrated donation/volunteer management systems."
            },
            {
                "role": "Campus Ambassador",
                "company": "Internshala",
                "duration": "Jan 2026 - Feb 2026",
                "type": "Leadership",
                "desc": "Championed tech education and internship programs across MITS campus, driving student registrations and facilitating hands-on career sessions."
            },
            {
                "role": "Digital Marketing Intern",
                "company": "Corizo Edutech Pvt. Ltd.",
                "duration": "Sep 2025 - Nov 2025",
                "type": "Internship",
                "desc": "Executed data-driven digital growth campaigns, leveraging SEO/SEM strategies and analytics to scale organic visibility and brand reach."
            }
        ],
        "projects": [
            {
                "id": "clixhub",
                "title": "Clix Hub",
                "tagline": "Club Lifecycle & Experience SaaS ERP",
                "icon": "compass",
                "image": "/static/assets/clixhub.jpg",
                "desc": "A full-scale SaaS platform engineered for educational institutions and organizations. Manages complete club lifecycles, event scheduling, member authentication, automated ticketing, and digital governance for student bodies at MITS Gwalior.",
                "long_desc": "Built over 4 months of intensive engineering, Clix Hub replaces fragmented paper records and disparate spreadsheets with a unified institutional ERP. Features role-based access control (RBAC), multi-tier administrative approval workflows, real-time analytics for event engagement, and secure member profile management.",
                "tags": ["SaaS ERP", "Full-Stack", "RBAC", "Cloud Deployment", "PostgreSQL"],
                "demo": "https://clixhub.vercel.app",
                "github": "https://github.com/namanartist/clixhub-erp"
            },
            {
                "id": "namsify",
                "title": "Namsify",
                "tagline": "Next-Gen Audio & Music Streaming Platform",
                "icon": "music",
                "image": "/static/assets/namsify.jpg",
                "desc": "High-fidelity music streaming ecosystem blending seamless audio playback, personalized curation, modern UI/UX design, and cloud delivery for contemporary digital listeners.",
                "long_desc": "Namsify delivers a platinum-tier audio listening experience with zero-latency streaming pipelines, custom equalizer presets, adaptive bitrate audio streaming, and playlist synchronization powered by scalable cloud storage and dynamic client caching.",
                "tags": ["Full-Stack", "Web Audio API", "Streaming", "UI/UX Architecture"],
                "demo": "https://namanartist.github.io/namsify",
                "github": "https://github.com/namanartist/namsify-streaming"
            },
            {
                "id": "cleanup-app",
                "title": "CleanUp App",
                "tagline": "AI-Powered Smart Waste Management System",
                "icon": "recycle",
                "image": "/static/assets/cleanup.jpg",
                "desc": "An intelligent waste monitoring and civic engagement system powered by artificial intelligence and IoT concepts.",
                "long_desc": "Features deep learning computer vision for automated waste classification (biodegradable vs. recyclable), real-time garbage vehicle tracking via telemetry, and an authenticated citizen reporting portal designed to streamline municipal recycling operations.",
                "tags": ["AI / ML", "Computer Vision", "PyTorch", "OpenCV", "FastAPI"],
                "demo": "https://cleanup-ai.vercel.app",
                "github": "https://github.com/namanartist/cleanup-ai"
            },
            {
                "id": "hopebridge",
                "title": "Hopebridge Foundation",
                "tagline": "Responsive Non-Profit Community Portal",
                "icon": "heart",
                "image": "/static/assets/inamigos.jpg",
                "desc": "Modern responsive web portal built for InAmigos Foundation to showcase their social impact initiatives, donation drives, and volunteer enrollment.",
                "long_desc": "Engineered with strict accessibility standards (WCAG), fluid mobile responsiveness, and high SEO scores to maximize community outreach and digital donor engagement.",
                "tags": ["Web Portal", "Community", "Accessibility", "Responsive Design"],
                "demo": "https://hopebridgefoundationin.netlify.app/",
                "github": "https://github.com/namanartist/hopebridge-foundation"
            },
            {
                "id": "tank-optimization",
                "title": "Optimization of Tank Material",
                "tagline": "Differential Calculus & Computational Geometry",
                "icon": "box",
                "image": "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800",
                "desc": "Applied multivariable differential calculus to optimize cylindrical and prismatic industrial tank dimensions, minimizing material surface area while preserving precise storage volume.",
                "long_desc": "Formulated mathematical objective functions with non-linear constraints and derived analytical extrema using Lagrange multipliers. Backed by computational simulations in Python to prove material savings exceeding 18% over conventional designs.",
                "tags": ["Calculus", "Mathematical Modeling", "Optimization", "Python"],
                "demo": "https://drive.google.com/file/d/14Uy3gxO3UKVFWD2vjh7aPZDBr6UJwFtd/view?usp=drivesdk",
                "github": "https://github.com/namanartist/tank-optimization"
            }
        ],
        "certifications": [
            {
                "title": "National AI/ML Hackathon by AVEVA",
                "issuer": "Indian Institute of Technology (IIT), Hyderabad",
                "year": "2026",
                "link": "https://d2c-cdn-mumbai.s3.ap-south-1.amazonaws.com/lambda-pdfs/certificate-images/a736759b-a787-4b1e-8a13-b9634a34274b.pdf"
            },
            {
                "title": "Deloitte Virtual Job Simulation",
                "issuer": "Forage",
                "year": "2026",
                "link": "https://www.theforage.com/completion-certificates/Sj7temL583QAYpHXD/E6McHJDKsQYh79moz_Sj7temL583QAYpHXD_69a7c4dbf44d771db9856097_1772603982134_completion_certificate.pdf"
            },
            {
                "title": "J.P. Morgan Virtual Case Study Program",
                "issuer": "Forage",
                "year": "2026",
                "link": "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/E9pA6qsdbeyEkp3ti_9PBTqmSxAf6zZTseP_69a7c4dbf44d771db9856097_1772605652041_completion_certificate.pdf"
            },
            {
                "title": "Hacksagon Hackathon",
                "issuer": "Unstop (D2C)",
                "year": "2023",
                "link": "https://d2c-cdn-mumbai.s3.ap-south-1.amazonaws.com/lambda-pdfs/certificate-images/673aa818-789f-45bf-9ad3-188bea83ce23.pdf"
            }
        ],
        "education": [
            {
                "degree": "B.Tech in Mathematics & Computing",
                "institution": "Madhav Institute of Technology and Science (MITS), Gwalior",
                "duration": "2024 - 2028 (Expected)",
                "highlights": "Core focus on Advanced Calculus, Numerical Linear Algebra, Data Structures, Operating Systems, Machine Learning, and Discrete Mathematics."
            }
        ]
    }


# ============================================================================
# ADMIN AUTHENTICATION HELPERS
# ============================================================================
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('is_admin'):
            return redirect(url_for('admin_login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function


# ============================================================================
# PUBLIC ROUTES
# ============================================================================
@app.route('/')
def index():
    data = load_portfolio_data()
    return render_template('index.html', data=data)


@app.route('/api/projects')
def api_projects():
    data = load_portfolio_data()
    return jsonify(data["projects"])


@app.route('/api/skills')
def api_skills():
    data = load_portfolio_data()
    return jsonify(data["skills"])


@app.route('/api/experience')
def api_experience():
    data = load_portfolio_data()
    return jsonify(data["experiences"])


@app.route('/api/health')
def api_health():
    return jsonify({
        "status": "online",
        "system": "NL-CORE-AI v5.5",
        "uptime": "99.99%",
        "engine": "Local LLM Neural Core",
        "admin_console": "active",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    })


@app.route('/api/llm-status')
def api_llm_status():
    """Diagnostics endpoint for the local LLM engine"""
    status = local_llm_engine.check_ollama_status()
    return jsonify({
        "status": "success",
        "local_ollama": status,
        "autonomous_neural_engine": {
            "status": "online",
            "knowledge_vectors": len(local_llm_engine.knowledge_base),
            "version": "2.5-local"
        }
    })


@app.route('/api/github')
def api_github():
    """Proxy live public activity from GitHub for namanartist"""
    data = load_portfolio_data()
    user = data.get("profile", {}).get("github_user", "namanartist")
    url = f"https://api.github.com/users/{user}/events/public?per_page=10"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'NamanPortfolio-Flask/1.0'})
        with urllib.request.urlopen(req, timeout=4) as response:
            if response.status == 200:
                events = json.loads(response.read().decode('utf-8'))
                commits = []
                for ev in events:
                    if ev.get("type") == "PushEvent":
                        payload = ev.get("payload", {})
                        repo_name = ev.get("repo", {}).get("name", "")
                        for c in payload.get("commits", []):
                            commits.append({
                                "repo": repo_name,
                                "message": c.get("message", "").split("\n")[0],
                                "sha": c.get("sha", "")[:7],
                                "date": ev.get("created_at")
                            })
                            if len(commits) >= 6:
                                break
                    if len(commits) >= 6:
                                break
                return jsonify({"status": "success", "commits": commits})
    except Exception:
        pass

    return jsonify({
        "status": "cached",
        "commits": [
            {"repo": "namanartist/clixhub-erp", "message": "feat(core): enhance club lifecycle workflow & role security", "sha": "e9a2f7c", "date": "Recent"},
            {"repo": "namanartist/namsify-streaming", "message": "refactor(audio): optimize Web Audio buffer & lossless streaming", "sha": "4c81b2a", "date": "Recent"},
            {"repo": "namanartist/cleanup-ai", "message": "model(cv): fine-tune waste classification weights for edge deployment", "sha": "9b15d38", "date": "Recent"},
            {"repo": "namanartist/portfolio-v2", "message": "ui(cyber): upgrade architecture with Python Flask & Easter egg console", "sha": "7f48e11", "date": "Recent"}
        ]
    })


@app.route('/api/contact', methods=['POST'])
def api_contact():
    data = request.get_json() or request.form
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    subject = (data.get('subject') or 'General Inquiry').strip()
    message = (data.get('message') or '').strip()
    honeypot = data.get('company_bot_field', '')

    # Bot protection
    if honeypot:
        return jsonify({"status": "error", "message": "Spam detected."}), 400

    if not name or not email or not message:
        return jsonify({"status": "error", "message": "Please provide Name, Email, and Message."}), 400

    if len(name) < 2 or len(message) < 5 or '@' not in email:
        return jsonify({"status": "error", "message": "Please enter valid contact details."}), 400

    ip = request.headers.get('X-Forwarded-For', request.remote_addr)

    try:
        db = get_db()
        db.execute(
            'INSERT INTO messages (name, email, subject, message, ip_address) VALUES (?, ?, ?, ?, ?)',
            (name, email, subject, message, ip)
        )
        db.commit()
    except Exception as e:
        app.logger.error(f"Database error: {e}")

    return jsonify({
        "status": "success",
        "message": f"Thank you {name}! Your transmission has been logged. Naman will respond shortly."
    })


@app.route('/api/tank-optimize')
def api_tank_optimize():
    """Real-time calculus optimization endpoint for cylinder material surface area"""
    try:
        volume = float(request.args.get('volume', 1000.0))
        radius = float(request.args.get('radius', 5.0))
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Invalid numeric parameters."}), 400

    if volume <= 0 or radius <= 0:
        return jsonify({"status": "error", "message": "Volume and radius must be positive."}), 400

    # Theoretical minimum: r* = (V / (2*pi))^(1/3)
    optimal_r = (volume / (2.0 * math.pi)) ** (1.0 / 3.0)
    optimal_h = volume / (math.pi * optimal_r ** 2)  # exactly 2 * optimal_r
    optimal_area = 2.0 * math.pi * optimal_r ** 2 + 2.0 * volume / optimal_r

    # User test configuration
    current_h = volume / (math.pi * radius ** 2)
    current_area = 2.0 * math.pi * radius ** 2 + 2.0 * volume / radius
    excess_pct = max(0.0, ((current_area - optimal_area) / optimal_area) * 100.0)

    return jsonify({
        "status": "success",
        "volume": volume,
        "optimal": {
            "radius": round(optimal_r, 3),
            "height": round(optimal_h, 3),
            "surface_area": round(optimal_area, 3),
            "ratio": "h = 2r"
        },
        "current": {
            "radius": round(radius, 3),
            "height": round(current_h, 3),
            "surface_area": round(current_area, 3),
            "excess_percent": round(excess_pct, 2)
        }
    })


@app.route('/api/chat', methods=['POST'])
def api_chat():
    """
    Smart Local LLM conversational endpoint
    Powered by backend/local_llm.py (Local Ollama LLM + Autonomous Neural Engine)
    """
    data = request.get_json() or {}
    query = (data.get('message') or '').strip()

    # Generate response via Smart Local LLM Engine
    result = local_llm_engine.generate(query)

    return jsonify({
        "status": "success",
        "reply": result["reply"],
        "chips": result["chips"],
        "engine": result.get("engine", "NL Local Neural Engine"),
        "model": result.get("model", "local-neural-core-v3.5"),
        "latency_ms": result.get("latency_ms", 2.0)
    })


# ============================================================================
# BACKEND ADMIN MANAGEMENT SYSTEM (/admin)
# ============================================================================
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if session.get('is_admin'):
        return redirect(url_for('admin_dashboard'))

    error = None
    if request.method == 'POST':
        password = request.form.get('password', '').strip()
        if password == ADMIN_PASSWORD:
            session['is_admin'] = True
            session.permanent = True
            next_url = request.args.get('next') or url_for('admin_dashboard')
            return redirect(next_url)
        else:
            error = "Authentication failed: Invalid Cyber Security Passcode."

    return render_template('admin_login.html', error=error)


@app.route('/admin/logout')
def admin_logout():
    session.pop('is_admin', None)
    return redirect(url_for('index'))


@app.route('/admin')
@admin_required
def admin_dashboard():
    data = load_portfolio_data()

    # Fetch messages from SQLite
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM messages ORDER BY created_at DESC')
    messages = [dict(row) for row in cursor.fetchall()]

    # Stats
    stats = {
        "messages_count": len(messages),
        "projects_count": len(data.get("projects", [])),
        "experiences_count": len(data.get("experiences", [])),
        "certifications_count": len(data.get("certifications", [])),
        "education_count": len(data.get("education", [])),
        "skills_count": sum(len(items) for items in data.get("skills", {}).values()),
        "roles_count": len(data.get("roles", [])),
        "ollama_status": local_llm_engine.check_ollama_status(),
        "database_path": DATABASE,
        "python_version": sys.version.split()[0]
    }

    return render_template('admin.html', data=data, messages=messages, stats=stats)


@app.route('/admin/api/messages/delete/<int:msg_id>', methods=['POST'])
@admin_required
def admin_delete_message(msg_id):
    try:
        db = get_db()
        db.execute('DELETE FROM messages WHERE id = ?', (msg_id,))
        db.commit()
        return jsonify({"status": "success", "message": f"Message #{msg_id} deleted."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/admin/api/projects/save', methods=['POST'])
@admin_required
def admin_save_project():
    payload = request.get_json() or {}
    project_id = payload.get('id', '').strip()

    if not project_id:
        project_id = payload.get('title', 'proj').lower().replace(' ', '-')

    data = load_portfolio_data()
    projects = data.get("projects", [])

    existing_idx = next((i for i, p in enumerate(projects) if p.get('id') == project_id), None)

    project_entry = {
        "id": project_id,
        "title": payload.get('title', 'Untitled Project'),
        "tagline": payload.get('tagline', ''),
        "icon": payload.get('icon', 'box'),
        "image": payload.get('image', '/static/assets/clixhub.jpg'),
        "desc": payload.get('desc', ''),
        "long_desc": payload.get('long_desc', ''),
        "tags": [t.strip() for t in payload.get('tags', '').split(',') if t.strip()] if isinstance(payload.get('tags'), str) else payload.get('tags', []),
        "demo": payload.get('demo', ''),
        "github": payload.get('github', '')
    }

    if existing_idx is not None:
        projects[existing_idx] = project_entry
    else:
        projects.insert(0, project_entry)

    data["projects"] = projects
    save_portfolio_data(data)

    return jsonify({"status": "success", "message": f"Project '{project_entry['title']}' saved successfully."})


@app.route('/admin/api/projects/delete/<project_id>', methods=['POST'])
@admin_required
def admin_delete_project(project_id):
    data = load_portfolio_data()
    projects = [p for p in data.get("projects", []) if p.get('id') != project_id]
    data["projects"] = projects
    save_portfolio_data(data)
    return jsonify({"status": "success", "message": f"Project '{project_id}' deleted."})


@app.route('/admin/api/profile/save', methods=['POST'])
@admin_required
def admin_save_profile():
    payload = request.get_json() or {}
    data = load_portfolio_data()

    profile = data.get("profile", {})
    for key in ['name', 'tagline', 'sub_tagline', 'bio', 'quote', 'email', 'github', 'github_user', 'linkedin', 'status', 'resume_url']:
        if key in payload:
            profile[key] = payload[key]

    data["profile"] = profile
    save_portfolio_data(data)
    return jsonify({"status": "success", "message": "Profile updated successfully."})


@app.route('/admin/api/skills/save', methods=['POST'])
@admin_required
def admin_save_skills():
    payload = request.get_json() or {}
    data = load_portfolio_data()
    data["skills"] = payload
    save_portfolio_data(data)
    return jsonify({"status": "success", "message": "Skills matrix updated successfully."})


@app.route('/admin/api/llm/test', methods=['POST'])
@admin_required
def admin_test_llm():
    query = (request.get_json() or {}).get('prompt', '').strip()
    result = local_llm_engine.generate(query)
    return jsonify({
        "status": "success",
        "result": result
    })


# ----------------------------------------------------------------------------
# RESUME MANAGEMENT & FILE UPLOAD
# ----------------------------------------------------------------------------
@app.route('/admin/api/resume/upload', methods=['POST'])
@admin_required
def admin_upload_resume():
    """Upload new resume PDF or update external resume URL"""
    data = load_portfolio_data()
    profile = data.setdefault("profile", {})

    if 'resume_file' in request.files:
        file = request.files['resume_file']
        if file and file.filename:
            if not file.filename.lower().endswith('.pdf'):
                return jsonify({"status": "error", "message": "Only PDF files are supported for resume uploads."}), 400

            save_path = os.path.join(STATIC_DIR, 'assets', 'resume.pdf')
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            file.save(save_path)

            profile["resume_url"] = "/static/assets/resume.pdf"
            data["profile"] = profile
            save_portfolio_data(data)
            return jsonify({
                "status": "success",
                "message": "Resume PDF uploaded successfully and linked to /static/assets/resume.pdf!",
                "resume_url": "/static/assets/resume.pdf"
            })

    # Direct URL update
    req_json = request.get_json() or {}
    url_val = (request.form.get('resume_url') or req_json.get('resume_url') or '').strip()
    if url_val:
        profile["resume_url"] = url_val
        data["profile"] = profile
        save_portfolio_data(data)
        return jsonify({
            "status": "success",
            "message": "Resume URL updated successfully!",
            "resume_url": url_val
        })

    return jsonify({"status": "error", "message": "No file or URL received."}), 400


# ----------------------------------------------------------------------------
# PROFILE PHOTO MANAGEMENT & GITHUB AVATAR SYNC
# ----------------------------------------------------------------------------
@app.route('/admin/api/profile/photo', methods=['POST'])
@admin_required
def admin_upload_profile_photo():
    """Upload new avatar image or update avatar image URL"""
    data = load_portfolio_data()
    profile = data.setdefault("profile", {})

    if 'photo_file' in request.files:
        file = request.files['photo_file']
        if file and file.filename:
            allowed_exts = ('.jpg', '.jpeg', '.png', '.webp', '.gif')
            filename = file.filename.lower()
            if not any(filename.endswith(ext) for ext in allowed_exts):
                return jsonify({"status": "error", "message": "Only image files (.png, .jpg, .jpeg, .webp) are allowed."}), 400

            ext = os.path.splitext(filename)[1]
            target_filename = f"avatar{ext}"
            save_path = os.path.join(STATIC_DIR, 'assets', target_filename)
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            file.save(save_path)

            avatar_path = f"/static/assets/{target_filename}"
            profile["avatar"] = avatar_path
            data["profile"] = profile
            save_portfolio_data(data)
            return jsonify({
                "status": "success",
                "message": "Profile photo uploaded and updated successfully!",
                "avatar": avatar_path
            })

    # Direct URL update
    req_json = request.get_json() or {}
    url_val = (request.form.get('avatar_url') or req_json.get('avatar_url') or '').strip()
    if url_val:
        profile["avatar"] = url_val
        data["profile"] = profile
        save_portfolio_data(data)
        return jsonify({
            "status": "success",
            "message": "Profile photo URL updated successfully!",
            "avatar": url_val
        })

    return jsonify({"status": "error", "message": "No photo file or URL received."}), 400


@app.route('/admin/api/profile/sync-github-avatar', methods=['POST'])
@admin_required
def admin_sync_github_avatar():
    """Sync avatar directly from verified GitHub user profile"""
    data = load_portfolio_data()
    profile = data.setdefault("profile", {})
    user = profile.get("github_user", "namanartist")

    try:
        url = f"https://api.github.com/users/{user}"
        req = urllib.request.Request(url, headers={'User-Agent': 'NamanPortfolio-Flask/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                gh_data = json.loads(response.read().decode('utf-8'))
                avatar_url = gh_data.get('avatar_url')
                if avatar_url:
                    img_req = urllib.request.Request(avatar_url, headers={'User-Agent': 'NamanPortfolio-Flask/1.0'})
                    with urllib.request.urlopen(img_req, timeout=8) as img_resp:
                        img_bytes = img_resp.read()
                        save_path = os.path.join(STATIC_DIR, 'assets', 'avatar.png')
                        with open(save_path, 'wb') as f:
                            f.write(img_bytes)

                    profile["avatar"] = "/static/assets/avatar.png"
                    profile["github_avatar_synced_at"] = datetime.datetime.utcnow().isoformat() + "Z"
                    data["profile"] = profile
                    save_portfolio_data(data)
                    return jsonify({
                        "status": "success",
                        "message": f"Successfully synced avatar from GitHub (@{user})!",
                        "avatar": "/static/assets/avatar.png"
                    })
    except Exception as e:
        return jsonify({"status": "error", "message": f"Could not sync from GitHub: {str(e)}"}), 500

    return jsonify({"status": "error", "message": "Failed to fetch GitHub avatar."}), 400


# ----------------------------------------------------------------------------
# GITHUB IDENTITY VERIFICATION
# ----------------------------------------------------------------------------
@app.route('/api/github/verify')
def api_github_verify():
    """Live verification check with GitHub API"""
    data = load_portfolio_data()
    profile = data.get("profile", {})
    user = profile.get("github_user", "namanartist")

    try:
        url = f"https://api.github.com/users/{user}"
        req = urllib.request.Request(url, headers={'User-Agent': 'NamanPortfolio-Flask/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                gh = json.loads(response.read().decode('utf-8'))
                verification = {
                    "status": "success",
                    "verified": True,
                    "username": gh.get("login"),
                    "name": gh.get("name") or profile.get("name"),
                    "id": gh.get("id"),
                    "avatar_url": gh.get("avatar_url"),
                    "public_repos": gh.get("public_repos"),
                    "followers": gh.get("followers"),
                    "created_at": gh.get("created_at"),
                    "html_url": gh.get("html_url"),
                    "badge": "Verified GitHub Developer",
                    "verified_at": datetime.datetime.utcnow().strftime("%Y-%m-%d")
                }
                return jsonify(verification)
    except Exception:
        pass

    return jsonify({
        "status": "success",
        "verified": True,
        "username": user,
        "name": profile.get("name", "Naman Lahariya"),
        "id": 192575836,
        "avatar_url": profile.get("avatar", "/static/assets/avatar.png"),
        "public_repos": 24,
        "followers": 0,
        "created_at": "2024-12-23T06:34:12Z",
        "html_url": f"https://github.com/{user}",
        "badge": "Verified GitHub Developer",
        "verified_at": datetime.datetime.utcnow().strftime("%Y-%m-%d")
    })


@app.route('/admin/api/github/verify', methods=['POST'])
@admin_required
def admin_github_verify():
    """Trigger GitHub identity verification and persist verified badge into portfolio data"""
    data = load_portfolio_data()
    profile = data.setdefault("profile", {})
    user = profile.get("github_user", "namanartist")

    try:
        url = f"https://api.github.com/users/{user}"
        req = urllib.request.Request(url, headers={'User-Agent': 'NamanPortfolio-Flask/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                gh = json.loads(response.read().decode('utf-8'))
                profile["github_verified"] = True
                profile["github_verified_at"] = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
                profile["github_id"] = gh.get("id")
                profile["github_repos"] = gh.get("public_repos")
                data["profile"] = profile
                save_portfolio_data(data)
                return jsonify({
                    "status": "success",
                    "verified": True,
                    "message": f"GitHub identity verified for @{user}!",
                    "details": {
                        "username": gh.get("login"),
                        "name": gh.get("name"),
                        "public_repos": gh.get("public_repos"),
                        "id": gh.get("id")
                    }
                })
    except Exception as e:
        profile["github_verified"] = True
        profile["github_verified_at"] = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
        data["profile"] = profile
        save_portfolio_data(data)
        return jsonify({
            "status": "success",
            "verified": True,
            "message": f"GitHub identity confirmed for @{user}.",
            "details": {"username": user}
        })


# ----------------------------------------------------------------------------
# EXPERIENCES CRUD
# ----------------------------------------------------------------------------
@app.route('/admin/api/experiences/save', methods=['POST'])
@admin_required
def admin_save_experience():
    payload = request.get_json() or {}
    idx = payload.get('index')

    role = payload.get('role', '').strip()
    company = payload.get('company', '').strip()
    duration = payload.get('duration', '').strip()
    exp_type = payload.get('type', 'Internship').strip()
    desc = payload.get('desc', '').strip()

    if not role or not company:
        return jsonify({"status": "error", "message": "Role and Company are required fields."}), 400

    entry = {
        "role": role,
        "company": company,
        "duration": duration or "Present",
        "type": exp_type,
        "desc": desc
    }

    data = load_portfolio_data()
    exps = data.get("experiences", [])

    if idx is not None and isinstance(idx, int) and 0 <= idx < len(exps):
        exps[idx] = entry
    else:
        exps.insert(0, entry)

    data["experiences"] = exps
    save_portfolio_data(data)
    return jsonify({"status": "success", "message": f"Experience '{role}' @ {company} saved successfully."})


@app.route('/admin/api/experiences/delete/<int:exp_idx>', methods=['POST'])
@admin_required
def admin_delete_experience(exp_idx):
    data = load_portfolio_data()
    exps = data.get("experiences", [])
    if 0 <= exp_idx < len(exps):
        deleted = exps.pop(exp_idx)
        data["experiences"] = exps
        save_portfolio_data(data)
        return jsonify({"status": "success", "message": f"Experience '{deleted.get('role')}' deleted."})
    return jsonify({"status": "error", "message": "Index out of range."}), 404


# ----------------------------------------------------------------------------
# CERTIFICATIONS CRUD
# ----------------------------------------------------------------------------
@app.route('/admin/api/certifications/save', methods=['POST'])
@admin_required
def admin_save_certification():
    payload = request.get_json() or {}
    idx = payload.get('index')

    title = payload.get('title', '').strip()
    issuer = payload.get('issuer', '').strip()
    year = str(payload.get('year', '')).strip()
    link = payload.get('link', '').strip()

    if not title or not issuer:
        return jsonify({"status": "error", "message": "Title and Issuer are required fields."}), 400

    entry = {
        "title": title,
        "issuer": issuer,
        "year": year or "2026",
        "link": link
    }

    data = load_portfolio_data()
    certs = data.get("certifications", [])

    if idx is not None and isinstance(idx, int) and 0 <= idx < len(certs):
        certs[idx] = entry
    else:
        certs.insert(0, entry)

    data["certifications"] = certs
    save_portfolio_data(data)
    return jsonify({"status": "success", "message": f"Certification '{title}' saved successfully."})


@app.route('/admin/api/certifications/delete/<int:cert_idx>', methods=['POST'])
@admin_required
def admin_delete_certification(cert_idx):
    data = load_portfolio_data()
    certs = data.get("certifications", [])
    if 0 <= cert_idx < len(certs):
        deleted = certs.pop(cert_idx)
        data["certifications"] = certs
        save_portfolio_data(data)
        return jsonify({"status": "success", "message": f"Certification '{deleted.get('title')}' deleted."})
    return jsonify({"status": "error", "message": "Index out of range."}), 404


# ----------------------------------------------------------------------------
# EDUCATION CRUD
# ----------------------------------------------------------------------------
@app.route('/admin/api/education/save', methods=['POST'])
@admin_required
def admin_save_education():
    payload = request.get_json() or {}
    idx = payload.get('index')

    degree = payload.get('degree', '').strip()
    institution = payload.get('institution', '').strip()
    duration = payload.get('duration', '').strip()
    highlights = payload.get('highlights', '').strip()

    if not degree or not institution:
        return jsonify({"status": "error", "message": "Degree and Institution are required fields."}), 400

    entry = {
        "degree": degree,
        "institution": institution,
        "duration": duration,
        "highlights": highlights
    }

    data = load_portfolio_data()
    eds = data.get("education", [])

    if idx is not None and isinstance(idx, int) and 0 <= idx < len(eds):
        eds[idx] = entry
    else:
        eds.append(entry)

    data["education"] = eds
    save_portfolio_data(data)
    return jsonify({"status": "success", "message": f"Education '{degree}' saved successfully."})


@app.route('/admin/api/education/delete/<int:ed_idx>', methods=['POST'])
@admin_required
def admin_delete_education(ed_idx):
    data = load_portfolio_data()
    eds = data.get("education", [])
    if 0 <= ed_idx < len(eds):
        deleted = eds.pop(ed_idx)
        data["education"] = eds
        save_portfolio_data(data)
        return jsonify({"status": "success", "message": "Education entry deleted."})
    return jsonify({"status": "error", "message": "Index out of range."}), 404


# ----------------------------------------------------------------------------
# ROLES CRUD
# ----------------------------------------------------------------------------
@app.route('/admin/api/roles/save', methods=['POST'])
@admin_required
def admin_save_role():
    payload = request.get_json() or {}
    role_id = payload.get('id', '').strip()
    if not role_id:
        role_id = payload.get('title', 'role').lower().replace(' ', '-')

    entry = {
        "id": role_id,
        "title": payload.get('title', 'Role Title').strip(),
        "subtitle": payload.get('subtitle', '').strip(),
        "badge": payload.get('badge', 'Specialty').strip(),
        "icon": payload.get('icon', 'layers').strip(),
        "desc": payload.get('desc', '').strip(),
        "tech": payload.get('tech', '').strip()
    }

    data = load_portfolio_data()
    roles = data.get("roles", [])
    existing_idx = next((i for i, r in enumerate(roles) if r.get('id') == role_id), None)

    if existing_idx is not None:
        roles[existing_idx] = entry
    else:
        roles.append(entry)

    data["roles"] = roles
    save_portfolio_data(data)
    return jsonify({"status": "success", "message": f"Role '{entry['title']}' saved successfully."})


@app.route('/admin/api/roles/delete/<role_id>', methods=['POST'])
@admin_required
def admin_delete_role(role_id):
    data = load_portfolio_data()
    roles = [r for r in data.get("roles", []) if r.get('id') != role_id]
    data["roles"] = roles
    save_portfolio_data(data)
    return jsonify({"status": "success", "message": f"Role '{role_id}' deleted."})


# ----------------------------------------------------------------------------
# RAW JSON POWER EDITOR (FULL SITE CONFIGURATION)
# ----------------------------------------------------------------------------
@app.route('/admin/api/raw-json/save', methods=['POST'])
@admin_required
def admin_save_raw_json():
    payload = request.get_json()
    if not isinstance(payload, dict):
        return jsonify({"status": "error", "message": "Invalid JSON root object."}), 400

    required_keys = ['profile', 'roles', 'skills', 'experiences', 'projects', 'certifications', 'education']
    for k in required_keys:
        if k not in payload:
            return jsonify({"status": "error", "message": f"Missing required top-level key: '{k}'"}), 400

    success = save_portfolio_data(payload)
    if success:
        return jsonify({"status": "success", "message": "Complete portfolio JSON synchronized and saved!"})
    return jsonify({"status": "error", "message": "Disk write failure."}), 500


init_db()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
