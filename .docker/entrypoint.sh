#!/bin/bash

### FRONTEND
npm config set cache /var/www/.npm-cache --global
cd /var/www/frontend && npm install  && cd ..
#On error no such file entrypoint.sh, execute in terminal - dos2unix .docker\entrypoint.sh

### BACKEND
cd backend
if [ ! -f ".env" ]; then
  cp .env.example .env
fi
if [ ! -f ".env.testing" ]; then
  cp .env.example.testing .env.testing
fi
#chown -R www-data:www-data .
chmod 777 -R storage/
composer --version
composer install
php artisan key:generate
php artisan migrate
php artisan cache:clear
php-fpm
