-- CREATING THE DATABASE

DROP DATABASE IF EXISTS linkup_social_db;

CREATE DATABASE linkup_social_db;

USE linkup_social_db;

-- USER

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

-- POSTS

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
    parent_id VARCHAR(255),
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


-- PROCEDURES


-- Procedure: create_user
CREATE OR ALTER PROCEDURE first_time_registration_proc(
    @id VARCHAR(255),
    @username VARCHAR(255),
    @email VARCHAR(255),
    @full_name VARCHAR(255),
    @password VARCHAR(255)
)
AS
BEGIN
    INSERT INTO users (id, username, email, full_name, password)
    VALUES (@id, @username, @email, @full_name, @password);
END;
GO

CREATE OR ALTER PROCEDURE create_user_proc(
    @id VARCHAR(255),
    @username VARCHAR(255),
    @email VARCHAR(255),
    @full_name VARCHAR(255),
    @location VARCHAR(255),
    @bio VARCHAR(255),
    @profile_picture VARCHAR(255),
    @background_picture VARCHAR(255),
    @password VARCHAR(255)
)
AS
BEGIN
    INSERT INTO users (id, username, email, full_name, location, bio, profile_picture, background_picture, password)
    VALUES (@id, @username, @email, @full_name, @location, @bio, @profile_picture, @background_picture, @password);
END;
GO

-- Procedure: get_user_by_id
CREATE OR ALTER PROCEDURE get_user_by_id_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM users WHERE id = @id;
END;
GO

