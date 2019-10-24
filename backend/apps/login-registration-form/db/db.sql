DROP DATABASE IF EXISTS demoAppdb;

CREATE DATABASE demoAppdb;

CREATE TABLE users(id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, userId varchar(36) NOT NULL, username varchar(36), fullName varchar(36), password varchar(36), salt varchar(36), timestamp varchar(36) NOT NULL, isDeleted int(11) NOT NULL);