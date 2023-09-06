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

-- procedure: get_all_posts
CREATE OR ALTER PROCEDURE get_all_posts_proc
AS
BEGIN
    SELECT * FROM posts;
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

-- procedure: get category by name
CREATE OR ALTER PROCEDURE get_category_by_name_proc(
    @name VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM post_category WHERE name = @name;
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

-- procedure: get_post_likes
CREATE OR ALTER PROCEDURE get_post_likes_proc(
    @post_id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM post_likes WHERE post_id = @post_id;
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

-- procedure: get_comment_likes
CREATE OR ALTER PROCEDURE get_comment_likes_proc(
    @comment_id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM comment_likes WHERE comment_id = @comment_id;
END;
GO

