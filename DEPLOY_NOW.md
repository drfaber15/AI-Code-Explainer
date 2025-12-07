# Deploy to Vercel - Command by Command

## 🚀 The 3 Commands You Need

### Command 1: Install Vercel CLI (One Time)
```bash
npm install -g vercel
```

### Command 2: Navigate to Frontend
```bash
cd "/Users/danesmacbook/Code Explainer/frontend"
```

### Command 3: Deploy
```bash
vercel
```

---

## Step-by-Step

### 1️⃣ Open Terminal
Click "Terminal" in VS Code or open your terminal app

### 2️⃣ Install Vercel (First Time Only)
```bash
npm install -g vercel
```

Wait for it to finish.

### 3️⃣ Go to Frontend Folder
```bash
cd "/Users/danesmacbook/Code Explainer/frontend"
```

### 4️⃣ Start Deploy
```bash
vercel
```

### 5️⃣ Answer the Prompts
When asked:
- **Are you in the right directory?** → Press `Y`
- **Link to existing project?** → Press `N`
- **What's the project name?** → Press Enter (or type a name)
- **Which directory to deploy?** → Press Enter (or type `.`)

### 6️⃣ Wait for Deploy
You'll see:
```
✓ Linked to [your-account]/code-explainer
✓ Built in 45s
✓ Created 12 files
✓ Deployed to https://code-explainer-xyz.vercel.app
```

Done! 🎉

---

## 🎯 Your Live URL

After deployment, you'll see:
```
https://code-explainer-[random-name].vercel.app
```

This is your **live app**. Share it!

---

## ✅ That's It!

No config files to edit. No environment variables. No API keys.

Just:
1. `npm install -g vercel` (one time)
2. `cd frontend`
3. `vercel`

Your app is live in 1 minute.

---

## 🔄 Update Your App

If you make changes:

```bash
cd frontend
vercel
```

It auto-detects and redeploys your changes!

---

## 💡 Pro Tips

- Push to GitHub to auto-deploy on every commit
- Use `vercel --prod` to deploy to production
- Use `vercel --name my-app-name` to set custom name
- Check deployments at vercel.com/dashboard

---

## 🆘 Troubleshooting

**"vercel not found"**
```bash
npm install -g vercel
```

**"Can't find node"**
Install Node.js from https://nodejs.org

**"Build failed"**
```bash
cd frontend
npm install
```

---

## ✨ That's seriously it!

Three commands and you're done.

Go deploy! 🚀
