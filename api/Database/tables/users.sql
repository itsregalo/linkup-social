USE linkup_social_db;

-- Path: api/Database/db/create_tables.sql

-- Table: users
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    bio VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255) NOT NULL,
    background_picture VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);