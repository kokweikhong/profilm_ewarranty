@echo off
REM Initialize Let's Encrypt SSL certificates with Certbot (Windows version)
REM This script should be run once to obtain initial certificates

where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: docker is not installed.
    exit /b 1
)

REM Load environment variables
if exist .env (
    for /f "usebackq tokens=*" %%a in (.env) do (
        echo %%a | findstr /v "^#" >nul && set %%a
    )
)

REM Configuration
if not defined DOMAIN_NAME set DOMAIN_NAME=example.com
if not defined SSL_EMAIL set SSL_EMAIL=
if not defined STAGING set STAGING=0
set rsa_key_size=4096
set data_path=.\certbot

if exist %data_path% (
    echo Existing data found for %DOMAIN_NAME%.
    set /p decision="Continue and replace existing certificate? (y/N) "
    if /i not "%decision%"=="y" exit /b 0
)

if not exist "%data_path%\conf\options-ssl-nginx.conf" (
    echo ### Downloading recommended TLS parameters ...
    if not exist "%data_path%\conf" mkdir "%data_path%\conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -o "%data_path%\conf\options-ssl-nginx.conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem -o "%data_path%\conf\ssl-dhparams.pem"
    echo.
)

echo ### Creating dummy certificate for %DOMAIN_NAME% ...
set path=/etc/letsencrypt/live/%DOMAIN_NAME%
if not exist "%data_path%\conf\live\%DOMAIN_NAME%" mkdir "%data_path%\conf\live\%DOMAIN_NAME%"
docker compose run --rm --entrypoint "openssl req -x509 -nodes -newkey rsa:%rsa_key_size% -days 1 -keyout '%path%/privkey.pem' -out '%path%/fullchain.pem' -subj '/CN=localhost'" certbot
echo.

echo ### Starting nginx ...
docker compose up --force-recreate -d nginx
echo.

echo ### Deleting dummy certificate for %DOMAIN_NAME% ...
docker compose run --rm --entrypoint "rm -Rf /etc/letsencrypt/live/%DOMAIN_NAME% && rm -Rf /etc/letsencrypt/archive/%DOMAIN_NAME% && rm -Rf /etc/letsencrypt/renewal/%DOMAIN_NAME%.conf" certbot
echo.

echo ### Requesting Let's Encrypt certificate for %DOMAIN_NAME% ...
set domain_args=-d %DOMAIN_NAME%

if "%SSL_EMAIL%"=="" (
    set email_arg=--register-unsafely-without-email
) else (
    set email_arg=--email %SSL_EMAIL%
)

if "%STAGING%"=="1" (
    set staging_arg=--staging
) else (
    set staging_arg=
)

docker compose run --rm --entrypoint "certbot certonly --webroot -w /var/www/certbot %staging_arg% %email_arg% %domain_args% --rsa-key-size %rsa_key_size% --agree-tos --force-renewal" certbot
echo.

echo ### Reloading nginx ...
docker compose exec nginx nginx -s reload

echo.
echo ### SSL certificate setup complete!
