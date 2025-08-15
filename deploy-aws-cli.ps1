# AWS Deployment Script using AWS CLI only
Write-Host "Deploying E-commerce Application to AWS using AWS CLI" -ForegroundColor Green

# Refresh PATH to ensure AWS CLI is available
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")

# Test AWS CLI
Write-Host "Testing AWS CLI..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
    Write-Host "AWS CLI working. Account: $($identity.Account)" -ForegroundColor Green
}
catch {
    Write-Host "AWS CLI not working. Please configure with 'aws configure'" -ForegroundColor Red
    exit 1
}

# Create deployment directory
Write-Host "📁 Creating deployment package..." -ForegroundColor Yellow
if (Test-Path "aws-deploy") { Remove-Item "aws-deploy" -Recurse -Force }
New-Item -ItemType Directory -Path "aws-deploy" | Out-Null

# Copy backend files
Write-Host "📦 Copying backend files..." -ForegroundColor Yellow
Copy-Item "backend\*" "aws-deploy\" -Recurse -Force
Copy-Item "package.json" "aws-deploy\" -Force
Copy-Item ".env.production" "aws-deploy\.env" -Force
Copy-Item ".ebextensions" "aws-deploy\" -Recurse -Force

# Copy frontend build (if exists)
if (Test-Path "frontend\build") {
    Write-Host "📦 Copying frontend build..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "aws-deploy\frontend" -Force | Out-Null
    Copy-Item "frontend\build" "aws-deploy\frontend\" -Recurse -Force
} else {
    Write-Host "⚠️ Frontend build not found. Building now..." -ForegroundColor Yellow
    Set-Location "frontend"
    npm run build
    Set-Location ".."
    New-Item -ItemType Directory -Path "aws-deploy\frontend" -Force | Out-Null
    Copy-Item "frontend\build" "aws-deploy\frontend\" -Recurse -Force
}

# Create ZIP file
Write-Host "🗜️ Creating deployment ZIP..." -ForegroundColor Yellow
if (Test-Path "ecommerce-app.zip") { Remove-Item "ecommerce-app.zip" -Force }
Compress-Archive -Path "aws-deploy\*" -DestinationPath "ecommerce-app.zip" -CompressionLevel Optimal

# Create unique S3 bucket name
$bucketName = "ecommerce-deploy-$(Get-Random)-473451404853"
Write-Host "🪣 Creating S3 bucket: $bucketName" -ForegroundColor Yellow

# Create S3 bucket
try {
    aws s3 mb "s3://$bucketName" --region us-east-1
    Write-Host "✅ S3 bucket created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create S3 bucket" -ForegroundColor Red
    exit 1
}

# Upload ZIP to S3
Write-Host "⬆️ Uploading application to S3..." -ForegroundColor Yellow
aws s3 cp "ecommerce-app.zip" "s3://$bucketName/"

# Create Elastic Beanstalk application
Write-Host "🌱 Creating Elastic Beanstalk application..." -ForegroundColor Yellow
try {
    aws elasticbeanstalk create-application --application-name "ecommerce-app" --description "MERN Stack E-commerce Application"
    Write-Host "✅ Application created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Application might already exist, continuing..." -ForegroundColor Yellow
}

# Create application version
$versionLabel = "v$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "📋 Creating application version: $versionLabel" -ForegroundColor Yellow
aws elasticbeanstalk create-application-version --application-name "ecommerce-app" --version-label $versionLabel --source-bundle "S3Bucket=$bucketName,S3Key=ecommerce-app.zip"

# Create environment
Write-Host "🌍 Creating Elastic Beanstalk environment..." -ForegroundColor Yellow
Write-Host "⏳ This will take 5-10 minutes..." -ForegroundColor Yellow

$envConfig = @'
[
  {
    "Namespace": "aws:elasticbeanstalk:application:environment",
    "OptionName": "NODE_ENV",
    "Value": "production"
  },
  {
    "Namespace": "aws:elasticbeanstalk:application:environment",
    "OptionName": "DB_URI",
    "Value": "mongodb+srv://ecommuser:Test0101@shopdb.feupn5x.mongodb.net/ecommerce?retryWrites=true&w=majority"
  },
  {
    "Namespace": "aws:elasticbeanstalk:application:environment",
    "OptionName": "JWT_SECRET",
    "Value": "mysecrettoken123456"
  },
  {
    "Namespace": "aws:elasticbeanstalk:application:environment",
    "OptionName": "PAYPAL_CLIENT_ID",
    "Value": "Af2rb-rWzsiic25kxiWNFJojTsSKKLw4P-D5m0aCAcJsLIVhd1ecv0uH8o6gDKeSCbYCm-6AiVWZ0hjv"
  },
  {
    "Namespace": "aws:elasticbeanstalk:application:environment",
    "OptionName": "PAYPAL_APP_SECRET",
    "Value": "EHLUGBXyRmcWNeN_ZdFHOe7gDKnueuh1meSktKsyZZTOkLYZMM-LEWt76echsV4XoiZFcFCGe96SrnyY"
  },
  {
    "Namespace": "aws:elasticbeanstalk:application:environment",
    "OptionName": "PAYPAL_API_URL",
    "Value": "https://api-m.sandbox.paypal.com"
  }
]
'@

$envConfig | Out-File -FilePath "env-config.json" -Encoding UTF8

aws elasticbeanstalk create-environment --application-name "ecommerce-app" --environment-name "production-env" --version-label $versionLabel --solution-stack-name "64bit Amazon Linux 2023 v6.0.6 running Node.js 20" --option-settings file://env-config.json

Write-Host "🎉 Deployment initiated! Environment is being created..." -ForegroundColor Green
Write-Host "⏳ Please wait 5-10 minutes for the environment to be ready" -ForegroundColor Yellow
Write-Host "🌐 You can monitor progress in the AWS Console:" -ForegroundColor Cyan
Write-Host "   https://console.aws.amazon.com/elasticbeanstalk/" -ForegroundColor Cyan

# Wait for environment to be ready
Write-Host "⏳ Waiting for environment to be ready..." -ForegroundColor Yellow
do {
    Start-Sleep -Seconds 30
    $status = aws elasticbeanstalk describe-environments --application-name "ecommerce-app" --environment-names "production-env" --query "Environments[0].Status" --output text
    Write-Host "Environment status: $status" -ForegroundColor Yellow
} while ($status -eq "Launching")

if ($status -eq "Ready") {
    Write-Host "✅ Environment is ready!" -ForegroundColor Green
    $url = aws elasticbeanstalk describe-environments --application-name "ecommerce-app" --environment-names "production-env" --query "Environments[0].CNAME" --output text
    Write-Host "🌐 Your application is live at: http://$url" -ForegroundColor Green
    
    # Open in browser
    Start-Process "http://$url"
} else {
    Write-Host "❌ Environment creation failed. Status: $status" -ForegroundColor Red
    Write-Host "Please check the AWS Console for more details" -ForegroundColor Yellow
}

# Cleanup
Remove-Item "env-config.json" -Force
Write-Host "🧹 Cleanup completed" -ForegroundColor Green
