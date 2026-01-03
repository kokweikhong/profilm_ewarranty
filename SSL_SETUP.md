# SSL/TLS Configuration for Profilm E-Warranty

This document describes the SSL/TLS certificate setup using Let's Encrypt and Certbot.

## Prerequisites

1. A registered domain name pointing to your server
2. Docker and Docker Compose installed
3. Ports 80 and 443 open on your server

## Environment Variables

Add the following variables to your `.env` file:

```env
# Domain Configuration
DOMAIN_NAME=your-domain.com

# SSL Email (for Let's Encrypt notifications)
SSL_EMAIL=your-email@example.com

# Staging mode (1 for testing, 0 for production)
STAGING=0

# Nginx Ports
NGINX_PORT=80
NGINX_SSL_PORT=443
```

## Initial Setup

### Option 1: Linux/macOS

1. Make the initialization script executable:

   ```bash
   chmod +x init-letsencrypt.sh
   ```

2. Run the initialization script:
   ```bash
   ./init-letsencrypt.sh
   ```

### Option 2: Windows

Run the Windows batch file:

```cmd
init-letsencrypt.bat
```

## What the Script Does

1. Downloads recommended TLS parameters from Certbot
2. Creates a dummy certificate for nginx to start
3. Starts nginx with the dummy certificate
4. Deletes the dummy certificate
5. Requests a real certificate from Let's Encrypt
6. Reloads nginx with the new certificate

## Certificate Renewal

Certificates are automatically renewed by the certbot container, which checks twice daily and renews certificates that are expiring within 30 days.

The nginx container reloads every 6 hours to pick up renewed certificates.

## Manual Certificate Renewal

To manually renew certificates:

```bash
docker compose run --rm certbot renew
docker compose exec nginx nginx -s reload
```

## Staging Mode

When testing your setup, set `STAGING=1` in your `.env` file to use Let's Encrypt's staging environment. This avoids hitting rate limits (5 certificates per domain per week).

Once you've verified everything works, set `STAGING=0` and run the init script again to get production certificates.

## Troubleshooting

### Certificate not working

1. Check nginx logs:

   ```bash
   docker compose logs nginx
   ```

2. Check certbot logs:
   ```bash
   docker compose logs certbot
   ```

### Domain not resolving

Ensure your domain's DNS A record points to your server's IP address:

```bash
nslookup your-domain.com
```

### Port 80/443 not accessible

Verify ports are open:

```bash
netstat -tuln | grep -E ':(80|443)'
```

### Rate limit exceeded

If you hit Let's Encrypt's rate limits, use staging mode or wait until the rate limit resets.

## Security Considerations

The nginx configuration includes:

- **TLS 1.2 and 1.3 only** - Older protocols disabled
- **Strong cipher suites** - No weak ciphers
- **HSTS** - HTTP Strict Transport Security enabled
- **OCSP Stapling** - For better performance and privacy
- **Security headers** - X-Frame-Options, X-Content-Type-Options, etc.

## Configuration Files

- `nginx/conf.d/default.conf` - Main nginx configuration with SSL
- `docker-compose.yml` - Docker services including certbot
- `init-letsencrypt.sh` - Certificate initialization (Linux/macOS)
- `init-letsencrypt.bat` - Certificate initialization (Windows)

## Additional Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot Documentation](https://certbot.eff.org/docs/)
- [nginx SSL Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)
