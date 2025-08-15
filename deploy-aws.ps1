# AWS Deployment Script for E-commerce Application
# Run this script in PowerShell after restarting your terminal

Write-Host "🚀 AWS E-commerce Deployment Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if AWS CLI is available
Write-Host "📦 Checking AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version
    Write-Host "✅ AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not found. Please restart PowerShell and try again." -ForegroundColor Red
    exit 1
}

# Check if EB CLI is available
Write-Host "📦 Checking EB CLI..." -ForegroundColor Yellow
try {
    $ebVersion = eb --version
    Write-Host "✅ EB CLI found: $ebVersion" -ForegroundColor Green
} catch {
    Write-Host "📥 Installing EB CLI..." -ForegroundColor Yellow
    pip install awsebcli --upgrade --user
}

# Build frontend
Write-Host "🏗️ Building frontend for production..." -ForegroundColor Yellow
Set-Location frontend
npm run build
Set-Location ..

# Configure AWS (if not already configured)
Write-Host "🔑 Checking AWS configuration..." -ForegroundColor Yellow
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS credentials configured" -ForegroundColor Green
} catch {
    Write-Host "⚙️ Please configure AWS credentials:" -ForegroundColor Yellow
    aws configure
}

# Initialize Elastic Beanstalk
Write-Host "🌱 Initializing Elastic Beanstalk..." -ForegroundColor Yellow
if (!(Test-Path ".elasticbeanstalk")) {
    eb init --platform node.js --region us-east-1
} else {
    Write-Host "✅ EB already initialized" -ForegroundColor Green
}

# Set environment variables
Write-Host "🔧 Setting environment variables..." -ForegroundColor Yellow
eb setenv NODE_ENV=production
eb setenv DB_URI=mongodb+srv://ecommuser:Test0101@shopdb.feupn5x.mongodb.net/ecommerce?retryWrites=true&w=majority
eb setenv JWT_SECRET=mysecrettoken123456
eb setenv PAYPAL_CLIENT_ID=Af2rb-rWzsiic25kxiWNFJojTsSKKLw4P-D5m0aCAcJsLIVhd1ecv0uH8o6gDKeSCbYCm-6AiVWZ0hjv
eb setenv PAYPAL_APP_SECRET=EHLUGBXyRmcWNeN_ZdFHOe7gDKnueuh1meSktKsyZZTOkLYZMM-LEWt76echsV4XoiZFcFCGe96SrnyY
eb setenv PAYPAL_API_URL=https://api-m.sandbox.paypal.com

# Create environment and deploy
Write-Host "🚀 Creating environment and deploying..." -ForegroundColor Yellow
eb create production-env

# Deploy application
Write-Host "📤 Deploying application..." -ForegroundColor Yellow
eb deploy

# Open in browser
Write-Host "🌐 Opening application in browser..." -ForegroundColor Yellow
eb open

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "📊 Use 'eb status' to check application status" -ForegroundColor Cyan
Write-Host "📝 Use 'eb logs' to view application logs" -ForegroundColor Cyan
