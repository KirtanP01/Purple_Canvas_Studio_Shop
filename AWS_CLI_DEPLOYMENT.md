# 🚀 AWS Deployment Guide - AWS CLI Only Method

## ✅ Status Check
- ✅ AWS CLI installed and configured
- ✅ AWS credentials working (Account: 473451404853)
- ✅ Project ready for deployment

## Method 1: AWS Console Deployment (Recommended)

Since we have AWS CLI working but EB CLI installation is problematic, let's use the AWS Console method:

### Step 1: Prepare Deployment Package

1. **Create deployment folder:**
```powershell
mkdir aws-deploy
```

2. **Copy necessary files:**
```powershell
# Copy backend files
Copy-Item backend\* aws-deploy\ -Recurse
Copy-Item package.json aws-deploy\
Copy-Item .env.production aws-deploy\.env
Copy-Item .ebextensions aws-deploy\ -Recurse

# Copy frontend build
Copy-Item frontend\build aws-deploy\frontend\ -Recurse
```

3. **Create ZIP file:**
```powershell
Compress-Archive -Path aws-deploy\* -DestinationPath ecommerce-app.zip
```

### Step 2: Deploy via AWS Console

1. **Open AWS Elastic Beanstalk Console:**
   - Go to https://console.aws.amazon.com/elasticbeanstalk/
   - Click "Create Application"

2. **Application Configuration:**
   - Application name: `ecommerce-app`
   - Platform: `Node.js`
   - Platform version: `Latest`
   - Upload your code: Select `ecommerce-app.zip`

3. **Environment Configuration:**
   - Environment name: `production-env`
   - Domain: (auto-generated or custom)

4. **Environment Variables:**
   Add these in "Configuration" → "Software" → "Environment properties":
   ```
   NODE_ENV=production
   DB_URI=mongodb+srv://ecommuser:Test0101@shopdb.feupn5x.mongodb.net/ecommerce?retryWrites=true&w=majority
   JWT_SECRET=mysecrettoken123456
   PAYPAL_CLIENT_ID=Af2rb-rWzsiic25kxiWNFJojTsSKKLw4P-D5m0aCAcJsLIVhd1ecv0uH8o6gDKeSCbYCm-6AiVWZ0hjv
   PAYPAL_APP_SECRET=EHLUGBXyRmcWNeN_ZdFHOe7gDKnueuh1meSktKsyZZTOkLYZMM-LEWt76echsV4XoiZFcFCGe96SrnyY
   PAYPAL_API_URL=https://api-m.sandbox.paypal.com
   ```

## Method 2: AWS CLI Commands (Alternative)

### Step 1: Create S3 Bucket for Deployment
```powershell
aws s3 mb s3://ecommerce-deploy-bucket-473451404853
```

### Step 2: Upload Application
```powershell
aws s3 cp ecommerce-app.zip s3://ecommerce-deploy-bucket-473451404853/
```

### Step 3: Create Application
```powershell
aws elasticbeanstalk create-application --application-name ecommerce-app --description "MERN Stack E-commerce Application"
```

### Step 4: Create Environment
```powershell
aws elasticbeanstalk create-environment --application-name ecommerce-app --environment-name production-env --solution-stack-name "64bit Amazon Linux 2023 v6.0.6 running Node.js 20"
```

## Method 3: PowerShell Deployment Script

Here's a complete script that uses only AWS CLI:
