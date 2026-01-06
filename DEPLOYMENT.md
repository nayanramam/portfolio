# Deployment Guide: Portfolio Site to Cloudflare Pages

This guide will walk you through deploying your portfolio website to Cloudflare Pages (free hosting).

## Why Cloudflare Pages?

- ✅ **100% Free** - Unlimited sites, bandwidth, and requests
- ✅ **Fast Global CDN** - Your site loads quickly worldwide
- ✅ **Easy Setup** - Deploy directly from GitHub
- ✅ **Custom Domain** - Free SSL certificates included
- ✅ **No Build Step** - Perfect for static HTML sites like yours

## Prerequisites

1. A GitHub account (free)
2. A Cloudflare account (free)

## Step-by-Step Deployment

### Step 1: Initialize Git Repository

If you haven't already, initialize git and commit your files:

```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it `portfolio-site` (or any name you prefer)
4. **Don't** initialize with README, .gitignore, or license (you already have files)
5. Click "Create repository"

### Step 3: Push to GitHub

GitHub will show you commands. Run these in your project directory:

```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio-site.git
git branch -M main
git push -u origin main
```

(Replace `YOUR_USERNAME` with your GitHub username)

### Step 4: Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sign up or log in (it's free)
3. Click on **"Workers & Pages"** in the left sidebar
4. Click **"Create application"**
5. Click **"Pages"** tab → **"Connect to Git"**
6. Authorize Cloudflare to access your GitHub account
7. Select your `portfolio-site` repository
8. Click **"Begin setup"**

### Step 5: Configure Build Settings

Since this is a static site with no build step:

- **Project name**: `portfolio-site` (or your choice)
- **Production branch**: `main`
- **Build command**: Leave empty (no build needed)
- **Build output directory**: `/` (root directory)

Click **"Save and Deploy"**

### Step 6: Wait for Deployment

Cloudflare will:
1. Clone your repository
2. Deploy your site
3. Give you a URL like: `portfolio-site.pages.dev`

Your site should be live in 1-2 minutes! 🎉

## Custom Domain (Optional)

If you have a custom domain:

1. In Cloudflare Pages, click on your project
2. Go to **"Custom domains"** tab
3. Click **"Set up a custom domain"**
4. Enter your domain (e.g., `yourname.com`)
5. Follow the DNS setup instructions
6. Cloudflare will automatically provision SSL certificates

## Updating Your Site

Every time you push to GitHub, Cloudflare Pages will automatically redeploy:

```bash
git add .
git commit -m "Update portfolio"
git push
```

Deployments typically take 1-2 minutes.

## Alternative: Vercel Deployment

If you prefer Vercel instead:

1. Go to [Vercel](https://vercel.com) and sign up with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty (or `/`)
5. Click **"Deploy"**

Vercel also offers a great free tier, but Cloudflare Pages has unlimited bandwidth which is better for sites with many images/assets.

## Troubleshooting

### Images not loading?
- Make sure all image paths are relative (e.g., `assets/image.png` not `/assets/image.png`)
- Check that all files are committed to git

### 404 errors?
- Cloudflare Pages serves `index.html` automatically
- Make sure your file structure matches your HTML links

### Resume PDF not found?
- Check the file path in your HTML matches the actual file name
- Your resume is at `assets/Nayan Ramam Resume.pdf` but HTML might reference `assets/resume.pdf`

## Need Help?

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)

