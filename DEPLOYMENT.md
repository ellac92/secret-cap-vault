# Vercel Deployment Guide for Secret Cap Vault

This guide provides step-by-step instructions for deploying the Secret Cap Vault application to Vercel.

## Prerequisites

- GitHub account with access to the `ellac92/secret-cap-vault` repository
- Vercel account (free tier available)
- Domain name (optional, for custom domain setup)

## Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. Complete the account setup process

## Step 2: Import Project

1. In your Vercel dashboard, click "New Project"
2. Find and select the `ellac92/secret-cap-vault` repository
3. Click "Import" to proceed with the project setup

## Step 3: Configure Build Settings

Vercel should automatically detect this as a Vite project. Verify the following settings:

- **Framework Preset**: Vite
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Step 4: Set Environment Variables

In the "Environment Variables" section, add the following variables:

### Required Environment Variables

```
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY
```

### Optional Environment Variables

```
VITE_CONTRACT_ADDRESS=0x... (Set after contract deployment)
VITE_APP_NAME=Secret Cap Vault
VITE_APP_DESCRIPTION=Confidential Venture Funding Platform
```

## Step 5: Deploy

1. Click "Deploy" to start the deployment process
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll receive a URL like `https://secret-cap-vault-xxx.vercel.app`

## Step 6: Configure Custom Domain (Optional)

1. In your project dashboard, go to "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your custom domain (e.g., `secret-cap-vault.com`)
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (up to 24 hours)

## Step 7: Configure Automatic Deployments

1. Go to "Settings" → "Git"
2. Ensure "Automatic deployments" is enabled
3. Configure branch settings:
   - **Production Branch**: `main`
   - **Preview Branches**: `develop`, `staging`

## Step 8: Set Up Analytics (Optional)

1. Go to "Settings" → "Analytics"
2. Enable Vercel Analytics for performance monitoring
3. Configure custom events if needed

## Step 9: Configure Security Headers

Add the following headers in "Settings" → "Security":

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://sepolia.infura.io https://1rpc.io;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## Step 10: Set Up Monitoring

1. Go to "Settings" → "Functions"
2. Configure function regions (choose closest to your users)
3. Set up error tracking with Sentry (optional)

## Post-Deployment Checklist

- [ ] Verify the application loads correctly
- [ ] Test wallet connection functionality
- [ ] Verify environment variables are properly set
- [ ] Test responsive design on mobile devices
- [ ] Check browser console for any errors
- [ ] Verify HTTPS is enabled
- [ ] Test custom domain (if configured)

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Verify all dependencies are in package.json
   - Check build logs for specific error messages

2. **Wallet Connection Issues**
   - Verify WalletConnect Project ID is correct
   - Check RPC URL is accessible
   - Ensure network configuration matches Sepolia testnet

3. **Environment Variable Issues**
   - Double-check variable names (must start with `VITE_`)
   - Verify values are correct and not empty
   - Redeploy after making changes

### Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- Project Issues: [github.com/ellac92/secret-cap-vault/issues](https://github.com/ellac92/secret-cap-vault/issues)

## Deployment URLs

After successful deployment, your application will be available at:

- **Production**: `https://secret-cap-vault.vercel.app`
- **Preview**: `https://secret-cap-vault-git-main-ellac92.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

## Next Steps

1. Deploy smart contracts to Sepolia testnet
2. Update `VITE_CONTRACT_ADDRESS` environment variable
3. Test full application functionality
4. Set up monitoring and analytics
5. Configure CI/CD for automated deployments

