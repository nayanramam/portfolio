# Quick Start: Deploy Your Portfolio in 5 Minutes

## Step 1: Initialize Git (if not done)

Open PowerShell in your project folder and run:

```powershell
git init
git add .
git commit -m "Initial commit: Portfolio site ready for deployment"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `portfolio-site` (or your choice)
3. **Important**: Don't check "Add a README" (you already have files)
4. Click "Create repository"

## Step 3: Push to GitHub

GitHub will show you commands. Copy and run them (replace YOUR_USERNAME):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/portfolio-site.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Cloudflare Pages

1. Go to https://dash.cloudflare.com/
2. Sign up/login (free)
3. Click **"Workers & Pages"** → **"Create application"**
4. Click **"Pages"** tab → **"Connect to Git"**
5. Authorize GitHub → Select your repository
6. Build settings:
   - Build command: (leave empty)
   - Build output directory: `/` (or leave empty)
7. Click **"Save and Deploy"**

## Done! 🎉

Your site will be live at: `https://portfolio-site.pages.dev` (or similar)

**Future updates**: Just run `git push` and your site auto-updates!

---

See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

