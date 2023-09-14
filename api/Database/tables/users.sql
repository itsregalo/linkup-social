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
    profile_picture VARCHAR(255) DEFAULT 'https://static.thenounproject.com/png/5034901-200.png',
    background_picture VARCHAR(255) DEFAULT 'https://res.cloudinary.com/ddv1q5oiq/image/upload/v1694688866/linkup/wmefvmvdlpvkkq0jyneb.jpg',
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: user_followers
DROP TABLE IF EXISTS users_reset_tokens;

CREATE TABLE user_reset_tokens (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    is_expired BIT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


