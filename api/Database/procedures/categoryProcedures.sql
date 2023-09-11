USE linkup_social_db;
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