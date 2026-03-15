-- =========================================
-- Database setup
-- =========================================
CREATE DATABASE IF NOT EXISTS dkinganjatou1251_lab02;
USE dkinganjatou1251_lab02;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- =========================================
-- Drop tables (safe re-import)
-- =========================================
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS user_roles;

-- USERS TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- ROLES TABLE
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    role_rank INT NOT NULL
);

-- USER ROLES LINK TABLE
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL, 
    PRIMARY KEY(user_id, role_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- =========================================
-- Insert user_role
-- =========================================
INSERT INTO roles (role_name, description, role_rank) VALUES
('Root', 'Full system access', 0),
('Administrator', 'System administrator', 1),
('Member', 'Regular user', 10); 