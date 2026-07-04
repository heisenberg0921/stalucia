# How to Push Updated Code to GitHub

## Option 1: Using Git Commands (Recommended)

### If you already have Git initialized:

1. **Open Command Prompt** in your project folder:
   - Press `Win + R`
   - Type `cmd` and press Enter
   - Navigate to your project: `cd c:\Users\Kael\Documents\barangay-website`

2. **Add all files:**
   ```
   git add .
   ```

3. **Commit the changes:**
   ```
   git commit -m "Added login debugging"
   ```

4. **Push to GitHub:**
   ```
   git push origin main
   ```

---

### If you don't have a GitHub repo yet:

1. **Create a new repository on GitHub:**
   - Go to [github.com](https://github.com)
   - Click **+** → **New repository**
   - Name it: `barangay-website`
   - Click **Create repository**

2. **Open Command Prompt** in your project folder:
   - Press `Win + R`
   - Type `cmd` and press Enter
   - Navigate to your project: `cd c:\Users\Kael\Documents\barangay-website`

3. **Run these commands:**
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/barangay-website.git
   git push -u origin main
   ```
   (Replace `YOUR-USERNAME` with your GitHub username)

---

## Option 2: Using GitHub Desktop

1. **Download GitHub Desktop:**
   - Go to [desktop.github.com](https://desktop.github.com)
   - Click **Download for Windows**

2. **Sign in with your GitHub account**

3. **Add your project:**
   - Click **File** → **Add local repository**
   - Select your project folder: `c:\Users\Kael\Documents\barangay-website`

4. **Commit and Push:**
   - Enter a commit message (e.g., "Added login debugging")
   - Click **Commit to main**
   - Click **Push origin**

---

## Option 3: Using Vercel CLI (Easiest!)

If you have Vercel CLI installed:

1. **Open Command Prompt** in your project folder

2. **Run:**
   ```
   vercel --prod
   ```

This will deploy directly without needing GitHub!

---

## After Pushing to GitHub

Vercel should automatically detect the push and redeploy. If not:
- Go to [vercel.com](https://vercel.com)
- Click on your project
- Go to **Deployments** tab
- Click **Redeploy** on the latest deployment
