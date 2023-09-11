USE linkup_social_db;

DROP TABLE IF EXISTS users;
-- Table: users
CREATE TABLE users (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    bio VARCHAR(255),
    profile_picture VARCHAR(255),
    background_picture VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
GO

