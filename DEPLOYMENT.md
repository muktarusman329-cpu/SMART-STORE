# Production Deployment Guide

This guide will help you deploy Smart Mart Pro to free hosting platforms.

## Free Hosting Stack

- **Frontend/Backend**: Vercel (Free Tier)
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

## Step 5: Deploy to Vercel (Free)

### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables when prompted:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXTAUTH_URL`: Your Vercel domain (e.g., https://your-app.vercel.app)
   - `NEXTAUTH_SECRET`: Generate a random string (use: `openssl rand -base64 32`)
   - `GOOGLE_AI_API_KEY`: Your Google AI API key
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `PAYSTACK_PUBLIC_KEY`: Your Paystack public key
   - `PAYSTACK_SECRET_KEY`: Your Paystack secret key

5. Deploy to production:
```bash
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Create a free account
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables in project settings
6. Deploy

## Step 6: Configure Environment Variables in Vercel

After deployment, add these environment variables in Vercel Dashboard:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `NEXTAUTH_URL` | Your Vercel domain (https://your-app.vercel.app) |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |
| `GOOGLE_AI_API_KEY` | Your Google AI API key |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `PAYSTACK_PUBLIC_KEY` | Your Paystack public key |
| `PAYSTACK_SECRET_KEY` | Your Paystack secret key |

## Step 7: Update NEXTAUTH_URL

After deployment, update `NEXTAUTH_URL` to your production domain:
- In Vercel Dashboard → Settings → Environment Variables
- Set `NEXTAUTH_URL` to your actual domain (e.g., https://smart-mart-pro.vercel.app)

## Step 8: Redeploy

After adding environment variables:
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Click the three dots on your latest deployment
4. Click "Redeploy"

## Testing Production

1. Visit your Vercel domain
2. Test all features:
   - User registration/login
   - Product management
   - POS system
   - Customer lookup
   - AI assistant
   - Payments

## Free Tier Limits

### Vercel (Hobby Plan - Free)
- 100GB bandwidth per month
- 6,000 minutes of execution time per month
- Unlimited projects
- Automatic SSL
- Custom domains

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

## Custom Domain (Optional)

1. Buy a domain (e.g., Namecheap, GoDaddy)
2. In Vercel Dashboard → Settings → Domains
3. Add your domain
4. Update DNS records as instructed
5. Update NEXTAUTH_URL to your custom domain

## Monitoring

Vercel provides:
- Real-time logs
- Analytics
- Error tracking
- Performance monitoring

Access these in Vercel Dashboard → your project → Analytics/Logs

## Backup Strategy

MongoDB Atlas automatically backs up your data. For additional safety:
- Export data regularly using MongoDB Atlas Data API
- Keep a copy of your environment variables locally

## Support

- Vercel: https://vercel.com/support
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Cloudinary: https://cloudinary.com/documentation
- Paystack: https://paystack.com/docs

## Cost Summary

All services used are **FREE**:
- Vercel: $0/month
- MongoDB Atlas: $0/month
- Cloudinary: $0/month
- Paystack: Pay per transaction (no monthly fee)

**Total monthly cost: $0** (plus transaction fees)
