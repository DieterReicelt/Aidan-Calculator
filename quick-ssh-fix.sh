#!/bin/bash

################################################################################
# Quick SSH Setup Fix for Aidan's Calculator Deployment
# Run this on your production server to fix SSH access issues
################################################################################

set -e

echo "=========================================="
echo "Quick SSH Setup Fix"
echo "=========================================="
echo ""

# Check if we're on the production server
if [[ ! -d "/var/www" ]]; then
    echo "ERROR: This doesn't look like a production server (/var/www not found)"
    echo "Run this script on your production LXC server"
    exit 1
fi

echo "✓ Running on production server"

# Check if repository exists
if [[ -d "/opt/aidans-calculator" ]]; then
    echo "✓ Repository directory exists"
    cd /opt/aidans-calculator

    # Check if we have the latest scripts
    if [[ -f "setup-ssh.sh" ]]; then
        echo "✓ SSH setup script found"
    else
        echo "⚠ SSH setup script not found - pulling latest changes..."
        git pull origin main
    fi
else
    echo "⚠ Repository not cloned yet - cloning..."
    cd /opt
    git clone git@github.com:DieterReichelt/Aidan-Calculator.git aidans-calculator 2>/dev/null || {
        echo "❌ SSH clone failed - trying HTTPS..."
        git clone https://github.com/DieterReichelt/Aidan-Calculator.git aidans-calculator
        cd aidans-calculator
        echo "✓ Cloned via HTTPS - now setting up SSH..."
    }
fi

cd /opt/aidans-calculator

# Make scripts executable
chmod +x setup-ssh.sh deploy.sh

echo ""
echo "=========================================="
echo "Setting up SSH Key..."
echo "=========================================="

# Run SSH setup
sudo ./setup-ssh.sh

echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Copy the SSH public key shown above"
echo "2. Add it to GitHub: https://github.com/settings/keys"
echo "3. Test connection: ssh -T git@github.com"
echo "4. Run deployment: sudo ./deploy.sh"
echo ""
echo "If SSH setup fails, you can use HTTPS instead:"
echo "  sudo REPO_URL='https://github.com/DieterReichelt/Aidan-Calculator.git' ./deploy.sh"
echo ""