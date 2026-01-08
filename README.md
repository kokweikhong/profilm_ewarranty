# ProFilm eWarranty System

A comprehensive warranty management system for ProFilm with backend (Go) and frontend (Next.js).

## 📋 Ubuntu Server Deployment Workflow

### Quick Start (Automated Setup)

For a quick automated installation of all dependencies, use the setup script:

```bash
# Download the setup script
wget https://raw.githubusercontent.com/your-repo/profilm_ewarranty/main/setup-ubuntu.sh

# Or if you've cloned the repo
# cd profilm_ewarranty
# chmod +x setup-ubuntu.sh

# Make it executable
chmod +x setup-ubuntu.sh

# Run the script
./setup-ubuntu.sh
```

The script will automatically install:

- Docker & Docker Compose
- Git & essential tools
- Nginx (optional)
- PostgreSQL client (optional)
- Certbot for SSL (optional)
- UFW firewall configuration (optional)

After running the script, **log out and log back in** for Docker group changes to take effect, then proceed to [Step 4: Clone Repository](#step-4-clone-repository).

---

### Manual Installation (Step by Step)

If you prefer to install components manually, follow these steps:

### Prerequisites

- Ubuntu Server (20.04 LTS or later)
- Domain name (optional, for production)
- Root or sudo access

### Step 1: Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 2: Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group (replace 'username' with your username)
# Create a new user (replace 'username' with desired username)
sudo adduser username

# Add user to sudo group for administrative privileges
sudo usermod -aG sudo username

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version

# Log out and log back in for group changes to take effect
```

### Step 3: Install Git

```bash
sudo apt install git -y
git --version
```

### Step 4: Clone Repository

```bash
# Navigate to desired directory
cd /opt

# Clone the repository
sudo git clone https://github.com/your-repo/profilm_ewarranty.git
cd profilm_ewarranty

# Set proper permissions
sudo chown -R $USER:$USER /opt/profilm_ewarranty
```

### Step 5: Configure Environment Variables

#### Backend Configuration

```bash
cd backend
cp .env.example .env
nano .env
```

Edit the following variables:

```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=profilm
DB_PASSWORD=your_secure_password
DB_NAME=profilm_ewarranty
SERVER_PORT=8080
UPLOAD_DIR=/uploads
```

#### Frontend Configuration

```bash
cd ../frontend
cp .env.example .env.local
nano .env.local
```

Edit the following variables:

```env
NEXT_PUBLIC_API_URL=http://your-server-ip:8080/api/v1
```

### Step 6: Setup PostgreSQL Database

```bash
cd ..  # Back to root directory

# Start PostgreSQL container
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
sleep 10

# Run database migrations
cd backend
make migrate-up

# Or manually run migrations
docker exec -it profilm_postgres psql -U profilm -d profilm_ewarranty -f /migrations/your_migration.sql
```

### Step 7: Build and Start Services

```bash
cd ..  # Back to root directory

# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Check running containers
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 8: Configure Nginx (Optional, for production)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/profilm_ewarranty
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
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

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads/ {
        proxy_pass http://localhost:8080/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/profilm_ewarranty /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 9: Setup SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### Step 10: Configure Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow Docker ports (if accessing directly)
sudo ufw allow 3000/tcp
sudo ufw allow 8080/tcp

# Check status
sudo ufw status
```

### Step 11: Setup Auto-Start on Reboot

```bash
# Docker containers will auto-start if configured in docker-compose.yml
# Add restart: always to each service

# Enable Docker service
sudo systemctl enable docker
```

### Step 12: Verify Deployment

```bash
# Check all containers are running
docker-compose ps

# Check backend health
curl http://localhost:8080/api/v1/health

# Check frontend
curl http://localhost:3000

# Check logs for any errors
docker-compose logs backend
docker-compose logs frontend
```

## 🔄 Common Operations

### Update Application

```bash
cd /opt/profilm_ewarranty

# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose down
docker-compose build
docker-compose up -d

# Run any new migrations
cd backend
make migrate-up
```

### Backup Database

**Using the automated backup script (Recommended):**

```bash
# Make the script executable
chmod +x backup-database.sh

# Run backup with default settings
./backup-database.sh

# Run backup without compression
./backup-database.sh --no-compress

# Run backup without auto-rotation of old backups
./backup-database.sh --no-rotate

# Specify custom backup directory and retention period
./backup-database.sh --backup-dir /custom/backup/path --retention-days 60

# View all available options
./backup-database.sh --help
```

**Manual backup:**

```bash
# Create backup directory
sudo mkdir -p /opt/backups/profilm_ewarranty

# Backup database
docker exec profilm_postgres pg_dump -U profilm profilm_ewarranty > /opt/backups/profilm_ewarranty/backup_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip /opt/backups/profilm_ewarranty/backup_$(date +%Y%m%d_%H%M%S).sql
```

**Setup automated daily backups with cron:**

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/profilm_ewarranty/backup-database.sh >> /var/log/profilm_backup.log 2>&1

# Add weekly backup on Sunday at 3 AM with 90-day retention
0 3 * * 0 /opt/profilm_ewarranty/backup-database.sh --retention-days 90 >> /var/log/profilm_backup.log 2>&1
```

### Restore Database

**Using the automated restore script (Recommended):**

```bash
# Make the script executable
chmod +x restore-database.sh

# Restore from latest backup (interactive)
./restore-database.sh --latest

# Restore from specific backup file
./restore-database.sh --file backup_20241225_120000.sql.gz

# List available backups and choose interactively
./restore-database.sh

# Skip confirmation prompt (use with caution!)
./restore-database.sh --latest --yes

# View all available options
./restore-database.sh --help
```

**Manual restore:**

```bash
# Restore from compressed backup
gunzip -c /opt/backups/profilm_ewarranty/backup_20241225_120000.sql.gz | docker exec -i profilm_postgres psql -U profilm profilm_ewarranty

# Restore from uncompressed backup
docker exec -i profilm_postgres psql -U profilm profilm_ewarranty < /opt/backups/profilm_ewarranty/backup_20241225_120000.sql
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Stop All Services

```bash
docker-compose down
```

### Remove All Data (Caution!)

```bash
# Stop and remove containers, volumes
docker-compose down -v
```

## 🛠️ Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs service-name

# Check if port is already in use
sudo netstat -tulpn | grep :8080
sudo netstat -tulpn | grep :3000

# Rebuild container
docker-compose build --no-cache service-name
docker-compose up -d service-name
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Connect to PostgreSQL directly
docker exec -it profilm_postgres psql -U profilm -d profilm_ewarranty

# Test connection from backend
docker exec -it profilm_backend ping postgres
```

### Disk Space Issues

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a
docker volume prune

# Remove old images
docker image prune -a
```

## 📝 To Do

Target to finish everything stated below in 2 weeks' time

### 1. Completed

- Product
- Shop
- Home Page Search UI

### 2. In Progress

- Product Allocation

### 3. To Develop

- Admin Dashboard
- Warranty
- Claim

### Individual Features:

1. ✅ Create Product
2. ✅ Update Product
3. ✅ Create Shop
4. ⬜ Update Shop
5. ⬜ Update Shop Password (user password)
6. ⬜ Create Product Allocation
7. ⬜ Update Product Allocation
8. ⬜ Create Warranty
9. ⬜ Update Warranty
10. ⬜ Create Claim
11. ⬜ Update Claim
12. ✅ Search Warranty by Car Plate Number or Warranty Number in Home
13. ⬜ User Authentication
14. ⬜ Upload Image (company license, shop image, installation image, damaged image)
15. ⬜ Auto-Generate Branch Code in Create Shop
16. ⬜ Auto-Generate Warranty Number in Create Warranty
17. ⬜ Auto-Generate Claim Number in Create Claim
