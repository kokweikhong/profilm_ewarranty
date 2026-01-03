# Nginx & Certbot Setup Guide

Complete step-by-step guide to setup nginx reverse proxy with SSL/TLS certificates for ProFilm eWarranty.

## Prerequisites

- Domain name pointing to your server (e.g., inikali.com)
- Docker and Docker Compose installed
- Ports 80 and 443 accessible
- Services running: postgres, backend, frontend

## Step 1: Configure Environment Variables

Update your `.env` file with domain information:

```bash
nano .env
```

Add these variables:

```env
# Domain Configuration
DOMAIN_NAME=inikali.com

# SSL Email (for Let's Encrypt notifications)
SSL_EMAIL=your-email@example.com

# Staging mode (1 for testing, 0 for production)
STAGING=0

# Nginx Ports
NGINX_PORT=80
NGINX_SSL_PORT=443

# Frontend API URL (will update after SSL)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Step 2: Verify DNS Configuration

Before proceeding, ensure your domain points to your server:

```bash
# Check your server's public IP
curl -s http://checkip.amazonaws.com

# Verify DNS resolution
nslookup inikali.com

# Test HTTP accessibility (if frontend is running)
curl -I http://inikali.com
```

The DNS A record should point to your server's IP address.

## Step 3: Create Nginx Directory Structure

```bash
# Create directories
mkdir -p nginx/conf.d
mkdir -p certbot/conf
mkdir -p certbot/www
```

## Step 4: Create Nginx Configuration Files

### Main nginx.conf

Create `nginx/nginx.conf`:

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    types_hash_max_size 2048;

    gzip  on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    include /etc/nginx/conf.d/*.conf;
}
```

### HTTP-Only Configuration

Create `nginx/conf.d/default.conf`:

```nginx
upstream backend {
    server backend:8080;
}

upstream frontend {
    server frontend:3000;
}

# HTTP Server
server {
    listen 80;
    listen [::]:80;
    server_name inikali.com www.inikali.com;

    client_max_body_size 10M;

    # Allow certbot challenges
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Backend API
    location /api {
        proxy_pass http://backend:8080/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### Create Nginx Dockerfile

Create `nginx/Dockerfile`:

```dockerfile
FROM nginx:alpine

# Remove default nginx configs
RUN rm -f /etc/nginx/conf.d/default.conf

# Create certbot directories
RUN mkdir -p /var/www/certbot

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```

## Step 5: Update docker-compose.yml

Ensure your nginx and certbot services are configured:

```yaml
# Nginx Reverse Proxy
nginx:
  build:
    context: ./nginx
    dockerfile: Dockerfile
  container_name: profilm_nginx
  restart: unless-stopped
  env_file:
    - .env
  ports:
    - "${NGINX_PORT:-80}:80"
    - "${NGINX_SSL_PORT:-443}:443"
  volumes:
    - ./certbot/conf:/etc/letsencrypt
    - ./certbot/www:/var/www/certbot:ro
  depends_on:
    - backend
    - frontend
  networks:
    - profilm_network
  command: '/bin/sh -c ''while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g "daemon off;"'''

# Certbot for SSL certificates
certbot:
  image: certbot/certbot
  container_name: profilm_certbot
  volumes:
    - ./certbot/conf:/etc/letsencrypt
    - ./certbot/www:/var/www/certbot
  entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
  depends_on:
    - nginx
  networks:
    - profilm_network
```

## Step 6: Start Nginx (HTTP Only)

```bash
# Build and start nginx
docker-compose build nginx
docker-compose up -d nginx

# Check nginx logs
docker-compose logs nginx

# Verify nginx is running
docker-compose ps nginx

# Test HTTP access
curl -I http://inikali.com
```

## Step 7: Obtain SSL Certificates

### Option A: Using the Initialization Script

```bash
# Make script executable
chmod +x init-letsencrypt.sh

# Run the script
./init-letsencrypt.sh
```

### Option B: Manual Certificate Generation

```bash
# Stop certbot if running
docker-compose stop certbot

# Request certificate
docker-compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d inikali.com \
  -d www.inikali.com

# Verify certificates were created
sudo ls -la certbot/conf/live/
```

## Step 8: Create Symlink (if needed)

If certificates are in `inikali.com-0001` folder:

```bash
# Check certificate location
sudo ls -la certbot/conf/live/

# Create symlink if needed
cd certbot/conf/live/
sudo ln -s inikali.com-0001 inikali.com
cd ../../../

# Verify
sudo ls -la certbot/conf/live/inikali.com/
```

## Step 9: Update Nginx for HTTPS

Create `nginx/conf.d/default-ssl.conf`:

```nginx
upstream backend {
    server backend:8080;
}

