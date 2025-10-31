#!/bin/bash

echo "==================================="
echo "SmoothCoders VPS Setup Script"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Update system
echo -e "${YELLOW}Updating system...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo -e "${YELLOW}Installing Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
echo -e "${YELLOW}Installing PM2...${NC}"
sudo npm install -g pm2

# Install Nginx
echo -e "${YELLOW}Installing Nginx...${NC}"
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Create app directory
echo -e "${YELLOW}Setting up application directory...${NC}"
cd /var/www
sudo mkdir -p smoothcoders
sudo chown -R $USER:$USER smoothcoders
cd smoothcoders

# Clone repository
echo -e "${YELLOW}Cloning repository...${NC}"
git clone https://github.com/SmoothCoders/smoothcodersweb.git .

# Create .env.production
echo -e "${YELLOW}Creating environment file...${NC}"
cat > .env.production << 'EOF'
MONGODB_URI=mongodb+srv://pradipnv:Pradipnv%40761976@smoothcoders.ojk6pbg.mongodb.net/smoothcoders?retryWrites=true&w=majority&appName=smoothcoders
NEXTAUTH_SECRET=a6MOyW7XPs91ZGcmQhp8ldv/EFB5tKM4H7/Efg5bd3w=
NEXTAUTH_URL=https://welaunch.in
NEXT_PUBLIC_API_URL=https://welaunch.in
NODE_ENV=production
EOF

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install --legacy-peer-deps

# Build application
echo -e "${YELLOW}Building Next.js application (this may take a few minutes)...${NC}"
npm run build

# Configure Nginx
echo -e "${YELLOW}Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/smoothcoders > /dev/null << 'EOF'
server {
    listen 80;
    server_name welaunch.in www.welaunch.in 213.230.36.92;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/smoothcoders /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
sudo nginx -t

# Restart Nginx
echo -e "${YELLOW}Restarting Nginx...${NC}"
sudo systemctl restart nginx

# Start app with PM2
echo -e "${YELLOW}Starting application with PM2...${NC}"
cd /var/www/smoothcoders
pm2 start npm --name "smoothcoders" -- start
pm2 save
pm2 startup | tail -n 1 | bash

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
echo "y" | sudo ufw enable

# Install SSL (Certbot)
echo -e "${YELLOW}Installing SSL certificate...${NC}"
sudo apt install certbot python3-certbot-nginx -y

echo -e "${GREEN}==================================="
echo "Setup Complete!"
echo "===================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update DNS records to point welaunch.in to 213.230.36.92"
echo "2. Wait 5-10 minutes for DNS propagation"
echo "3. Run this command to get SSL certificate:"
echo "   ${GREEN}sudo certbot --nginx -d welaunch.in -d www.welaunch.in${NC}"
echo ""
echo "Your app is now running on:"
echo "- http://213.230.36.92"
echo "- http://welaunch.in (after DNS update)"
echo ""
echo "Useful commands:"
echo "- pm2 status          # Check app status"
echo "- pm2 logs smoothcoders   # View logs"
echo "- pm2 restart smoothcoders # Restart app"
