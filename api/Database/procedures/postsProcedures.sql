USE linkup_social_db;
GO

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

-- procedure: get user posts
CREATE OR ALTER PROCEDURE get_user_posts_proc(
    @user_id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM posts WHERE user_id = @user_id;
END;
GO

-- user tags
CREATE OR ALTER PROCEDURE add_post_users_tagged
    @post_id VARCHAR(255),
    @user_id VARCHAR(255)
AS
BEGIN
    INSERT INTO post_users_tagged (id, user_id, post_id) VALUES (NEWID(), @user_id, @post_id);
END;
GO

-- Procedure to remove all tagged users from a post
CREATE OR ALTER PROCEDURE remove_post_users_tagged
    @post_id VARCHAR(255)
AS
BEGIN
    DELETE FROM post_users_tagged WHERE post_id = @post_id;
END;
GO

-- Procedure to get all tagged users from a post
CREATE OR ALTER PROCEDURE get_post_users_tagged
    @post_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM post_users_tagged WHERE post_id = @post_id;
END;
GO

-- Procedure to get all posts a user is tagged in
CREATE OR ALTER PROCEDURE get_user_posts_tagged
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM posts WHERE id IN (
        SELECT post_id FROM post_users_tagged WHERE user_id = @user_id
        );
END;

