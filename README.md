# Elect360 🗳️

**Elect360** is a next-generation, intelligent web application designed to empower voters during the **Tamil Nadu 2026 State Assembly Elections**. It serves as an all-in-one voter dashboard—providing real-time polling booth data, comprehensive candidate profiles, an interactive voting guide, and an AI-powered election assistant backed by live Firestore data—all wrapped in a premium, accessible, and responsive interface.

---

## ✨ Features

### 📍 Smart Booth Locator
- **Live GPS Integration**: Automatically detects the user's location to find the nearest assigned polling station.
- **Manual Fallback**: Provides a step-by-step hierarchical selection (District → Constituency → Ward) for users who prefer not to share their location or are checking on behalf of others.
- **Firestore-Powered**: Booth data is fetched in real-time from Firebase Firestore with graceful fallback to local mock data.

### 👥 Candidate Explorer
- **Drill-Down Navigation**: District → Constituency → Candidates. Users explore candidates with an intuitive multi-level flow.
- **Deep Insights**: Displays detailed profiles including education, declared assets (₹), liabilities, criminal records, age, and profession — sourced from MyNeta/ECI data.
- **Candidate Modal**: Click any candidate card to open a premium full-profile modal with financial breakdowns and background details.
- **Unbiased Presentation**: Candidates are presented in a neutral, easy-to-read grid to encourage informed voting.

### 🗳️ Interactive Voting Process Guide
- **7-Step Visual Walkthrough**: An interactive carousel that walks users through every step of the voting process — from identity verification to exiting the booth.
- **Real Booth Images**: Each step is accompanied by actual polling booth photos for a realistic preview.
- **Progress Timeline**: Visual step indicators with smooth animations and direct step-jumping via clickable dots.
- **Built with Framer Motion**: Premium slide transitions for a polished user experience.

### 📊 Live Crowd Monitoring
- **Real-time Status**: Displays current crowd density at the user's assigned polling booth.
- **Predictive Timing**: Suggests the "Best Time to Vote" to help voters avoid long queues.
- **Crowdsourcing Reports**: Authenticated users can report crowd levels (Low, Medium, High) to help fellow citizens plan their visit. Includes a false-reporting warning.

### 🤖 AI Election Assistant (Elee)
- **Gemini-Powered**: An integrated chat assistant powered by Google's Gemini 1.5 Flash model.
- **Agentic Function Calling**: The AI can proactively query your **live Firestore database** using two registered tools:
  - `getConstituenciesByDistrictName` — Fetches constituency lists for any district.
  - `getCandidatesByConstituencyName` — Retrieves detailed candidate profiles for any constituency.
- **Election-Only Scope**: A hardened system prompt ensures the assistant **strictly** answers only election-related questions and politely refuses off-topic queries.
- **Context-Aware**: Knows key election facts (date, voting hours, accepted ID proofs) and can augment database results with its general knowledge for famous candidates.

### 🔐 Firebase Authentication
- **Google Sign-In**: Seamless one-click Google authentication via Firebase Auth.
- **Protected Actions**: Crowd reporting and other civic actions require authentication.
- **Premium User Menu**: Dropdown menu showing user avatar, display name, email, and quick actions (Voter Dashboard, Notifications, Sign Out).

### 📋 Voter Readiness Tools
- **Valid Documents Modal**: Shows all 12 ECI-approved identity documents with descriptions.
- **Voter Checklist**: Interactive pre-voting checklist to ensure readiness.
- **Countdown Hero**: Live countdown timer to Election Day (April 23, 2026) with poll status indicators.

### ♿ Accessibility & Quality
- **ARIA Labels**: All icon-only buttons have descriptive `aria-label` attributes for screen readers.
- **Semantic HTML**: Proper heading hierarchy, landmark elements, and accessible interactive components.
- **High Contrast Mode**: Dark mode default with vibrant, high-contrast accents.
- **Large Touch Targets**: Mobile-first design with large, easily tappable buttons and cards.
- **Clean Typography**: `Inter` and `Outfit` fonts for maximum legibility.
- **PWA Ready**: Progressive Web App via Serwist for fast loading, offline capabilities, and native app-like installation.
- **100% Test Coverage**: 204 tests across 28 test files covering all lines and functions.

