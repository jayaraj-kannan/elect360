#!/bin/bash

# Configuration
PROJECT_ID="pw-2006"
SERVICE_NAME="elect360-app"
REGION="us-central1"

# 1. Load variables from .env carefully
if [ -f .env ]; then
  echo "📄 Found .env file, extracting keys..."
else
  echo "❌ .env file not found! Please create it before deploying."
  exit 1
fi

# 2. Build with all VITE_ args injected
echo "🏗️  Starting Cloud Build for $PROJECT_ID..."

gcloud builds submit --config cloudbuild.yaml \
  --substitutions="_VITE_FIREBASE_API_KEY=$(grep VITE_FIREBASE_API_KEY .env | cut -d '=' -f2)","_VITE_FIREBASE_AUTH_DOMAIN=$(grep VITE_FIREBASE_AUTH_DOMAIN .env | cut -d '=' -f2)","_VITE_FIREBASE_PROJECT_ID=$(grep VITE_FIREBASE_PROJECT_ID .env | cut -d '=' -f2)","_VITE_FIREBASE_STORAGE_BUCKET=$(grep VITE_FIREBASE_STORAGE_BUCKET .env | cut -d '=' -f2)","_VITE_FIREBASE_MESSAGING_SENDER_ID=$(grep VITE_FIREBASE_MESSAGING_SENDER_ID .env | cut -d '=' -f2)","_VITE_FIREBASE_APP_ID=$(grep VITE_FIREBASE_APP_ID .env | cut -d '=' -f2)","_VITE_GEMINI_API_KEY=$(grep VITE_GEMINI_API_KEY .env | cut -d '=' -f2)","_VITE_GOOGLE_MAPS_API_KEY=$(grep VITE_GOOGLE_MAPS_API_KEY .env | cut -d '=' -f2)" \
  .

if [ $? -eq 0 ]; then
  echo "✅ Build successful! Deploying to Cloud Run..."
  
  # 3. Deploy to Cloud Run
  gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated
    
  echo "🏁 Deployment finished!"
else
  echo "❌ Build failed. Please check the logs above."
  exit 1
fi
