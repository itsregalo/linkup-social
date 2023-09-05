
USE linkup_social_db;
GO;

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
GO;

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
GO;

-- Procedure: get_user_by_id
CREATE OR ALTER PROCEDURE get_user_by_id_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM users WHERE id = @id;
END;
GO;

-- Procedure: get_user_by_username
CREATE OR ALTER PROCEDURE get_user_by_username_proc(
    @username VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM users WHERE username = @username;
END;
GO;

-- Procedure: get_user_by_email
CREATE OR ALTER PROCEDURE get_user_by_email_proc(
    @email VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM users WHERE email = @email;
END;
GO;

-- Procedure: get_user_by_username_or_email
CREATE OR ALTER PROCEDURE get_user_by_username_or_email_proc(
    @username VARCHAR(255),
    @email VARCHAR(255)
)
AS
BEGIN
    SELECT * FROM users WHERE username = @username OR email = @email;
END;
GO;