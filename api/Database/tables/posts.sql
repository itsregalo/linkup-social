USE linkup_social_db;

-- Table: posts
DROP TABLE IF EXISTS post_category;

CREATE TABLE post_category (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

DROP TABLE IF EXISTS tags;

CREATE TABLE tags (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

DROP TABLE IF EXISTS post_tags;

CREATE TABLE post_tags (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL,
    tag_id VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    picture VARCHAR(255),
    content NVARCHAR(MAX) NOT NULL,
    category_id VARCHAR(255) NOT NULL,
    is_deleted BIT DEFAULT 0,
    post_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table: post_user_tags
DROP TABLE IF EXISTS post_users_tagged;

CREATE TABLE post_users_tagged (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    post_id VARCHAR(255) NOT NULL,
    tag_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Table: comments
DROP TABLE IF EXISTS post_comments;

CREATE TABLE post_comments (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    post_id VARCHAR(255) NOT NULL,
    content VARCHAR(500) NOT NULL,
    is_deleted BIT DEFAULT 0,
    comment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Table: likes
DROP TABLE IF EXISTS post_likes;

CREATE TABLE post_likes (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    post_id VARCHAR(255) NOT NULL,
    like_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Table: comment replies
DROP TABLE IF EXISTS comment_replies;

CREATE TABLE comment_replies (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    comment_id VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL,
    is_deleted BIT DEFAULT 0,
    reply_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (comment_id) REFERENCES post_comments(id)
);

-- Table: comment likes

DROP TABLE IF EXISTS comment_likes;

CREATE TABLE comment_likes (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    comment_id VARCHAR(255) NOT NULL,
    like_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (comment_id) REFERENCES post_comments(id)
);

-- Table: followers

DROP TABLE IF EXISTS followers;

CREATE TABLE followers (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    follower_id VARCHAR(255) NOT NULL,
    follow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (follower_id) REFERENCES users(id)
);

-- Table: following

DROP TABLE IF EXISTS following;

CREATE TABLE following (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    following_id VARCHAR(255) NOT NULL,
    follow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id)
);

