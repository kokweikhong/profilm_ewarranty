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
