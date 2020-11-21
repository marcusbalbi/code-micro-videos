#!/bin/bash

#On error no such file entrypoint.sh, execute in terminal - dos2unix .docker\entrypoint.sh
cp .env.example .env
cp .env.example.testing .env.testing
#chown -R www-data:www-data .
chmod 777 -R storage/
composer --version
composer install
php artisan key:generate
php artisan migrate
php artisan cache:clear
php-fpm
