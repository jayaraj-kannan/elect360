#!/bin/bash

# Configuration
PROJECT_ID="pw-2006"
SERVICE_NAME="elect360-app"
REGION="us-central1"

# 1. Load variables from .env carefully
if [ -f .env ]; then
  echo "📄 Found .env file, extracting keys..."
  # Load env variables safely ignoring comments and blank lines
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env file not found! Please create it before deploying."
  exit 1
fi

# 2. Build with all NEXT_PUBLIC_ args injected
echo "🏗️  Starting Cloud Build for $PROJECT_ID..."

gcloud builds submit --config cloudbuild.yaml \
  --substitutions="_NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY},_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN},_NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID},_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET},_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID},_NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}" \
  .

if [ $? -eq 0 ]; then
  echo "✅ Build successful! Deploying to Cloud Run..."
  
  # 3. Deploy to Cloud Run
  gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="GEMINI_API_KEY=${VITE_GEMINI_API_KEY},GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}"
    
  echo "🏁 Deployment finished!"
else
  echo "❌ Build failed. Please check the logs above."
  exit 1
fi
