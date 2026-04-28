#!/bin/bash

################################################################################
# Aidan's Math Notebook - Deployment Script
# Purpose: Deploy from GitHub to production LXC Proxmox server
# Usage: ./deploy.sh
################################################################################

set -e  # Exit on error

# Configuration
# Use SSH URL for secure GitHub access (recommended for production)
# Ensure SSH key is configured: ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_github
REPO_URL="${REPO_URL:-git@github.com:DieterReicelt/Aidan-Calculator.git}"
REPO_DIR="${REPO_DIR:-/opt/aidans-calculator}"
BUILD_DIR="${REPO_DIR}/dist"
WEB_ROOT="${WEB_ROOT:-/var/www/aidans-calculator}"
LOG_FILE="/var/log/aidans-calculator-deploy.log"
BRANCH="${BRANCH:-main}"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

################################################################################
# Functions
################################################################################

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

check_requirements() {
    log "Checking system requirements..."
    
    command -v git &> /dev/null || error "git is not installed"
    command -v node &> /dev/null || error "Node.js is not installed"
    command -v npm &> /dev/null || error "npm is not installed"
    
    log "✓ All requirements met (git, Node.js, npm)"
    
    # Check SSH key for GitHub access
    if [[ "$REPO_URL" == git@github.com* ]]; then
        log "Checking GitHub SSH access..."
        if ! ssh -T git@github.com &> /dev/null; then
            warning "SSH key not configured or GitHub SSH connection failed"
            warning "Set up SSH key or switch to HTTPS:"
            warning "  export REPO_URL='https://github.com/DieterReicelt/Aidan-Calculator.git'"
        else
            log "✓ GitHub SSH access verified"
        fi
    fi
}

setup_directories() {
    log "Setting up directories..."
    
    if [ ! -d "$REPO_DIR" ]; then
        log "Cloning repository from $REPO_URL..."
        git clone -b "$BRANCH" "$REPO_URL" "$REPO_DIR" || error "Failed to clone repository"
    else
        log "Repository already exists at $REPO_DIR"
    fi
    
    mkdir -p "$WEB_ROOT" || error "Failed to create web root directory"
    log "✓ Directories ready"
}

update_repository() {
    log "Updating repository..."
    cd "$REPO_DIR"
    
    git fetch origin || error "Failed to fetch from origin"
    git checkout "$BRANCH" || error "Failed to checkout $BRANCH"
    git pull origin "$BRANCH" || error "Failed to pull from origin"
    
    log "✓ Repository updated to latest $BRANCH"
}

install_dependencies() {
    log "Installing npm dependencies..."
    cd "$REPO_DIR"
    
    npm ci --omit=dev || error "Failed to install dependencies"
    log "✓ Dependencies installed"
}

build_project() {
    log "Building project..."
    cd "$REPO_DIR"
    
    npm run build || error "Build failed"
    
    if [ ! -d "$BUILD_DIR" ]; then
        error "Build directory not found at $BUILD_DIR"
    fi
    
    log "✓ Build completed successfully"
}

deploy_files() {
    log "Deploying files to $WEB_ROOT..."
    
    # Backup current deployment (optional)
    if [ -d "$WEB_ROOT" ] && [ "$(ls -A $WEB_ROOT)" ]; then
        BACKUP_DIR="${WEB_ROOT}.backup.$(date +%s)"
        log "Backing up current deployment to $BACKUP_DIR"
        cp -r "$WEB_ROOT" "$BACKUP_DIR" || warning "Backup failed but continuing deployment"
    fi
    
    # Copy build files
    rm -rf "$WEB_ROOT"/* 2>/dev/null || true
    cp -r "$BUILD_DIR"/* "$WEB_ROOT/" || error "Failed to copy build files"
    
    log "✓ Files deployed to $WEB_ROOT"
}

set_permissions() {
    log "Setting permissions..."
    
    # Determine web server user (nginx or apache2)
    if id "www-data" &>/dev/null 2>&1; then
        WEB_USER="www-data"
    elif id "nginx" &>/dev/null 2>&1; then
        WEB_USER="nginx"
    else
        WEB_USER="www-data"
        warning "Could not determine web server user, defaulting to www-data"
    fi
    
    chown -R "$WEB_USER:$WEB_USER" "$WEB_ROOT" || error "Failed to set ownership"
    chmod -R 755 "$WEB_ROOT" || error "Failed to set directory permissions"
    chmod -R 644 "$WEB_ROOT"/* || error "Failed to set file permissions"
    
    log "✓ Permissions set (owner: $WEB_USER)"
}

restart_web_server() {
    log "Restarting web server..."
    
    if systemctl is-active --quiet nginx; then
        systemctl reload nginx || warning "Failed to reload nginx"
        log "✓ nginx reloaded"
    elif systemctl is-active --quiet apache2; then
        systemctl reload apache2 || warning "Failed to reload apache2"
        log "✓ apache2 reloaded"
    else
        warning "No web server (nginx/apache2) detected or running"
    fi
}

verify_deployment() {
    log "Verifying deployment..."
    
    if [ ! -f "$WEB_ROOT/index.html" ]; then
        error "Deployment verification failed: index.html not found"
    fi
    
    log "✓ Deployment verification passed"
}

################################################################################
# Main Deployment Process
################################################################################

main() {
    log "=========================================="
    log "Starting Aidan's Calculator Deployment"
    log "=========================================="
    
    check_requirements
    setup_directories
    update_repository
    install_dependencies
    build_project
    deploy_files
    set_permissions
    restart_web_server
    verify_deployment
    
    log "=========================================="
    log "✓ Deployment completed successfully!"
    log "=========================================="
    log "Application URL: http://$(hostname -I | awk '{print $1}')/aidans-calculator"
    log "Web root: $WEB_ROOT"
    log "Log file: $LOG_FILE"
}

# Run main function
main "$@"
