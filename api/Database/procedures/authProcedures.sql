USE linkup_social_db;
GO

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

-- Procedure: get_all_details_by_id
CREATE OR ALTER PROCEDURE get_all_details_by_id_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    SELECT *
    FROM users WHERE id = @id;
END;
GO

-- Procedure: get_all_details_by_username
CREATE OR ALTER PROCEDURE get_all_details_by_username_proc(
    @username VARCHAR(255)
)
AS
BEGIN
    SELECT *
    FROM users WHERE username = @username;
END;
GO

-- Procedure: get_all_details_by_email
CREATE OR ALTER PROCEDURE get_all_details_by_email_proc(
    @email VARCHAR(255)
)
AS
BEGIN
    SELECT *
    FROM users WHERE email = @email;
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
    SELECT id, username, email, full_name, location, bio, profile_picture, background_picture, created_at
    FROM users WHERE id = @id;
END;
GO

-- Procedure: get_user_by_username
CREATE OR ALTER PROCEDURE get_user_by_username_proc(
    @username VARCHAR(255)
)
AS
BEGIN
    SELECT id, username, email, full_name, location, bio, profile_picture, background_picture, created_at
    FROM users WHERE username = @username;
END;
GO

-- Procedure: get_user_by_email
CREATE OR ALTER PROCEDURE get_user_by_email_proc(
    @email VARCHAR(255)
)
AS
BEGIN
    SELECT id, username, email, full_name, location, bio, profile_picture, background_picture, created_at
    FROM users WHERE email = @email;
END;
GO

-- Procedure: get_user_by_username_or_email
CREATE OR ALTER PROCEDURE get_user_by_username_or_email_proc(
    @username VARCHAR(255),
    @email VARCHAR(255)
)
AS
BEGIN
    SELECT id, username, email, full_name, location, bio, profile_picture, background_picture, created_at
    FROM users WHERE username = @username OR email = @email;
END;
GO
-- get all users procedure
CREATE OR ALTER PROCEDURE get_all_users_proc
AS
BEGIN
    SELECT id, username, email, full_name, location, bio, profile_picture, background_picture, created_at
    FROM users;
END;
GO

--Procedure to update user password
CREATE OR ALTER PROCEDURE update_user_password_proc(
    @id VARCHAR(255),
    @password VARCHAR(255)
)
AS
BEGIN
    UPDATE users SET password = @password WHERE id = @id;
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

-- Procedure: delete_user
CREATE OR ALTER PROCEDURE delete_user_proc(
    @id VARCHAR(255)
)
AS
BEGIN
    DELETE FROM users WHERE id = @id;
END;
GO

-- procedure for tokens

CREATE OR ALTER PROCEDURE get_user_by_reset_token_proc
    @reset_token VARCHAR(255)
AS
BEGIN
    SELECT * FROM user_reset_tokens WHERE token = @reset_token;
END;
GO

-- procedure to create a token
CREATE OR ALTER PROCEDURE create_reset_token_proc
    @id VARCHAR(255),
    @user_id VARCHAR(255),
    @reset_token VARCHAR(255)
AS
BEGIN
    INSERT INTO user_reset_tokens (id, user_id, token)
    VALUES (@id, @user_id, @reset_token);
END;
GO

-- procedure to update a token as expired
CREATE OR ALTER PROCEDURE update_reset_token_proc
    @reset_token VARCHAR(255)
AS
BEGIN
    UPDATE user_reset_tokens SET is_expired = 1 WHERE token = @reset_token;
END;