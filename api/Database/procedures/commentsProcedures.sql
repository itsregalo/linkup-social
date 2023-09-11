USE linkup_social_db;
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