---

## 🏗️ Architecture

```
src/
├── app/                        # Next.js App Router
│   ├── api/chat/route.ts       # Gemini AI API route with agentic function calling
│   ├── page.tsx                # Main dashboard (multi-view: Home, Booth, Candidates, Voting Process)
│   ├── layout.tsx              # Root layout with providers
│   └── sw.ts                   # Service Worker (PWA)
├── components/
│   ├── dashboard/              # Feature components
│   │   ├── Assistant.tsx       # AI chat floating widget
│   │   ├── BoothSearchForm.tsx # Manual booth search form
│   │   ├── CandidateExplorer.tsx # District → Constituency → Candidates drill-down
│   │   ├── CandidateModal.tsx  # Full candidate profile modal
│   │   ├── CandidateShowcase.tsx # Candidate grid display
│   │   ├── CountdownHero.tsx   # Election countdown banner
│   │   ├── CrowdReportModal.tsx # Crowdsourced crowd reporting
│   │   ├── PollLocationCard.tsx # Booth locator with GPS
│   │   ├── PollStatusCard.tsx  # Polling status display
│   │   ├── ValidDocumentsModal.tsx # Accepted ID documents
│   │   ├── VoterChecklist.tsx  # Pre-voting readiness checklist
│   │   └── VotingProcess.tsx   # 7-step interactive voting guide
│   ├── layout/                 # Layout components (Navbar, Footer, ThemeToggle, UserMenu)
│   ├── onboarding/             # First-time user flow (IntroCard, OnboardingLocator)
│   └── providers/              # Context providers (Auth, Theme)
├── lib/                        # Services & utilities
│   ├── authContext.tsx         # Firebase Auth context
│   ├── boothService.ts         # Firestore booth queries
│   ├── candidateService.ts     # Firestore candidate queries
│   ├── constituencyService.ts  # Firestore constituency queries
│   └── firebase.ts             # Firebase initialization
├── data/
│   └── electionData.ts         # Static election reference data
└── test/                       # 28 test files, 204 tests
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [Next.js 16.2](https://nextjs.org/) | App Router, Turbopack, API Routes |
| TypeScript | Type-safe development |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Chart.js](https://www.chartjs.org/) | Data visualization |

### Backend & Cloud
| Technology | Purpose |
|------------|---------|
| [Firebase Firestore](https://firebase.google.com/docs/firestore) | Real-time NoSQL database |
| [Firebase Auth](https://firebase.google.com/docs/auth) | Google Sign-In authentication |
| [Google Gemini AI](https://ai.google.dev/) | AI assistant with function calling |
| [Google Cloud Run](https://cloud.google.com/run) | Containerized deployment |
| [Serwist](https://serwist.pages.dev/) | PWA / Service Worker |

### Testing
| Technology | Purpose |
|------------|---------|
| [Vitest](https://vitest.dev/) | Test runner (with JSDOM) |
| [React Testing Library](https://testing-library.com/) | Component testing |
| V8 Coverage | **100% line & function coverage** |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Firebase project with Firestore and Authentication enabled
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/elect360.git
   cd elect360
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8383](http://localhost:8383) to view the application.

---

## 🧪 Testing

The project maintains **100% line and function coverage** across 204 tests in 28 test files.

```bash
# Run tests
npm run test

# Run tests with coverage report
npm run test:coverage
```

**Coverage Summary:**
```
 Test Files  28 passed (28)
      Tests  204 passed (204)

 All files   | 100% Lines | 100% Functions | 97.46% Branches
```

---

## ☁️ Deployment

The application is containerized and optimized for Google Cloud Run using Next.js standalone builds.

```bash
# Make the deploy script executable
chmod +x deploy.sh

# Deploy to Cloud Run
./deploy.sh
```

> **Note:** Ensure your GCP project has Cloud Build, Cloud Run, and Artifact Registry APIs enabled. All `NEXT_PUBLIC_` and `VITE_GEMINI_API_KEY` environment variables must be set in the Cloud Run service configuration.

---

## 📄 License

This project is built for civic empowerment and educational purposes.

---

<p align="center">
  <strong>Built with ❤️ for a stronger democracy</strong><br/>
  <em>enVote South India Team · 2026</em>
</p>
