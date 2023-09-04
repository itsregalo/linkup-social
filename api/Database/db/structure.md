# LinkedUp Social Network Database Structure

## Tables

### User Table

- id VarChar(255)
- name VarChar(255)
- email VarChar(255)
- first_name VarChar(255)
- last_name VarChar(255)
- location VarChar(255)
- bio (VarChar(255))
- password VarChar(255)
- profile_picture VarChar(255)
- background_picture VarChar(255)
- created_at DateTime
- updated_at DateTime

### Post Table

- id VarChar(255)
- user_id VarChar(255)
- picture VarChar(255)
- content VarChar(255)
- postDate DateTime
- created_at DateTime
- updated_at DateTime

### Post Comment Table

- id VarChar(255)
- user_id VarChar(255)
- post_id VarChar(255)
- content VarChar(255)
- created_at DateTime
- updated_at DateTime

### Post Like Table

- id VarChar(255)
- user_id VarChar(255)
- post_id VarChar(255)
- created_at DateTime
- updated_at DateTime

### Comment Reply Table

- id VarChar(255)
- user_id VarChar(255)
- comment_is VarChar(255)
- content VarChar(255)
- created_at DateTime
- updated_at DateTime

### Comment Like Table

- id VarChar(255)
- user_id VarChar(255)
- comment_is VarChar(255)
- created_at DateTime
- updated_at DateTime

### User Follower Table

- id VarChar(255)
- user_id VarChar(255)
- follower_id VarChar(255)
- created_at DateTime
- updated_at DateTime

### User Following Table

- id VarChar(255)
- user_id VarChar(255)
- following_id VarChar(255)
- created_at DateTime
- updated_at DateTime
