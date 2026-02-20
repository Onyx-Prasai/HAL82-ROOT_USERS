# Project SANGAM: The Confluence

**Project SANGAM** is a premium, high-tech ecosystem designed to accelerate the Nepali startup landscape. It serves as a digital bridge connecting Founders, Investors, and Experts in a "Modern Minimalist" environment.

## 🏔️ The Vision
In the spirit of a "Sangam" (The Confluence), this platform merges scattered innovation into a powerful stream, scaling Nepal's potential to the global stage.

## 🛠️ Tech Stack
- **Backend**: Django, Django REST Framework (DRF), SimpleJWT, ReportLab (PDF generation).
- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion (Animations), Recharts (Data Visualization), Lucide React (Icons).
- **Design Philosophy**: Modern Minimalist — Clean whitespace, Deep Slate (#1E293B), and Emerald Green (#10B981).

## 🚀 Key Features

### 1. The Gateway (Auth & Onboarding)
- **Multi-Role Login**: Tailored experiences for Founders, Investors, and Experts.
- **Role-Picker Wizard**: Intelligent onboarding collecting personas (Hacker/Hipster/Hustler) and verification details.
- **Secure JWT**: State-of-the-less authentication for a smooth experience.

### 2. Uthan Dashboard
- **Interactive Nepal Map**: A hotspot visualization of activity across all 7 provinces.
- **Global Stats**: Real-time ticker for ecosystem growth metrics.
- **Karma Score**: A widget displaying your "Social Capital" within the SANGAM network.

### 3. Jodi Matcher
- **AI-Driven Discovery**: Automated filtering to find complementary co-founders (e.g., Hackers matching with Hustlers).
- **Trust Badges**: Integration with LinkedIn and Nagarik App for verified profiles.
- **Digital Trial**: One-click proposal for a 2-week digital cooperation agreement.

### 4. Pulse Ledger
- **Weekly KPI Tracking**: A Sunday-only protocol asking for revenue, users, and expenses.
- **Animated Growth Charts**: Beautifully rendered line and area graphs using Recharts.
- **Investor Privacy**: Granular control over the visibility of your startup's pulse.

### 5. Syndicate & Service Hub
- **Syndicate Hub**: Tracking fractional investments with real-time progress bars.
- **Smart-Statutes**: Automated generation of standardized investment terms in PDF format.
- **Expert Marketplace**: A vetted directory of CAs, Lawyers, and Designers with booking capabilities.

### 6. Vision Page
- **Parallax Narrative**: A vertical scrolling experience explaining the "Island Effect" vs "Confluence."
- **Growth Timeline**: Interactive milestones of the Nepali startup revolution.

---

## 💻 Setup Instructions

### Backend (Django)
1. **Navigate to backend**:
   ```bash
   cd backend
   ```
2. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   ```
3. **Activate Virtual Environment**:
   - **Windows**: `.\venv\Scripts\activate`
   - **macOS/Linux**: `source venv/bin/activate`
4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
5. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
6. **Start the server**:
   ```bash
   python manage.py runserver
   ```

### Frontend (React)
1. **Navigate to frontend**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure
```text
HAL82-ROOT_USERS/
├── backend/            # Django Application
│   ├── sangam/         # Project Settings
│   ├── users/          # Auth & Profiles
│   ├── core/           # Dashboard, Matching, Ledger, Syndicates
│   └── manage.py
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main application sections
│   │   ├── services/   # API configuration
│   │   └── App.jsx     # Routing & Navigation
│   └── tailwind.config.js
└── README.md
```

## 📜 License
Developed for Project SANGAM. All rights reserved.
