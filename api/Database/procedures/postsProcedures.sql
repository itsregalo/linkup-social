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


