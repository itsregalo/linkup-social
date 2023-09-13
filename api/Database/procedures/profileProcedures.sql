USE linkup_social_db;
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

-- update user background picture
CREATE OR ALTER PROCEDURE update_user_background_picture_proc(
    @id VARCHAR(255),
    @background_picture VARCHAR(255)
)
AS
BEGIN
    UPDATE users SET background_picture = @background_picture WHERE id = @id;
END;
GO

-- update user profile picture
CREATE OR ALTER PROCEDURE update_user_profile_picture_proc(
    @id VARCHAR(255),
    @profile_picture VARCHAR(255)
)
AS
BEGIN
    UPDATE users SET profile_picture = @profile_picture WHERE id = @id;
END;
GO