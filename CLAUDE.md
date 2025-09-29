# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MMM-simple-note is a modern distributed note system for MagicMirror built with FastAPI and TypeScript, consisting of two completely independent components:
1. **MagicMirror Module** - Pure frontend display component
2. **Admin Server** - FastAPI backend with TypeScript frontend

## Development Commands

### Backend Development (FastAPI)
```bash
cd admin-server/backend
pip install -r requirements.txt
python run_dev.py      # Development server with hot reload
uvicorn main:app --reload  # Alternative dev command
```

### Frontend Development (TypeScript)
```bash
cd admin-server/frontend
npm install
npm run dev           # Vite dev server
npm run build         # Production build
npm run type-check    # TypeScript type checking
```

### Docker Development
```bash
# Build and run admin server
docker-compose up -d

# View logs
docker-compose logs -f admin-server

# Stop services
docker-compose down
```

### Database Management
```bash
# Access SQLite database directly
cd admin-server/backend/data
sqlite3 notes.db
```

## Architecture

This project uses a **separated container architecture** where the MagicMirror module and admin server run independently.

### Admin Server (`admin-server/`)
- **FastAPI backend** with Python 3.11+ and SQLAlchemy ORM
- **TypeScript frontend** built with Vite for type safety
- **SQLite database** for data persistence
- **Docker multi-stage build** for production deployment
- Runs on port 8000 by default

### MagicMirror Module (`magic-mirror-module/`)
- Frontend display component for MagicMirror
- Fetches data via HTTP API from admin server
- No backend dependencies - pure frontend module
- Installed in MagicMirror's modules directory

### Data Flow
1. Admin creates/edits notes via web interface (port 3001)
2. Admin server stores data in SQLite database
3. MagicMirror module fetches notes via REST API
4. Notes are displayed on MagicMirror interface

### Database Schema (SQLite)
```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Configuration Options (MagicMirror Module)
- `apiUrl`: Admin server API endpoint (default: "http://localhost:3001/api")
- `updateInterval`: How often to refresh notes (default: 60000ms)
- `animationSpeed`: DOM update animation speed (default: 2000ms)
- `maxNotes`: Maximum number of notes to display (default: 5)
- `showTitle`: Whether to show note titles (default: true)

### Project Structure
```
MMM-simple-note/
├── admin-server/               # Containerized admin server
│   ├── server.js              # Express server
│   ├── database.js            # SQLite database layer
│   ├── package.json           # Server dependencies
│   ├── Dockerfile             # Container definition
│   ├── data/                  # SQLite database storage
│   └── public/
│       └── admin.html         # Web admin interface
├── magic-mirror-module/       # MagicMirror module
│   ├── MMM-simple-note.js     # Main module file
│   ├── MMM-simple-note.css    # Module styling
│   ├── package.json           # Module metadata
│   └── translations/
│       ├── en.json            # English translations
│       └── ko.json            # Korean translations
├── docker-compose.yml         # Docker orchestration
└── README.md                  # Project documentation
```

### API Endpoints (Admin Server)
- `GET /api/notes` - Retrieve all notes
- `POST /api/notes` - Create new note (requires: content, optional: title)
- `PUT /api/notes/:id` - Update existing note
- `DELETE /api/notes/:id` - Delete note
- `GET /health` - Server health check

### Deployment Notes
- Admin server runs in Docker container with persistent volume for SQLite database
- MagicMirror module is installed separately in MagicMirror installation
- Configure `apiUrl` in MagicMirror config to point to admin server container
- Use Docker networking or host networking for container communication