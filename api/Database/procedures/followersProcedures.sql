USE linkup_social_db;
GO

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

-- Procedure: check is followed
CREATE OR ALTER PROCEDURE check_is_followed_proc
    @user_id VARCHAR(255),
    @follower_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM followers WHERE user_id = @user_id AND follower_id = @follower_id;
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

-- procedure: get users not foollowing
CREATE OR ALTER PROCEDURE get_users_not_following_proc
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT id, username, email, full_name, location, bio, profile_picture, created_at 
    FROM users WHERE id NOT IN (
        SELECT following_id FROM following WHERE user_id = @user_id);
END;
GO

-- get posts from users a user is following
CREATE OR ALTER PROCEDURE get_posts_from_users_following_proc
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM posts WHERE user_id IN (
        SELECT following_id FROM following WHERE user_id = @user_id);
END;