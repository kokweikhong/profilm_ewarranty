#!/bin/bash

# ProFilm eWarranty - Ubuntu Server Setup Script
# This script installs all necessary dependencies for running the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run this script as root. Run as a normal user with sudo privileges."
    exit 1
fi

# Check if sudo is available
if ! command -v sudo &> /dev/null; then
    print_error "sudo is not installed. Please install sudo first."
    exit 1
fi

print_info "Starting ProFilm eWarranty setup for Ubuntu..."
echo ""

# Step 1: Update system
print_info "Step 1: Updating system packages..."
sudo apt update
sudo apt upgrade -y
print_info "System updated successfully!"
echo ""

# Step 2: Install essential tools
print_info "Step 2: Installing essential tools..."
sudo apt install -y \
    curl \
    wget \
    git \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common \
    apt-transport-https
print_info "Essential tools installed!"
echo ""

# Step 3: Install Docker
print_info "Step 3: Installing Docker..."
if command -v docker &> /dev/null; then
    print_warning "Docker is already installed. Skipping Docker installation."
    docker --version
else
    # Download and run Docker installation script
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    print_info "Docker installed successfully!"
    docker --version
fi
echo ""

# Step 4: Install Docker Compose
print_info "Step 4: Installing Docker Compose..."
if command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose is already installed. Skipping installation."
    docker-compose --version
else
    # Install Docker Compose
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Create symlink if needed
    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    print_info "Docker Compose installed successfully!"
    docker-compose --version
fi
echo ""

# Step 5: Install Git
print_info "Step 5: Verifying Git installation..."
if command -v git &> /dev/null; then
    print_info "Git is already installed."
    git --version
else
    sudo apt install -y git
    print_info "Git installed successfully!"
    git --version
fi
echo ""

# Step 6: Install Make (optional but useful)
print_info "Step 6: Installing Make..."
if command -v make &> /dev/null; then
    print_warning "Make is already installed."
    make --version | head -n 1
else
    sudo apt install -y build-essential
    print_info "Make installed successfully!"
    make --version | head -n 1
fi
echo ""

# Step 7: Ask about Nginx installation
print_info "Step 7: Nginx installation (optional)..."
read -p "Do you want to install Nginx for reverse proxy? (y/n): " install_nginx
if [[ $install_nginx == "y" || $install_nginx == "Y" ]]; then
    if command -v nginx &> /dev/null; then
        print_warning "Nginx is already installed."
        nginx -v
    else
        sudo apt install -y nginx
        sudo systemctl enable nginx
        sudo systemctl start nginx
        print_info "Nginx installed and started successfully!"
        nginx -v
    fi
else
    print_info "Skipping Nginx installation."
fi
echo ""

# Step 8: Install UFW firewall
print_info "Step 8: Setting up UFW firewall..."
if command -v ufw &> /dev/null; then
    print_info "UFW is already installed."
else
    sudo apt install -y ufw
    print_info "UFW installed successfully!"
fi

read -p "Do you want to configure UFW firewall now? (y/n): " setup_firewall
if [[ $setup_firewall == "y" || $setup_firewall == "Y" ]]; then
    print_info "Configuring firewall..."
    sudo ufw --force enable
    sudo ufw allow 22/tcp    # SSH
    sudo ufw allow 80/tcp    # HTTP
    sudo ufw allow 443/tcp   # HTTPS
    sudo ufw allow 3000/tcp  # Frontend (optional, comment out if using Nginx)
    sudo ufw allow 8080/tcp  # Backend API (optional, comment out if using Nginx)
    print_info "Firewall configured!"
    sudo ufw status
else
    print_info "Skipping firewall configuration."
fi
echo ""

# Step 9: Install PostgreSQL client tools (optional)
print_info "Step 9: PostgreSQL client tools..."
read -p "Do you want to install PostgreSQL client tools? (y/n): " install_pg_client
if [[ $install_pg_client == "y" || $install_pg_client == "Y" ]]; then
    sudo apt install -y postgresql-client
    print_info "PostgreSQL client tools installed!"
else
    print_info "Skipping PostgreSQL client tools."
fi
echo ""

# Step 10: Install Certbot for SSL (optional)
print_info "Step 10: Certbot for SSL certificates..."
read -p "Do you want to install Certbot for Let's Encrypt SSL? (y/n): " install_certbot
if [[ $install_certbot == "y" || $install_certbot == "Y" ]]; then
    if command -v certbot &> /dev/null; then
        print_warning "Certbot is already installed."
        certbot --version
    else
        sudo apt install -y certbot python3-certbot-nginx
        print_info "Certbot installed successfully!"
        certbot --version
    fi
else
    print_info "Skipping Certbot installation."
fi
echo ""

# Summary
echo ""
print_info "=============================================="
print_info "         Installation Complete!              "
print_info "=============================================="
echo ""
print_info "Installed components:"
echo "  ✓ System updates"
echo "  ✓ Essential tools (curl, wget, git)"
echo "  ✓ Docker $(docker --version | cut -d' ' -f3 | tr -d ',')"
echo "  ✓ Docker Compose $(docker-compose --version | cut -d' ' -f4 | tr -d ',')"
echo "  ✓ Git $(git --version | cut -d' ' -f3)"
echo "  ✓ Make"
if [[ $install_nginx == "y" || $install_nginx == "Y" ]]; then
    echo "  ✓ Nginx"
fi
if [[ $install_pg_client == "y" || $install_pg_client == "Y" ]]; then
    echo "  ✓ PostgreSQL client"
fi
if [[ $install_certbot == "y" || $install_certbot == "Y" ]]; then
    echo "  ✓ Certbot"
fi
echo ""

print_warning "IMPORTANT: You need to log out and log back in for Docker group changes to take effect!"
print_warning "Or run: newgrp docker"
echo ""

print_info "Next steps:"
echo "  1. Log out and log back in (or run 'newgrp docker')"
echo "  2. Clone the repository: git clone <repo-url>"
echo "  3. Configure environment variables (.env files)"
echo "  4. Run: docker-compose up -d"
echo ""

print_info "Setup script completed successfully!"
