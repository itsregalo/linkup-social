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

-- Procedure: unfollow user
CREATE OR ALTER PROCEDURE unfollow_user_proc
    @user_id VARCHAR(255),
    @follower_id VARCHAR(255)
AS
BEGIN
    DELETE FROM followers WHERE user_id = @user_id AND follower_id = @follower_id;
END;
GO