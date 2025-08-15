# Simple AWS Deployment Script
Write-Host "Deploying E-commerce Application to AWS" -ForegroundColor Green

# Test AWS CLI
Write-Host "Testing AWS CLI..." -ForegroundColor Yellow
$identity = aws sts get-caller-identity --output json | ConvertFrom-Json
Write-Host "AWS CLI working. Account: $($identity.Account)" -ForegroundColor Green

# Create deployment directory
Write-Host "Creating deployment package..." -ForegroundColor Yellow
if (Test-Path "aws-deploy") { Remove-Item "aws-deploy" -Recurse -Force }
New-Item -ItemType Directory -Path "aws-deploy" | Out-Null

# Copy backend files
Write-Host "Copying backend files..." -ForegroundColor Yellow
Copy-Item "backend\*" "aws-deploy\" -Recurse -Force
Copy-Item "package.json" "aws-deploy\" -Force
Copy-Item ".env.production" "aws-deploy\.env" -Force
Copy-Item ".ebextensions" "aws-deploy\" -Recurse -Force

# Copy frontend build
if (Test-Path "frontend\build") {
    Write-Host "Copying frontend build..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "aws-deploy\frontend" -Force | Out-Null
    Copy-Item "frontend\build" "aws-deploy\frontend\" -Recurse -Force
}
else {
    Write-Host "Building frontend first..." -ForegroundColor Yellow
    Set-Location "frontend"
    npm run build
    Set-Location ".."
    New-Item -ItemType Directory -Path "aws-deploy\frontend" -Force | Out-Null
    Copy-Item "frontend\build" "aws-deploy\frontend\" -Recurse -Force
}

# Create ZIP file
Write-Host "Creating deployment ZIP..." -ForegroundColor Yellow
if (Test-Path "ecommerce-app.zip") { Remove-Item "ecommerce-app.zip" -Force }
Compress-Archive -Path "aws-deploy\*" -DestinationPath "ecommerce-app.zip" -CompressionLevel Optimal

Write-Host "Deployment package created: ecommerce-app.zip" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to AWS Elastic Beanstalk Console: https://console.aws.amazon.com/elasticbeanstalk/" -ForegroundColor Cyan
Write-Host "2. Click 'Create Application'" -ForegroundColor Cyan
Write-Host "3. Upload the ecommerce-app.zip file" -ForegroundColor Cyan
Write-Host "4. Set environment variables as shown in the documentation" -ForegroundColor Cyan
