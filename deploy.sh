#!/bin/bash

echo "🚀 Deploying E-commerce Application to AWS"

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# Deploy to Elastic Beanstalk
echo "🌐 Deploying to Elastic Beanstalk..."
eb deploy

echo "✅ Deployment complete!"
echo "🔗 Opening application..."
eb open
