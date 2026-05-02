# Elect360 🗳️

**Elect360** is a next-generation, intelligent web application designed to empower voters during the Tamil Nadu 2026 State Assembly Elections. It serves as an all-in-one voter dashboard, providing real-time polling booth data, comprehensive candidate profiles, and AI-driven voter assistance—all wrapped in a highly responsive, accessible, and premium user interface.

---

## ✨ Features & Accessibility

### 📍 Smart Booth Locator
- **Live GPS Integration**: Automatically detects the user's location to find the nearest assigned polling station.
- **Manual Fallback**: Provides a step-by-step hierarchical selection (District → Constituency → Ward) for users who prefer not to share their location or are checking on behalf of others.

### 👥 Candidate Explorer
- **Deep Insights**: Displays detailed profiles of candidates running in your constituency, including their educational background, declared assets, and criminal records (data sourced via MyNeta/ECI).
- **Unbiased Presentation**: Candidates are presented in a neutral, easy-to-read grid format to encourage informed voting decisions.

### 📊 Live Crowd Monitoring
- **Real-time Status**: Displays current crowd density at the user's assigned polling booth.
- **Predictive Heatmap**: Uses historical data and user reports to suggest the "Best Time to Vote," helping voters avoid long queues.
- **Crowdsourcing**: Allows users to actively report the crowd level (Low, Moderate, High) after voting to help fellow citizens.

### 🤖 AI Voter Assistant
- **24/7 Guidance**: An integrated chat assistant powered by Google's Gemini AI.
- **Context-Aware**: Answers questions about voting eligibility, required documents, and polling timings based on official election guidelines.

### ♿ Accessibility-First Design
- **High Contrast Mode**: Dark mode default with vibrant, high-contrast accents (e.g., `#D2042D` for critical alerts, `#4ade80` for safe statuses).
- **Large Touch Targets**: Mobile-first design with large, easily tappable buttons and cards.
- **Clear Typography**: Utilizes `Inter` and `Outfit` fonts for maximum legibility on small screens.
- **PWA Ready**: Configured as a Progressive Web App (via Serwist) for fast loading, offline capabilities, and native app-like installation on mobile devices.

---

## 🛠️ Tech Stack

Elect360 is built using a modern, scalable, and highly testable JavaScript stack:

### Frontend Core
- **Framework**: [Next.js 16.2](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`

### Backend & Cloud Services
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore) (NoSQL realtime database for booths, crowd reports, and candidates)
- **AI Integration**: [Google Generative AI](https://ai.google.dev/) (Gemini API for the Voter Assistant)
- **Deployment**: [Google Cloud Run](https://cloud.google.com/run) via Docker (Standalone Next.js build)
- **CI/CD**: Google Cloud Build

### Testing Infrastructure
- **Framework**: [Vitest](https://vitest.dev/) (with JSDOM)
- **Testing Utilities**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Coverage**: Achieved **100%** test coverage across the application's business logic, utilities, and React components!

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Firebase project with Firestore enabled.
- A Google Gemini API Key.

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
   Create a `.env` file in the root directory and populate it with your Firebase and Gemini credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8383](http://localhost:8383) with your browser to see the application.

---

## 🧪 Testing

We take reliability seriously. The project maintains strict 100% test coverage to ensure the dashboard functions perfectly under all network and state conditions.

To run the test suite:
```bash
# Run tests
npm run test

# Run tests with coverage report
npm run test:coverage
```

---

## ☁️ Deployment

The application is containerized and optimized for Google Cloud Run using Next.js standalone builds. 

To deploy to your GCP environment:
1. Ensure the `gcloud` CLI is installed and authenticated.
2. Verify your `.env` file contains the required `NEXT_PUBLIC_` variables.
3. Run the automated deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

*(Note: Ensure your GCP project has Cloud Build, Cloud Run, and Artifact Registry APIs enabled).*
