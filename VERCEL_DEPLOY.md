# Deploy to Vercel - Simple Guide

## Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add frontend/
   git commit -m "Add Code Explainer frontend"
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Set build settings:
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Click "Deploy"

## Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Which scope? (your account)
# - Link to existing project? (No)
# - Project name? (code-explainer)
# - Modify settings? (No)
```

## Option 3: Git-based Deployment

1. Create a GitHub repository
2. Push the `frontend` folder
3. Connect to Vercel (auto-deploys on push)

## Environment Variables (if needed)

No environment variables needed! The app works standalone.

## Post-Deployment

Once deployed:
1. You'll get a URL like `https://code-explainer-xyz.vercel.app`
2. Share the link
3. Everyone can use it immediately

## Troubleshooting

**Build fails?**
- Make sure you're in the `frontend` directory
- Check that `package.json` exists
- Run `npm install` locally first

**Blank page?**
- Check browser console for errors
- Verify Vite is configured correctly
- Make sure all imports are relative

**Need to update?**
- Just push to GitHub
- Vercel automatically redeploys

---

**That's it!** Your app is now live on Vercel. 🚀
