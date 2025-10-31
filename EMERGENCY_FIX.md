# 🚨 EMERGENCY FIX - 502 Bad Gateway

Your site is showing **502 Bad Gateway** because the Node.js application on your VPS has crashed or stopped running.

## 🔧 Quick Fix (SSH into your VPS)

### Step 1: Connect to VPS
```bash
ssh smoothcoders@your-vps-ip
# Or use the credentials from HOSTINGER_SSH_COMMANDS.sh
```

### Step 2: Check Application Status
```bash
pm2 status
```

### Step 3: Check Logs (See what went wrong)
```bash
pm2 logs smoothcoders --lines 50
```

### Step 4: Restart Application
```bash
cd /home/smoothcoders/htdocs/smoothcoders.com
pm2 restart smoothcoders
```

### Step 5: If Restart Fails, Do Full Redeploy
```bash
cd /home/smoothcoders/htdocs/smoothcoders.com
git pull origin main
npm install --legacy-peer-deps
npm run build
pm2 restart smoothcoders
```

### Step 6: If Still Not Working, Fresh Start
```bash
cd /home/smoothcoders/htdocs/smoothcoders.com
pm2 delete smoothcoders
npm run build
pm2 start npm --name "smoothcoders" -- start
pm2 save
```

---

## 🔍 Common Causes & Solutions

### 1. Out of Memory
**Symptom:** Build fails or app crashes
**Solution:**
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 2. Port Already in Use
**Symptom:** App won't start
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
pm2 restart smoothcoders
```

### 3. Build Errors
**Symptom:** 502 after deployment
**Solution:**
```bash
# Check build logs
npm run build 2>&1 | tee build.log
cat build.log
```

### 4. MongoDB Connection Issues
**Symptom:** App starts but crashes
**Solution:**
```bash
# Check MongoDB connection in .env
cat .env | grep MONGODB_URI
# Test MongoDB connection
mongosh "YOUR_MONGODB_URI"
```

---

## 📊 Health Check Commands

```bash
# Check if app is running
pm2 status

# Check app logs
pm2 logs smoothcoders

# Check error logs only
pm2 logs smoothcoders --err

# Check CPU/Memory usage
pm2 monit

# Check port
netstat -tulpn | grep 3000

# Check nginx status
sudo systemctl status nginx

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## ⚡ Auto-Fix Script

Run this on your VPS:

```bash
cd /home/smoothcoders/htdocs/smoothcoders.com

# Pull and deploy
git pull origin main
npm install --legacy-peer-deps
NODE_OPTIONS="--max-old-space-size=4096" npm run build
pm2 restart smoothcoders || pm2 start npm --name "smoothcoders" -- start
pm2 save

# Check status
pm2 status
pm2 logs smoothcoders --lines 20
```

---

## 🆘 If Nothing Works

### Nuclear Option (Complete Reset):
```bash
cd /home/smoothcoders/htdocs
rm -rf smoothcoders.com
git clone YOUR_REPO_URL smoothcoders.com
cd smoothcoders.com
npm install --legacy-peer-deps
npm run build
pm2 start npm --name "smoothcoders" -- start
pm2 save
pm2 startup
```

---

## 📞 Check Your VPS Resources

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
top

# If low on resources, restart VPS
sudo reboot
```

---

## ✅ Verify Fix

After fixing, check:
1. `pm2 status` - Should show "online"
2. `curl http://localhost:3000` - Should return HTML
3. Visit `https://smoothcoders.com` - Should work
4. Check browser console - No 502 errors

---

## 🔄 Prevent Future Issues

1. **Set up PM2 to auto-restart on crashes:**
```bash
pm2 start npm --name "smoothcoders" -- start --max-restarts=10
pm2 save
```

2. **Set up monitoring:**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
```

3. **Add health check endpoint** (already in code)

4. **Set up alerts:**
```bash
pm2 install pm2-slack # or other notification service
```
