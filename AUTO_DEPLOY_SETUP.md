# 🚀 Auto-Deploy Setup Guide

This guide explains how to set up automatic deployment from GitHub to your VPS.

---

## 📋 Two Methods Available

### Method 1: GitHub Actions (Recommended) ⭐
- ✅ Easiest to set up
- ✅ Built into GitHub
- ✅ No server-side webhook needed
- ✅ Detailed logs in GitHub

### Method 2: Webhook Server
- ✅ Runs on your VPS
- ✅ Instant deployment
- ✅ More control

---

## 🎯 Method 1: GitHub Actions Setup

### Step 1: Generate SSH Key on VPS

```bash
# On your VPS, as smoothcoders user
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github-deploy

# Display the private key (copy this)
cat ~/.ssh/github-deploy

# Add public key to authorized_keys
cat ~/.ssh/github-deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add these 3 secrets:

| Name | Value |
|------|-------|
| `VPS_HOST` | `213.210.36.92` |
| `VPS_USERNAME` | `smoothcoders` |
| `VPS_SSH_KEY` | Paste the private key from Step 1 |

### Step 3: Push the Workflow File

```bash
# On your local machine
cd /Users/mac/Work/Development/SmoothCoders/smoothcoders-app

# Commit and push the workflow
git add .github/workflows/deploy.yml
git commit -m "Add auto-deploy workflow"
git push origin main
```

### Step 4: Test It! ✅

Make any change, commit, and push:

```bash
# Make a small change
echo "# Test deploy" >> README.md
git add .
git commit -m "Test auto-deploy"
git push origin main
```

**Check GitHub Actions:**
- Go to **Actions** tab in GitHub
- You'll see the deployment running!
- Click on it to see live logs

---

## 🎣 Method 2: Webhook Server Setup

### Step 1: Upload Files to VPS

```bash
# From your local machine
scp deploy.sh webhook-server.js smoothcoders@213.210.36.92:/home/smoothcoders/htdocs/smoothcoders.com/

# SSH to VPS
ssh smoothcoders@213.210.36.92

# Make deploy script executable
cd /home/smoothcoders/htdocs/smoothcoders.com
chmod +x deploy.sh
```

### Step 2: Generate Webhook Secret

```bash
# Generate a random secret
openssl rand -hex 20
```

Copy this secret!

### Step 3: Update Webhook Server

```bash
# Edit webhook-server.js
nano webhook-server.js

# Change this line:
const SECRET = 'your-webhook-secret-here'; // Paste your secret here
```

### Step 4: Start Webhook Server

```bash
# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Start webhook server with PM2
pm2 start webhook-server.js --name "webhook"
pm2 save
```

### Step 5: Open Firewall Port

```bash
# As root
exit
sudo ufw allow 9000/tcp
```

### Step 6: Configure GitHub Webhook

1. Go to GitHub repository
2. Click **Settings** → **Webhooks** → **Add webhook**
3. Configure:
   - **Payload URL:** `http://213.210.36.92:9000/deploy`
   - **Content type:** `application/json`
   - **Secret:** Paste your secret from Step 2
   - **Which events:** Just the push event
   - **Active:** ✅ Checked

4. Click **Add webhook**

### Step 7: Test It! ✅

Make a change and push:

```bash
echo "# Test webhook" >> README.md
git add .
git commit -m "Test webhook deploy"
git push origin main
```

Check webhook server logs:
```bash
pm2 logs webhook
```

---

## 📦 Update Dependencies Guide

### Option 1: Manual Update

```bash
# On VPS
cd /home/smoothcoders/htdocs/smoothcoders.com

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Update npm
npm install -g npm@latest

# Check outdated packages
npm outdated

# Update specific package
npm install package-name@latest --legacy-peer-deps

# Rebuild and restart
npm run build
pm2 restart smoothcoders
```

### Option 2: Update All (Use with Caution!)

```bash
# Install npm-check-updates
npm install -g npm-check-updates

# Check what will be updated
ncu

# Update package.json
ncu -u

# Install updates
npm install --legacy-peer-deps

# Test locally first!
npm run build

# If all works, restart
pm2 restart smoothcoders
```

---

## 🔧 Useful Commands

### Check PM2 Status
```bash
pm2 list
pm2 logs smoothcoders
pm2 logs webhook
```

### Manual Deploy
```bash
cd /home/smoothcoders/htdocs/smoothcoders.com
./deploy.sh
```

### Check Node/npm Versions
```bash
node --version
npm --version
```

### View Git Status
```bash
git status
git log --oneline -5
```

---

## ⚠️ Important Notes

1. **Always test updates locally first** before deploying
2. **Keep backups** before major updates
3. **Monitor logs** after deployments
4. **Use semantic versioning** for stability

---

## 🎉 Benefits of Auto-Deploy

✅ **Push code → Automatically deployed**
✅ **No manual SSH needed**
✅ **Consistent deployments**
✅ **Easy rollbacks** (just revert and push)
✅ **Deployment logs** in GitHub/PM2

---

## 🚨 Troubleshooting

### Deployment fails?
```bash
pm2 logs smoothcoders --lines 100
```

### Webhook not triggering?
```bash
pm2 logs webhook
# Check GitHub webhook delivery logs
```

### Build errors?
```bash
cd /home/smoothcoders/htdocs/smoothcoders.com
npm run build
# Check error messages
```

---

**Choose Method 1 (GitHub Actions) for simplicity!** 🎯
