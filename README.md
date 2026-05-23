# Online Code Judge

An online code judge with Docker-based sandboxed execution. Users can register, log in, write C/C++ code in a browser-based editor, and submit it against test cases. Each submission runs inside an isolated Docker container with strict resource limits.

## Tech Stack

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind v4 |
| Backend  | Flask, psycopg2, Docker SDK for Python  |
| Database | PostgreSQL (via Docker)                 |
| Sandbox  | Alpine Linux container (GCC / G++)      |
| Auth     | JWT + bcrypt                            |

## Project Structure

```
.
├── backend/
│   ├── app.py                        # Flask application entry point
│   ├── .env                          # Environment variables (not committed)
│   └── services/
│       ├── authentication.py         # Login, register, JWT token handling
│       ├── compiling_service.py      # Docker sandbox management & code execution
│       └── utilis/
│           └── Dockerfile            # Dockerfile for the code runner sandbox
├── frontend/
│   ├── src/
│   │   ├── App.tsx                   # Routes: /login, /register, /
│   │   └── components/
│   │       ├── Login.tsx
│   │       ├── Register.tsx
│   │       ├── MainPage.tsx
│   │       ├── CodeArea.tsx
│   │       ├── ResultPanel.tsx
│   │       └── Alert.tsx
│   ├── package.json
│   └── vite.config.ts
└── .gitignore
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running
- [Node.js](https://nodejs.org/) (v18+)
- [Python 3](https://www.python.org/downloads/) (3.10+)
- `pip` (Python package manager)

## Setup & Run

### 1. Start the PostgreSQL Database

```bash
docker run -d \
  --name postgres-auth \
  -e POSTGRES_DB=authdb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  postgres:latest
```

Create the `users` table:

```bash
docker exec -it postgres-auth psql -U postgres -d authdb -c "
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);"
```

### 2. Build the Code Runner Sandbox Image

```bash
cd backend/services/utilis
docker build -t code_runner_image .
cd ../../..
```

> The backend will auto-build this image on the first submission if it doesn't exist, but pre-building avoids the initial delay.

### 3. Set Up the Backend

```bash
cd backend

# Create and activate a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install flask flask-cors psycopg2-binary python-dotenv bcrypt pyjwt docker
```

Create a `.env` file in `backend/` (if not already present):

```
SECRET_KEY=my_super_secret_key
DB_PASSWORD=secret
```

Start the Flask server:

```bash
python app.py
```

The backend runs at **http://localhost:5000**.

### 4. Set Up the Frontend

```bash
cd frontend

npm install
npm run dev
```

The frontend runs at **http://localhost:5173**.

## API Endpoints

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/login`         | Authenticate user, returns JWT token |
| POST   | `/register`      | Register a new user, returns JWT     |
| POST   | `/verify_token`  | Validate an existing JWT token       |
| POST   | `/execute_code`  | Submit code for compilation and run  |

### `POST /execute_code` — Request Body

```json
{
  "code": "#include <stdio.h>\nint main() { printf(\"hello\"); return 0; }",
  "language": "C",
  "input": "",
  "expected": "hello",
  "token": "<jwt_token>"
}
```

## Sandbox Security

Each code submission runs in a freshly created Docker container with the following restrictions:

- **Read-only filesystem** — only a small tmpfs workdir is writable
- **Network disabled** — no outbound connections
- **PID limit** — max 16 processes
- **Memory limit** — 200 MB
- **Time limit** — 5 second execution timeout
- **Capabilities dropped** — all Linux capabilities removed
- **No privilege escalation** — `no-new-privileges` enforced
- **Non-root user** — code runs as an unprivileged `sandbox` user
