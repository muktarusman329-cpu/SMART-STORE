# Production Deployment Guide

This guide will help you deploy Smart Mart Pro to Railway.

## Hosting Stack

- **Frontend/Backend**: Railway
- **Database**: MongoDB Atlas (Free Tier - 512MB)
- **Images**: Cloudinary (Free Tier)
- **Payments**: Paystack (Free tier available)

## Step 1: Set Up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (Free tier M0)
4. Create a database user with username and password
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
6. Whitelist IP addresses (0.0.0.0/0 for all IPs, or specific IPs)

**Connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/smartmart?retryWrites=true&w=majority
```

## Step 2: Set Up Cloudinary (Free)

1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. Go to Dashboard → Settings
4. Copy:
   - Cloud name
   - API Key
   - API Secret

## Step 3: Set Up Paystack (Free)

1. Go to [Paystack](https://paystack.co)
2. Create a free account
3. Go to Settings → API Keys
4. Copy:
   - Public Key
   - Secret Key

## Step 4: Set Up Google AI Studio (Free)

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create a free account
3. Generate an API key
4. Copy the API key

## Step 5: Deploy to Railway

### Option A: Using Railway Dashboard (Recommended)

1. Go to [Railway](https://railway.app)
2. Create a free account (or sign in with GitHub)
3. Click "New Project" → "Deploy from GitHub Repo"
4. Select the `SMART-STORE` repository
5. Railway will auto-detect the Next.js framework and deploy

### Option B: Using Railway CLI

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize project:
```bash
railway init
```

4. Deploy:
```bash
railway up
```

## Step 6: Configure Environment Variables in Railway

After deployment, add these environment variables in Railway Dashboard:

1. Go to your project in Railway Dashboard
2. Click on your service → "Variables"
3. Add each variable:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `NEXTAUTH_URL` | Your Railway domain (https://your-app.up.railway.app) |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |
| `GOOGLE_AI_API_KEY` | Your Google AI API key |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `PAYSTACK_PUBLIC_KEY` | Your Paystack public key |
| `PAYSTACK_SECRET_KEY` | Your Paystack secret key |
| `PORT` | `3000` |

## Step 7: Update NEXTAUTH_URL

After deployment, update `NEXTAUTH_URL` to your production domain:
- In Railway Dashboard → your service → Variables
- Set `NEXTAUTH_URL` to your actual domain (e.g., https://smart-mart-pro.up.railway.app)

## Step 8: Generate a Domain

1. In Railway Dashboard → your service → "Settings" → "Networking"
2. Click "Generate Domain" to get a `*.up.railway.app` subdomain
3. Or add a custom domain

## Testing Production

1. Visit your Railway domain
2. Test all features:
   - User registration/login
   - Product management
   - POS system
   - Customer lookup
   - AI assistant
   - Payments

## Seed the Database

After deploying, seed the database with demo data:

```bash
# Using Railway CLI
railway run npm run seed
```

Or set a one-time environment variable `SEED_DB=true` and trigger a redeploy.

## Railway Free Tier Limits

### Railway (Hobby Plan - $5/month with $5 credit)
- 512MB RAM
- 1 vCPU
- 1GB disk
- Automatic SSL
- Custom domains
- Auto-deploy on push

### MongoDB Atlas (Free)
- 512MB storage
- Shared RAM
- 3 replicas
- 500 connections

### Cloudinary (Free)
- 25GB storage
- 25GB bandwidth per month
- 25 transformations per month

### Paystack
- No monthly fees
- Pay per transaction (1.5% + ₦100)

## Troubleshooting

### MongoDB Connection Issues
- Ensure IP whitelist includes 0.0.0.0/0
- Check username/password in connection string
- Verify cluster is running

### Environment Variables Not Working
- Redeploy after adding variables
- Check variable names match exactly
- Ensure no trailing spaces

### NextAuth Issues
- Ensure NEXTAUTH_URL matches your domain
- Generate a strong NEXTAUTH_SECRET
- Check callback URLs in your OAuth providers

### Build Failing
- Check Railway build logs for errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (18+)

## Custom Domain (Optional)

1. Buy a domain (e.g., Namecheap, GoDaddy)
2. In Railway Dashboard → your service → Settings → Networking
3. Add your domain
4. Update DNS records as instructed (CNAME to Railway)
5. Update NEXTAUTH_URL to your custom domain

## Monitoring

Railway provides:
- Real-time logs
- Resource usage metrics
- Deployment history
- Environment management

Access these in Railway Dashboard → your project → service → Logs/Metrics

## Backup Strategy

MongoDB Atlas automatically backs up your data. For additional safety:
- Export data regularly using MongoDB Atlas Data API
- Keep a copy of your environment variables locally

## Support

- Railway: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Cloudinary: https://cloudinary.com/documentation
- Paystack: https://paystack.com/docs
