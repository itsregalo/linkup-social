USE linkup_social_db;
GO

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