-- Procedure: get_user_by_username
CREATE OR ALTER PROCEDURE get_user_by_username_proc(
    @username VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM users WHERE username = @username;
END;
GO

-- Procedure: get_user_by_email
CREATE OR ALTER PROCEDURE get_user_by_email_proc(
    @email VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM users WHERE email = @email;
END;
GO

-- Procedure: get_user_by_username_or_email
CREATE OR ALTER PROCEDURE get_user_by_username_or_email_proc(
    @username VARCHAR(255),
    @email VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM users WHERE username = @username OR email = @email;
END;
GO
-- get all users procedure
CREATE OR ALTER PROCEDURE get_all_users_proc
AS
BEGIN
    SELECT * FROM users;
END;
GO

-- update user prfile
CREATE OR ALTER PROCEDURE update_user_profile_proc(
    @id VARCHAR(255),
    @username VARCHAR(255),
    @full_name VARCHAR(255),
    @location VARCHAR(255),
    @bio VARCHAR(255),
    @profile_picture VARCHAR(255),
    @background_picture VARCHAR(255)
)

AS
BEGIN
    UPDATE users SET username = @username, full_name = @full_name, location = @location, bio = @bio, profile_picture = @profile_picture, background_picture = @background_picture WHERE id = @id;
END;
GO

-- POSTS PROCEDURES


-- procedure: create_post
CREATE OR ALTER PROCEDURE create_post_proc(
    @id VARCHAR(255),
    @user_id VARCHAR(255),
    @picture VARCHAR(255),
    @content NVARCHAR(MAX),
    @category_id VARCHAR(255)
)
AS
BEGIN
    INSERT INTO posts (id, user_id, picture, content, category_id)
    VALUES (@id, @user_id, @picture, @content, @category_id);
END;
GO

-- procedure: update_post
CREATE OR ALTER PROCEDURE update_post_proc(
    @id VARCHAR(255),
    @picture VARCHAR(255),
    @content NVARCHAR(MAX),
    @category_id VARCHAR(255)
)
AS
BEGIN
    UPDATE posts
    SET picture = @picture, content = @content, category_id = @category_id, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id;
END;
GO

-- procedure: get_all_posts
CREATE OR ALTER PROCEDURE get_all_posts_proc
AS
BEGIN
    SELECT * FROM posts;
END;
GO

-- procedure: get active posts
CREATE OR ALTER PROCEDURE get_active_posts_proc
AS
BEGIN
    SELECT * FROM posts WHERE is_deleted = 0;
END;
GO

-- procedure: get_post_by_id
CREATE OR ALTER PROCEDURE get_post_by_id_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM posts WHERE id = @id;
END;
GO

-- procedure: soft_delete_post
CREATE OR ALTER PROCEDURE soft_delete_post_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    UPDATE posts
    SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id;
END;
GO



-- CATEGORY PROCEDURES
-- procedure: create post_category
CREATE OR ALTER PROCEDURE create_post_category_proc(
    @id VARCHAR(255),
    @name VARCHAR(255)
)
AS
BEGIN
    INSERT INTO post_category (id, name)
    VALUES (@id, @name);
END;
GO

-- procedure: update post_category
CREATE OR ALTER PROCEDURE update_post_category_proc(
    @id VARCHAR(255),
    @name VARCHAR(255)
)
AS
BEGIN
    UPDATE post_category
    SET name = @name, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id;
END;
GO

-- procedure: get_all_post_categories
CREATE OR ALTER PROCEDURE get_all_post_categories_proc
AS
BEGIN
    SELECT * FROM post_category;
END;
GO

-- procedure: get category by name
CREATE OR ALTER PROCEDURE get_category_by_name_proc(
    @name VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM post_category WHERE name = @name;
END;
GO

-- procedure: get category by id
CREATE OR ALTER PROCEDURE get_category_by_id_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM post_category WHERE id = @id;
END;
GO

-- procedure: get default category
CREATE OR ALTER PROCEDURE get_default_category_proc
AS
BEGIN
    SELECT * FROM post_category WHERE name = 'General';
END;
GO

-- procedure: delete post_category
CREATE OR ALTER PROCEDURE delete_post_category_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    DELETE FROM post_category WHERE id = @id;
END;
GO

-- COMMENTS PROCEDURES
-- procedure: create post_comment
CREATE OR ALTER PROCEDURE add_post_comment_proc(
    @id VARCHAR(255),
    @user_id VARCHAR(255),
    @post_id VARCHAR(255),
    @content VARCHAR(500)
)
AS
BEGIN
    INSERT INTO post_comments (id, user_id, post_id, content)
    VALUES (@id, @user_id, @post_id, @content);
END;
GO

-- procedure: update post_comment
CREATE OR ALTER PROCEDURE update_post_comment_proc(
    @id VARCHAR(255),
    @content VARCHAR(500)
)
AS
BEGIN
    UPDATE post_comments
    SET content = @content, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id;
END;
GO

-- procedure: get_post_comments
CREATE OR ALTER PROCEDURE get_post_comments_proc(
    @post_id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM post_comments WHERE post_id = @post_id;
END;
GO

-- procedure: get comment by id
CREATE OR ALTER PROCEDURE get_comment_by_id_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM post_comments WHERE id = @id;
END;
GO

-- procedure: soft delete comment
CREATE OR ALTER PROCEDURE soft_delete_comment_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    UPDATE post_comments
    SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id;
END;
GO

-- procedure: create comment reply
CREATE OR ALTER PROCEDURE add_comment_reply_proc(
    @id VARCHAR(255),
    @user_id VARCHAR(255),
    @comment_id VARCHAR(255),
    @content VARCHAR(255)
)
AS
BEGIN
    INSERT INTO comment_replies (id, user_id, comment_id, content)
    VALUES (@id, @user_id, @comment_id, @content);
END;
GO

-- procedure: update comment reply
CREATE OR ALTER PROCEDURE update_comment_reply_proc(
    @id VARCHAR(255),
    @content VARCHAR(255)
)
AS
BEGIN
    UPDATE comment_replies
    SET content = @content, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id;
END;
GO

-- procedure: get_comment_replies
CREATE OR ALTER PROCEDURE get_comment_replies_proc(
    @comment_id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM comment_replies WHERE comment_id = @comment_id;
END;
GO

-- procedure: get reply by id
CREATE OR ALTER PROCEDURE get_reply_by_id_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM comment_replies WHERE id = @id;
END;
GO

-- procedure: soft delete reply
CREATE OR ALTER PROCEDURE soft_delete_reply_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    UPDATE comment_replies
    SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id;
END;
GO

--END COMMENTS PROCEDURES


-- LIKES PROCEDURES
-- procedure: get_post_likes
CREATE OR ALTER PROCEDURE get_post_likes_proc(
    @post_id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM post_likes WHERE post_id = @post_id;
END;
GO

-- procedure: get_post_likes_by_user (get likes by user)
CREATE OR ALTER PROCEDURE get_post_likes_by_user_proc(
    @user_id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM post_likes WHERE user_id = @user_id;
END;
GO

-- procedure: if_user_liked_post
CREATE OR ALTER PROCEDURE if_user_liked_post_proc(
    @user_id VARCHAR(255),
    @post_id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM post_likes WHERE user_id = @user_id AND post_id = @post_id;
END;
GO

-- procedure: like post
CREATE OR ALTER PROCEDURE like_post_proc(
    @id VARCHAR(255),
    @user_id VARCHAR(255),
    @post_id VARCHAR(255)
)
AS
BEGIN
    INSERT INTO post_likes (id, user_id, post_id)
    VALUES (@id, @user_id, @post_id);
END;
GO

-- procedure: unlike post
CREATE OR ALTER PROCEDURE unlike_post_proc(
    @user_id VARCHAR(255),
    @post_id VARCHAR(255)
)
AS
BEGIN
    DELETE FROM post_likes WHERE user_id = @user_id AND post_id = @post_id;
END;
GO

-- procedure: get_comment_likes
CREATE OR ALTER PROCEDURE get_comment_likes_proc(
    @comment_id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM comment_likes WHERE comment_id = @comment_id;
END;
GO

-- procedure: get_reply_likes
CREATE OR ALTER PROCEDURE get_reply_likes_proc(
    @reply_id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM reply_likes WHERE reply_id = @reply_id;
END;
GO

-- procedure: like comment
CREATE OR ALTER PROCEDURE like_comment_proc(
    @id VARCHAR(255),
    @user_id VARCHAR(255),
    @comment_id VARCHAR(255)
)
AS
BEGIN
    INSERT INTO comment_likes (id, user_id, comment_id)
    VALUES (@id, @user_id, @comment_id);
END;
GO

-- procedure: unlike comment
CREATE OR ALTER PROCEDURE unlike_comment_proc(
    @user_id VARCHAR(255),
    @comment_id VARCHAR(255)
)
AS
BEGIN
    DELETE FROM comment_likes WHERE user_id = @user_id AND comment_id = @comment_id;
END;
GO

-- procedure: if_user_liked_comment
CREATE OR ALTER PROCEDURE if_user_liked_comment_proc(
    @user_id VARCHAR(255),
    @comment_id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM comment_likes WHERE user_id = @user_id AND comment_id = @comment_id;
END;
GO

-- FOLLOWERS PROCEDURES


-- Procedure: get user followers
CREATE OR ALTER PROCEDURE get_user_followers_proc
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM followers WHERE user_id = @user_id;
END;
GO

-- Procedure: get user following
CREATE OR ALTER PROCEDURE get_user_following_proc
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM followers WHERE follower_id = @user_id;
END;
GO

-- Procedure: follow user
CREATE OR ALTER PROCEDURE follow_user_proc
    @id VARCHAR(255),
    @user_id VARCHAR(255),
    @follower_id VARCHAR(255)
AS
BEGIN
    INSERT INTO followers (id, user_id, follower_id)
    VALUES (@id, @user_id, @follower_id);
END;
GO

-- Procedure: unfollow user
CREATE OR ALTER PROCEDURE unfollow_user_proc
    @user_id VARCHAR(255),
    @follower_id VARCHAR(255)
AS
BEGIN
    DELETE FROM followers WHERE user_id = @user_id AND follower_id = @follower_id;
END;
GO