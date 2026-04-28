#!/bin/bash

################################################################################
# GitHub SSH Key Setup Script
# Purpose: Configure SSH keys for secure GitHub access on production server
# Usage: sudo ./setup-ssh.sh [--user www-data]
################################################################################

set -e

# Configuration
SSH_USER="${1:-root}"
SSH_USER="${SSH_USER#--user }"  # Handle --user flag
SSH_HOME=$(eval echo "~${SSH_USER}")
SSH_DIR="${SSH_HOME}/.ssh"
SSH_KEY_FILE="${SSH_DIR}/id_ed25519_github"
SSH_CONFIG_FILE="${SSH_DIR}/config"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

################################################################################
# Functions
################################################################################

log() {
    echo -e "${GREEN}✓${NC} $1"
}

info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} ERROR: $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}⚠${NC} WARNING: $1"
}

################################################################################
# Main Setup
################################################################################

main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}GitHub SSH Key Setup${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    # Check if running as appropriate user
    if [[ "$SSH_USER" != "root" ]] && [[ "$SSH_USER" != "$(whoami)" ]]; then
        if [[ "$EUID" != 0 ]]; then
            error "Must run as sudo to configure SSH for other users"
        fi
    fi
    
    info "Setting up SSH for user: $SSH_USER"
    info "SSH home: $SSH_HOME"
    
    # Create .ssh directory if it doesn't exist
    if [ ! -d "$SSH_DIR" ]; then
        info "Creating $SSH_DIR..."
        mkdir -p "$SSH_DIR"
        chmod 700 "$SSH_DIR"
        if [[ "$SSH_USER" != "root" ]]; then
            chown "$SSH_USER:$SSH_USER" "$SSH_DIR"
        fi
        log "SSH directory created"
    else
        info "SSH directory already exists"
    fi
    
    # Generate SSH key if it doesn't exist
    if [ ! -f "$SSH_KEY_FILE" ]; then
        info "Generating new SSH key..."
        
        # Use a more portable method to run as the correct user
        if [[ "$SSH_USER" == "root" ]] || [[ "$EUID" != 0 ]]; then
            ssh-keygen -t ed25519 \
                -f "$SSH_KEY_FILE" \
                -N "" \
                -C "github-$(hostname)-$SSH_USER" \
                || error "Failed to generate SSH key"
        else
            sudo -u "$SSH_USER" ssh-keygen -t ed25519 \
                -f "$SSH_KEY_FILE" \
                -N "" \
                -C "github-$(hostname)-$SSH_USER" \
                || error "Failed to generate SSH key"
        fi
        
        chmod 600 "$SSH_KEY_FILE"
        chmod 644 "${SSH_KEY_FILE}.pub"
        
        log "SSH key generated: $SSH_KEY_FILE"
    else
        info "SSH key already exists: $SSH_KEY_FILE"
    fi
    
    # Create SSH config for GitHub if it doesn't exist
    if [ ! -f "$SSH_CONFIG_FILE" ]; then
        info "Creating SSH config..."
        cat > "$SSH_CONFIG_FILE" <<'EOF'
# GitHub SSH Configuration
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    AddKeysToAgent yes
    IdentitiesOnly yes
    StrictHostKeyChecking accept-new
EOF
        
        chmod 600 "$SSH_CONFIG_FILE"
        if [[ "$SSH_USER" != "root" ]]; then
            chown "$SSH_USER:$SSH_USER" "$SSH_CONFIG_FILE"
        fi
        
        log "SSH config created"
    else
        # Check if GitHub config exists in file
        if ! grep -q "Host github.com" "$SSH_CONFIG_FILE"; then
            warning "GitHub SSH config not found in $SSH_CONFIG_FILE"
            info "Adding GitHub configuration..."
            cat >> "$SSH_CONFIG_FILE" <<'EOF'

# GitHub SSH Configuration
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
    AddKeysToAgent yes
    IdentitiesOnly yes
    StrictHostKeyChecking accept-new
EOF
            log "GitHub SSH config added"
        else
            info "GitHub SSH config already exists"
        fi
    fi
    
    # Display public key
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Your GitHub SSH Public Key${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    cat "${SSH_KEY_FILE}.pub"
    echo ""
    
    # Test SSH connection
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Testing GitHub SSH Connection${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    if [[ "$SSH_USER" == "root" ]] || [[ "$EUID" != 0 ]]; then
        if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
            log "GitHub SSH connection successful!"
        else
            warning "Could not verify GitHub connection"
            info "Add the public key above to your GitHub account:"
            info "  https://github.com/settings/keys"
            info "Then run: ssh -T git@github.com"
        fi
    else
        sudo -u "$SSH_USER" ssh -T git@github.com 2>&1 | grep -q "successfully authenticated" && \
            log "GitHub SSH connection successful!" || \
            warning "Could not verify GitHub connection"
    fi
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}SSH Setup Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Copy the public key above"
    echo "2. Add it to GitHub: https://github.com/settings/keys"
    echo "3. Update deploy.sh with your GitHub SSH URL:"
    echo "   export REPO_URL='git@github.com:DieterReicelt/Aidan-Calculator.git'"
    echo "4. Run: sudo $SSH_USER -c '/path/to/deploy.sh'"
    echo ""
}

# Print usage
if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
    cat <<EOF
GitHub SSH Key Setup Script

Usage: sudo $0 [--user USERNAME]

Options:
  --user USERNAME    Setup SSH for specific user (default: root)
  -h, --help        Show this help message

Examples:
  # Setup SSH for root user
  sudo $0

  # Setup SSH for www-data user (Nginx)
  sudo $0 --user www-data

  # Setup SSH for www user (Apache)
  sudo $0 --user www

Notes:
  - Run with sudo for system users (www-data, www, etc.)
  - Public key will be displayed - add it to GitHub settings
  - Ensure your firewall allows outbound SSH (port 22)

EOF
    exit 0
fi

# Run main
main "$@"
