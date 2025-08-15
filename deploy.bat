@echo off
echo 🚀 Deploying E-commerce Application to AWS

REM Build frontend
echo 📦 Building frontend...
cd frontend
call npm run build
cd ..

REM Deploy to Elastic Beanstalk
echo 🌐 Deploying to Elastic Beanstalk...
call eb deploy

echo ✅ Deployment complete!
echo 🔗 Opening application...
call eb open
