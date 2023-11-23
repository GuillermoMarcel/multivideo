FROM php:7.2.24-apache

# RUN docker-php-ext-install mysqli

COPY ./src /var/www/html/