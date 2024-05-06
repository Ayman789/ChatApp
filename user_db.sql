CREATE DATABASE LanguageUsers;
USE LanguageUsers;
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2026';
GRANT ALL PRIVILEGES ON LanguageUsers.* TO 'appuser'@'localhost';
CREATE TABLE UserInfo (username VARCHAR(50), first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, hashedPassword VARCHAR(255) NOT NULL, PRIMARY KEY (username));

DROP USER 'appuser'@'localhost';

DROP TABLE UserInfo;

SELECT * FROM UserInfo;
