# AWS Deployment Guide for MERN E-commerce Application

## Architecture Overview
- **Backend**: AWS Elastic Beanstalk (Node.js/Express)
- **Frontend**: AWS S3 + CloudFront (React)
- **Database**: MongoDB Atlas (already configured)
- **File Storage**: AWS S3 for uploads
- **Domain**: AWS Route 53 (optional)

## Prerequisites
1. AWS Account
2. AWS CLI installed and configured
3. EB CLI (Elastic Beanstalk CLI) installed

## Option 1: Deploy Backend + Frontend Together (Simpler)

### Step 1: Install AWS CLI and EB CLI
```bash
# Install AWS CLI
# Download from: https://aws.amazon.com/cli/

# Install EB CLI
pip install awsebcli --upgrade --user
```

### Step 2: Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter default output format (json)
```

### Step 3: Initialize Elastic Beanstalk
```bash
# From project root directory
eb init

# Select:
# 1. Region (e.g., us-east-1)
# 2. Create new application: independant-study-ecommerce
# 3. Platform: Node.js
# 4. Platform version: Latest
# 5. Setup SSH: Yes (recommended)
```

### Step 4: Create Environment Variables File
Create `.env.production` with your production values:
```
NODE_ENV=production
PORT=5000
DB_URI=mongodb+srv://ecommuser:Test0101@shopdb.feupn5x.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_production_jwt_secret_here
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_APP_SECRET=your_paypal_secret
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

### Step 5: Create and Deploy Environment
```bash
# Create environment
eb create production-env

# Deploy
eb deploy

# Open in browser
eb open
```

## Option 2: Separate Deployment (Recommended for Production)

### Backend Deployment (Elastic Beanstalk)

#### Step 1: Prepare Backend for Deployment
```bash
# Create backend-only package
mkdir deploy-backend
cp -r backend/* deploy-backend/
cp package.json deploy-backend/
cp .env.production deploy-backend/.env
cp -r .ebextensions deploy-backend/
```

#### Step 2: Deploy Backend
```bash
cd deploy-backend
eb init
eb create ecommerce-api
eb deploy
```

### Frontend Deployment (S3 + CloudFront)

#### Step 1: Create S3 Bucket
```bash
# Create bucket (replace with unique name)
aws s3 mb s3://your-ecommerce-frontend-bucket

# Enable static website hosting
aws s3 website s3://your-ecommerce-frontend-bucket --index-document index.html --error-document index.html
```

#### Step 2: Update Frontend API URLs
Update your frontend to point to the Elastic Beanstalk API URL:

In `frontend/package.json`, replace the proxy with your EB URL:
```json
{
  "proxy": "http://your-eb-environment.region.elasticbeanstalk.com"
}
```

#### Step 3: Build and Deploy Frontend
```bash
cd frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://your-ecommerce-frontend-bucket --delete

# Make bucket public
aws s3api put-bucket-policy --bucket your-ecommerce-frontend-bucket --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-ecommerce-frontend-bucket/*"
    }
  ]
}'
```

#### Step 4: Create CloudFront Distribution (Optional)
```bash
# Create CloudFront distribution for better performance
aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "ecommerce-frontend-'$(date +%s)'",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-your-ecommerce-frontend-bucket",
        "DomainName": "your-ecommerce-frontend-bucket.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-ecommerce-frontend-bucket",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    }
  },
  "Comment": "E-commerce frontend distribution",
  "Enabled": true
}'
```

## Environment Variables Setup

For production security, set environment variables in AWS:

### Elastic Beanstalk Environment Variables
```bash
eb setenv NODE_ENV=production
eb setenv DB_URI=mongodb+srv://ecommuser:Test0101@shopdb.feupn5x.mongodb.net/ecommerce
eb setenv JWT_SECRET=your_production_jwt_secret
eb setenv PAYPAL_CLIENT_ID=your_paypal_client_id
eb setenv PAYPAL_APP_SECRET=your_paypal_secret
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files with sensitive data
2. **JWT Secret**: Use a strong, unique JWT secret for production
3. **Database**: Consider using AWS DocumentDB instead of MongoDB Atlas
4. **HTTPS**: Elastic Beanstalk provides SSL certificates
5. **CORS**: Configure CORS for your specific frontend domain

## Monitoring and Scaling

1. **CloudWatch**: Monitor application logs and metrics
2. **Auto Scaling**: Configure auto-scaling policies
3. **Health Checks**: Set up application health monitoring
4. **Backups**: Configure automated database backups

## Cost Optimization

1. **Instance Types**: Use appropriate EC2 instance sizes
2. **CloudFront**: Reduces data transfer costs
3. **S3 Storage Classes**: Use appropriate storage classes
4. **Reserved Instances**: Consider reserved instances for predictable workloads

## Deployment Commands Summary

```bash
# Quick deployment (Option 1)
eb init
eb create production-env
eb deploy
eb open

# Manual commands for Option 2
# Backend:
eb init
eb create ecommerce-api
eb setenv NODE_ENV=production [other env vars]
eb deploy

# Frontend:
npm run build
aws s3 sync build/ s3://your-bucket --delete
```

## Troubleshooting

1. **Check logs**: `eb logs`
2. **SSH into instance**: `eb ssh`
3. **Environment health**: `eb health`
4. **Configuration**: `eb config`

## Custom Domain (Optional)

1. Purchase domain in Route 53
2. Create hosted zone
3. Point CloudFront/ALB to custom domain
4. Configure SSL certificate via AWS Certificate Manager