upstream frontend {
    server frontend:3000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name inikali.com www.inikali.com;

    # Allow certbot challenges
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;

    server_name inikali.com www.inikali.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/inikali.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/inikali.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/inikali.com/chain.pem;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    client_max_body_size 10M;

    # Backend API
    location /api {
        proxy_pass http://backend:8080/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

Replace the HTTP-only config with HTTPS config:

```bash
# Backup current config
cp nginx/conf.d/default.conf nginx/conf.d/default-http.conf.backup

# Use SSL config
cp nginx/conf.d/default-ssl.conf nginx/conf.d/default.conf

# Rebuild nginx
docker-compose build --no-cache nginx

# Restart nginx
docker-compose stop nginx
docker-compose rm -f nginx
docker-compose up -d nginx

# Check logs
docker-compose logs nginx --tail=30
```

## Step 10: Update Frontend Environment

Update `.env` file:

```env
NEXT_PUBLIC_API_URL=https://inikali.com/api
```

Restart frontend:

```bash
docker-compose build frontend
docker-compose restart frontend
```

## Step 11: Start Certbot for Auto-Renewal

```bash
docker-compose up -d certbot

# Check certbot is running
docker-compose ps certbot
```

## Step 12: Verification

### Check Nginx Ports

```bash
# Verify nginx is listening on both ports
docker-compose exec nginx netstat -tlnp

# Should show:
# tcp  0.0.0.0:80   (HTTP - redirects to HTTPS)
# tcp  0.0.0.0:443  (HTTPS)
```

### Test HTTP Redirect

```bash
# Should return 301 redirect
curl -I http://inikali.com
```

### Test HTTPS

```bash
# Should return 200 OK with HTTPS
curl -I https://inikali.com

# Test backend API
curl https://inikali.com/api/health

# Test health endpoint
curl https://inikali.com/health
```

### Check SSL Certificate

```bash
# View certificate details
echo | openssl s_client -servername inikali.com -connect inikali.com:443 2>/dev/null | openssl x509 -noout -subject -dates

# Should show:
# subject=CN=inikali.com
# notBefore=<date>
# notAfter=<date>
```

### Browser Test

Open in browser:

- https://inikali.com - Should show 🔒 padlock icon
- http://inikali.com - Should redirect to HTTPS

### SSL Grade Test

Check your SSL configuration:

- https://www.ssllabs.com/ssltest/analyze.html?d=inikali.com

## Step 13: Test Certificate Renewal

```bash
# Test renewal (dry-run, doesn't actually renew)
docker-compose run --rm certbot renew --dry-run

# Should show: "Congratulations, all simulated renewals succeeded"
```

## Troubleshooting

### Port 443 Not Listening

```bash
# Check nginx config
docker-compose exec nginx nginx -t

# Check certificate files exist
docker-compose exec nginx ls -la /etc/letsencrypt/live/inikali.com/

# Check nginx logs
docker-compose logs nginx --tail=50
```

### Certificate Not Found

```bash
# List certificates
sudo ls -la certbot/conf/live/

# If in inikali.com-0001, create symlink
cd certbot/conf/live/
sudo ln -s inikali.com-0001 inikali.com
cd ../../../
```

### 404 API Errors

Ensure nginx backend location preserves the `/api` path:

```nginx
# Correct
location /api {
    proxy_pass http://backend:8080/api;
}

# Incorrect (strips /api)
location /api/ {
    proxy_pass http://backend/;
}
```

### Certbot Fails

```bash
# Check DNS first
nslookup inikali.com

# Try staging mode first
# Edit .env: STAGING=1
./init-letsencrypt.sh

# Check certbot logs
docker-compose logs certbot
```

## Maintenance

### Manual Certificate Renewal

```bash
docker-compose run --rm certbot renew
docker-compose exec nginx nginx -s reload
```

### View Logs

```bash
# Nginx logs
docker-compose logs nginx -f

# Certbot logs
docker-compose logs certbot -f
```

### Restart Services

```bash
# Restart nginx only
docker-compose restart nginx

# Restart all services
docker-compose restart
```

## Security Checklist

- [ ] HTTPS enabled with valid certificate
- [ ] HTTP redirects to HTTPS
- [ ] HSTS header enabled
- [ ] Security headers configured
- [ ] TLS 1.2 and 1.3 only
- [ ] Strong cipher suites
- [ ] OCSP stapling enabled
- [ ] Auto-renewal configured
- [ ] Firewall allows ports 80 and 443
- [ ] SSL Labs rating A or A+

## Certificate Information

- **Issuer**: Let's Encrypt
- **Validity**: 90 days
- **Auto-renewal**: 30 days before expiry
- **Renewal check**: Twice daily (certbot container)
- **Nginx reload**: Every 6 hours

## Important Notes

1. **Test with staging first**: Set `STAGING=1` to avoid rate limits
2. **DNS must be configured**: Domain must point to server before requesting certificates
3. **Ports must be open**: Firewall must allow 80 and 443
4. **Volume permissions**: Remove `:ro` flag from certbot volume to allow symlink reading
5. **Backend API path**: Ensure nginx preserves `/api` prefix when proxying

## Next Steps

After successful setup:

1. Monitor certificate expiry dates
2. Test auto-renewal in 60 days
3. Configure backup for certbot volumes
4. Add monitoring/alerting for SSL expiry
5. Consider adding www redirect if needed

## Support

For issues:

- Check nginx logs: `docker-compose logs nginx`
- Check certbot logs: `docker-compose logs certbot`
- Verify DNS: `nslookup inikali.com`
- Test SSL: https://www.ssllabs.com/ssltest/

Your nginx reverse proxy with SSL/TLS is now fully configured! 🎉🔒
