# Job Finder App

A full-stack job portal built with FastAPI (Python) backend and Next.js (TypeScript) frontend. 

## 🚀 Features

- **Job Scraping**: Automatically scrapes job listings from external sources
- **Resume Upload**: Users can submit resumes with personal information
- **Job Matching**: Uses TF-IDF algorithm to match resumes with relevant job postings
- **Modern UI**: Clean, responsive interface with red theme
- **Authentication**: Clerk integration for user management
- **Real-time Updates**: Live job feed with matched results

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Python**: Core programming language
- **BeautifulSoup**: Web scraping library
- **Scikit-learn**: Machine learning library for TF-IDF matching
- **Uvicorn**: ASGI server for running FastAPI

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Clerk**: Authentication and user management
- **Lucide React**: Icon library

## 📋 Prerequisites

Before running the application, make sure you have the following installed:

- **Python 3.12.6**
- **Node.js 22.11.0**
- **npm or yarn**
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ashwin2201/job-finder.git
cd job-finder
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Create a virtual environment and activate it
```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
```

#### Install Python dependencies
```bash
pip install -r requirements.txt
```

### 3. Frontend Setup

#### Navigate to frontend directory
```bash
cd frontend
```

#### Install Node.js dependencies
```bash
npm install
```

#### Set up environment variables
Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Clerk Environment Variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Optional: Customize Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Note**: Replace the Clerk keys with your actual keys from [Clerk Dashboard](https://dashboard.clerk.com/)

## 🚀 Running the Application

### Method 1: Run Both Services Separately

#### Terminal 1 - Backend
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## 🌐 Accessing the Application

Once both services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)


## 🔗 API Endpoints

### Backend API Routes

- `GET /api/jobs` - Get all job listings
- `GET /api/jobs/{id}` - Get specific job by ID
- `POST /api/submit-resume` - Submit resume for job matching

### Example API Usage

```bash
# Get all jobs
curl http://localhost:8000/api/jobs

# Get specific job
curl http://localhost:8000/api/jobs/1

# Submit resume (POST request)
curl -X POST http://localhost:8000/api/submit-resume \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "text": "Experienced software developer with Python and JavaScript skills..."
  }'
```

## 🎨 Customization

### Theme Customization
The app uses a red theme defined in `frontend/app/globals.css`. To change colors:

1. Edit CSS variables in `:root` and `.dark` sections
2. Modify the `oklch()` color values
3. Restart the frontend development server

### Adding New Features
1. Backend: Add new routes in `main.py`
2. Frontend: Create new pages in `app/` directory
3. Components: Add reusable components in `components/`

