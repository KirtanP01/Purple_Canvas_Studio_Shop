# 🚀 Step-by-Step AWS Deployment Guide

## ✅ Prerequisites Completed
- AWS CLI installed
- Python installed
- Project is production-ready

## Step 1: Complete Tool Setup

### Option A: Restart Terminal and Continue
1. **Close this terminal/PowerShell window**
2. **Open a new PowerShell window as Administrator**
3. **Navigate to your project:** `cd c:\Users\kirta\Documents\Github\independant_study_project`
4. **Test AWS CLI:** `aws --version`
5. **Install EB CLI:** `pip install awsebcli --upgrade --user`

### Option B: Alternative EB CLI Installation
If pip doesn't work, use this alternative:
1. Download EB CLI installer from: https://github.com/aws/aws-elastic-beanstalk-cli-setup
2. Follow the installation instructions

## Step 2: Configure AWS Credentials

Run this command and enter your AWS credentials:
```bash
aws configure
```

Enter:
- **AWS Access Key ID:** (from your AWS account)
- **AWS Secret Access Key:** (from your AWS account)
- **Default region:** us-east-1 (or your preferred region)
- **Default output format:** json

### How to Get AWS Credentials:
1. Go to AWS Console → IAM → Users → Your User
2. Click "Security credentials" tab
3. Click "Create access key"
4. Choose "Command Line Interface (CLI)"
5. Copy the Access Key ID and Secret Access Key

## Step 3: Initialize Elastic Beanstalk

In your project directory, run:
```bash
eb init
```

When prompted:
1. **Select region:** Choose your preferred region (e.g., us-east-1)
2. **Application name:** ecommerce-app (or your preferred name)
3. **Platform:** Node.js
4. **Platform version:** Latest available
5. **CodeCommit:** No
6. **SSH:** Yes (recommended for debugging)

## Step 4: Set Environment Variables

Create environment variables for production:
```bash
eb setenv NODE_ENV=production
eb setenv DB_URI=mongodb+srv://ecommuser:Test0101@shopdb.feupn5x.mongodb.net/ecommerce?retryWrites=true&w=majority
eb setenv JWT_SECRET=mysecrettoken123456
eb setenv PAYPAL_CLIENT_ID=Af2rb-rWzsiic25kxiWNFJojTsSKKLw4P-D5m0aCAcJsLIVhd1ecv0uH8o6gDKeSCbYCm-6AiVWZ0hjv
eb setenv PAYPAL_APP_SECRET=EHLUGBXyRmcWNeN_ZdFHOe7gDKnueuh1meSktKsyZZTOkLYZMM-LEWt76echsV4XoiZFcFCGe96SrnyY
eb setenv PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

## Step 5: Create and Deploy Environment

```bash
# Create the environment (this will take 5-10 minutes)
eb create production-env

# Deploy your application
eb deploy

# Open in browser
eb open
```

## Step 6: Monitor and Manage

```bash
# Check application status
eb status

# View logs
eb logs

# Check health
eb health

# SSH into instance (if needed)
eb ssh
```

## 🔧 Troubleshooting

### If deployment fails:
1. **Check logs:** `eb logs`
2. **Verify environment variables:** `eb printenv`
3. **Check application health:** `eb health`

### Common issues:
- **Build fails:** Make sure all dependencies are in package.json
- **Environment variables missing:** Re-run `eb setenv` commands
- **Database connection fails:** Verify MongoDB Atlas connection string

## 🌟 Alternative: Manual AWS Console Deployment

If CLI doesn't work, you can deploy via AWS Console:

1. **Go to AWS Elastic Beanstalk Console**
2. **Create Application**
3. **Upload your project as ZIP file**
4. **Configure environment variables in the console**
5. **Deploy**

## 📱 Quick Commands Reference

```bash
# Essential commands
eb init                    # Initialize EB in project
eb create production-env   # Create environment
eb deploy                  # Deploy application
eb open                    # Open in browser
eb terminate              # Delete environment (when done)

# Monitoring
eb status                 # Check status
eb logs                   # View logs
eb health                 # Check health

# Configuration
eb setenv KEY=VALUE       # Set environment variable
eb printenv               # Show all environment variables
eb config                 # Edit configuration
```

## 💰 Cost Information

**Estimated monthly cost:**
- **Small application (t3.micro):** ~$15-25/month
- **Medium traffic (t3.small):** ~$30-50/month
- **High traffic:** Auto-scaling based on usage

**Free tier:** New AWS accounts get 750 hours/month free for 12 months

## 🎯 Next Steps After Deployment

1. **Custom Domain:** Configure Route 53 for custom domain
2. **SSL Certificate:** Enable HTTPS (automatic with EB)
3. **Monitoring:** Set up CloudWatch alerts
4. **Backups:** Configure database backups
5. **CI/CD:** Set up automatic deployments from GitHub

## 📞 Support

If you need help:
1. Check AWS Elastic Beanstalk documentation
2. AWS Support (if you have a support plan)
3. AWS Community forums
4. Stack Overflow with 'aws-elastic-beanstalk' tag
