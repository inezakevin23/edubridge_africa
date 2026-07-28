# Edubridge Africa Platform

A full-stack platform connecting students with companies through challenges and submissions, built with Django REST Framework and React.

## Tech Stack

- **Backend**: Django 6.0.7, Django REST Framework, SimpleJWT
- **Frontend**: React 19, Vite, TailwindCSS
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose

## Prerequisites

Choose the setup method that works best for you:

### For Docker Setup (Recommended)

- Docker Engine 20.10+
- Docker Compose v2.0+

### For Local Setup

- Python 3.10+
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

---

## Option 1: Docker Setup (Recommended)

This is the fastest way to get the entire stack running with isolated containers.

### 1. Clone the Repository

```bash
git clone <repository-url> edubridge_africa
cd edubridge_africa
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (same level as `docker-compose.yml`):

```env
# Database Configuration
POSTGRES_DB=edubridge_db
POSTGRES_USER=edubridge_user
POSTGRES_PASSWORD=your_secure_password_here

# Django Configuration
DJANGO_SECRET_KEY=your_django_secret_key_here
```

**Generate a Django Secret Key:**

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 3. Start All Services

```bash
docker-compose up -d --build
```

This will start:

- PostgreSQL database on port `5432`
- Django backend API on `http://localhost:8000`
- React frontend on `http://localhost:3000`

### 4. Run Database Migrations

```bash
docker-compose exec backend python manage.py migrate
```

### 5. (Optional) Seed Initial Data

```bash
docker-compose exec backend python manage.py seed_data
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs/

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop services and remove volumes (clears database)
docker-compose down -v

# Restart a specific service
docker-compose restart backend

# Execute commands in backend container
docker-compose exec backend python manage.py createsuperuser
```

---

## Option 2: Local Setup (Development)

Use this if you want to run services natively for easier debugging and development.

### 1. Clone the Repository

```bash
git clone <repository-url> edubridge_africa
cd edubridge_africa
```

### 2. Set Up PostgreSQL Database

Create a PostgreSQL database and user:

```bash
# Log into PostgreSQL (you may need to use your system's postgres user)
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE edubridge_db;
CREATE USER edubridge_user WITH PASSWORD '1234kevin';
ALTER ROLE edubridge_user SET client_encoding TO 'utf8';
ALTER ROLE edubridge_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE edubridge_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE edubridge_db TO edubridge_user;
\q
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Ensure the backend `.env` file exists with correct values (it's already present in the repo):

```env
SECRET_KEY=?%k0nklytd*k8@m^c4Ky_v+@@he+=@^6ucu3e_kwcgqc&-g+jk
DEBUG=True

DB_NAME=edubridge_db
DB_USER=edubridge_user
DB_PASSWORD=1234kevin
DB_HOST=localhost
DB_PORT=5432

ALLOWED_HOSTS=127.0.0.1,localhost

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Run migrations:

```bash
python manage.py migrate
```

Create a superuser (optional):

```bash
python manage.py createsuperuser
```

Start the backend server:

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 4. Frontend Setup

Open a new terminal and keep the backend running:

```bash
cd frontend

# Install dependencies
npm install
```

For local development, ensure the Vite dev server proxy is configured to hit the backend (already configured in `vite.config.js`).

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## Verification

### Verify Backend

```bash
# In backend directory with venv activated
python manage.py test
```

Expected: All tests pass.

### Verify Frontend

Check that the dev server is running and the app loads in the browser at `http://localhost:5173`.

---

## Seed Data

To populate the database with sample challenges and users:

```bash
# Docker
docker-compose exec backend python manage.py seed_data

# Local
cd backend
python manage.py seed_data
```

---

## Project Structure

```
edubridge_africa/
├── backend/
│   ├── config/           # Django settings and URLs
│   ├── accounts/         # User authentication and profiles
│   ├── challenges/       # Challenge creation and management
│   ├── submissions/      # Student solution submissions
│   ├── dashboard/        # Dashboard views and analytics
│   ├── notifications/    # Notification system
│   ├── profiles/         # Extended profile models
│   ├── common/           # Shared utilities and middleware
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service calls
│   │   ├── context/      # React context providers
│   │   ├── routes/       # Route configuration
│   │   └── data/         # Mock data and constants
│   ├── package.json
│   ├── vite.config.js
│   └── .env.production
├── docker-compose.yml
└── README.md
```

---

## API Documentation

When running, visit:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/

---

## Common Issues

### Database Connection Errors

**Docker**: Ensure PostgreSQL container is healthy:

```bash
docker-compose ps
# Should show db as "healthy"
```

**Local**: Verify PostgreSQL is running:

```bash
sudo service postgresql status  # Linux
# or
brew services list              # Mac with Homebrew
```

### Port Already in Use

If ports 3000, 5173, or 8000 are already occupied:

**Docker**: Edit `docker-compose.yml` to map different host ports.

```yaml
ports:
  - "3001:80" # Frontend
  - "8001:8000" # Backend
```

**Local**: Modify the port in the run command:

```bash
python manage.py runserver 8001
npm run dev -- --port 5174
```

### CORS Errors

Ensure CORS is properly configured:

- Backend `.env` has `CORS_ALLOWED_ORIGINS=http://localhost:5173`
- Frontend API client points to `http://localhost:8000`

### Migrations Not Applying

```bash
# Docker
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Local
python manage.py makemigrations
python manage.py migrate
```

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable               | Description                                 | Example                      |
| ---------------------- | ------------------------------------------- | ---------------------------- |
| `SECRET_KEY`           | Django secret key for cryptographic signing | `django-insecure-abc123...`  |
| `DEBUG`                | Enable debug mode                           | `True` / `False`             |
| `DB_NAME`              | PostgreSQL database name                    | `edubridge_db`               |
| `DB_USER`              | PostgreSQL username                         | `edubridge_user`             |
| `DB_PASSWORD`          | PostgreSQL password                         | `secure_password`            |
| `DB_HOST`              | Database host                               | `localhost` or `db` (Docker) |
| `DB_PORT`              | Database port                               | `5432`                       |
| `ALLOWED_HOSTS`        | Comma-separated allowed hosts               | `localhost,127.0.0.1`        |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins             | `http://localhost:5173`      |

### Frontend (`.env.production`)

| Variable            | Description          | Example                   |
| ------------------- | -------------------- | ------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `https://api.example.com` |

---

## Next Steps

- Create an admin user: `python manage.py createsuperuser`
- Seed sample data: `python manage.py seed_data`
- Read the API docs at `/api/docs/`
- Customize the frontend theme in `frontend/src/index.css`

---

## License

[Your License Here]
