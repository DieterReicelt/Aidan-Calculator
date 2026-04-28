# Deployment Instructions

## Overview
This guide explains how to deploy the Aidan's Math Notebook calculator to a production LXC Proxmox server using the automated `deploy.sh` script.

## Prerequisites

Before deploying, ensure your production server has:
- **Git** - for cloning/updating the repository
- **Node.js** (v18+) and **npm** - for building the project
- **Web server** - nginx or Apache2
- **Sudo access** - for permission management

```bash
# Install on Ubuntu/Debian-based systems
apt update
apt install -y git nodejs npm nginx
```

## Configuration

### 1. Set Environment Variables

Before running the deployment, configure these variables:

```bash
# GitHub repository URL
export REPO_URL="https://github.com/yourusername/aidan-calculator.git"

# Local directory for the repository (will be cloned here)
export REPO_DIR="/opt/aidans-calculator"

# Web root directory (where the built app will be served)
export WEB_ROOT="/var/www/aidans-calculator"

# Git branch to deploy (default: main)
export BRANCH="main"
```

### 2. Update Repository URL

Edit the `deploy.sh` script and update the default `REPO_URL`:

```bash
REPO_URL="https://github.com/yourusername/aidan-calculator.git"
```

Or pass it as an environment variable when running the script.

## Initial Setup

### 1. Prepare the Server

```bash
# Create necessary directories
sudo mkdir -p /opt
sudo mkdir -p /var/www/aidans-calculator

# Create log directory
sudo mkdir -p /var/log
sudo touch /var/log/aidans-calculator-deploy.log
sudo chown $USER:$USER /var/log/aidans-calculator-deploy.log
```

### 2. Configure Web Server

#### For Nginx:

```bash
sudo tee /etc/nginx/sites-available/aidans-calculator > /dev/null <<EOF
server {
    listen 80;
    server_name aidans-calculator.yourdomain.com;  # Change this

    root /var/www/aidans-calculator;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/aidans-calculator /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

#### For Apache2:

```bash
sudo tee /etc/apache2/sites-available/aidans-calculator.conf > /dev/null <<EOF
<VirtualHost *:80>
    ServerName aidans-calculator.yourdomain.com
    DocumentRoot /var/www/aidans-calculator

    <Directory /var/www/aidans-calculator>
        Options -MultiViews
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.html [QSA,L]
    </Directory>

    # Cache static assets
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "public, max-age=2592000"
    </FilesMatch>
</VirtualHost>
EOF

# Enable mod_rewrite and the site
sudo a2enmod rewrite
sudo a2ensite aidans-calculator
sudo apache2ctl configtest
sudo systemctl reload apache2
```

## Deployment

### First Time Deployment

```bash
# Method 1: Using default configuration (update REPO_URL in script first)
sudo ./deploy.sh

# Method 2: Using environment variables
sudo REPO_URL="https://github.com/yourusername/aidan-calculator.git" \
      REPO_DIR="/opt/aidans-calculator" \
      WEB_ROOT="/var/www/aidans-calculator" \
      ./deploy.sh
```

### Subsequent Deployments

Run the same command — the script automatically pulls the latest changes:

```bash
sudo ./deploy.sh
```

### Deployment with Specific Branch

```bash
sudo BRANCH="develop" ./deploy.sh
```

## What the Script Does

1. ✅ **Checks Requirements** - Verifies git, Node.js, and npm are installed
2. ✅ **Clones/Updates Repository** - Gets latest code from GitHub
3. ✅ **Installs Dependencies** - Runs `npm ci --omit=dev` (production dependencies only)
4. ✅ **Builds Project** - Runs `npm run build` (creates optimized dist/ folder)
5. ✅ **Deploys Files** - Copies build to web root with backup
6. ✅ **Sets Permissions** - Configures ownership for web server
7. ✅ **Restarts Web Server** - Reloads nginx/apache2
8. ✅ **Verifies Deployment** - Confirms index.html exists

## Logs

Monitor deployment progress and troubleshoot issues:

```bash
# View deployment log in real-time
tail -f /var/log/aidans-calculator-deploy.log

# View last deployment
cat /var/log/aidans-calculator-deploy.log | tail -50
```

## Automated Deployments (Cron)

Schedule automatic deployments (e.g., daily at 2 AM):

```bash
# Add to crontab
sudo crontab -e

# Add this line:
0 2 * * * /path/to/Aidan-Calculator/deploy.sh >> /var/log/aidans-calculator-cron.log 2>&1
```

## Backup and Rollback

The script automatically backs up the previous deployment:

```bash
# List backups
ls -la /var/www/aidans-calculator.backup.*

# Restore from backup
sudo cp -r /var/www/aidans-calculator.backup.1234567890/* /var/www/aidans-calculator/
sudo systemctl reload nginx  # or apache2
```

## Troubleshooting

### Permission Denied

```bash
sudo chmod +x /path/to/deploy.sh
```

### Node modules issues

```bash
# Clean and reinstall
cd /opt/aidans-calculator
sudo rm -rf node_modules package-lock.json
sudo npm ci --omit=dev
```

### Web server not reloading

Check web server status:

```bash
# For Nginx
sudo systemctl status nginx
sudo nginx -t

# For Apache2
sudo systemctl status apache2
sudo apache2ctl configtest
```

### GitHub authentication

If deploying a private repository, set up SSH or use a personal access token:

```bash
# SSH setup
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_github -C "your@email.com"
# Add public key to GitHub settings

# Update REPO_URL to use SSH
export REPO_URL="git@github.com:yourusername/aidan-calculator.git"
```

## HTTPS / SSL (Let's Encrypt)

For production, always use HTTPS:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx  # or certbot-apache

# Get certificate
sudo certbot certonly --nginx -d aidans-calculator.yourdomain.com

# Auto-renewal is enabled by default
```

## Security Considerations

- ✅ Keep web server and Node.js updated
- ✅ Use HTTPS in production
- ✅ Monitor logs for suspicious activity
- ✅ Consider rate limiting and DDoS protection
- ✅ Set up proper firewall rules
- ✅ Use strong GitHub credentials (SSH keys or PAT)

## Support

For issues or questions:
- Check `/var/log/aidans-calculator-deploy.log`
- Review `deploy.sh` comments
- Test with `./deploy.sh` directly (without sudo) for debugging
