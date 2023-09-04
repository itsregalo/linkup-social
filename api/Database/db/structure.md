# LinkedUp Social Network Database Structure

## Tables

### User Table

- id VarChar(255)
- name VarChar(255)
- email VarChar(255)
- firstName VarChar(255)
- lastName VarChar(255)
- location VarChar(255)
- bio (VarChar(255))
- password VarChar(255)
- profilePicture VarChar(255)
- createdAt DateTime
- updatedAt DateTime

### Post Table

- id VarChar(255)
- userId VarChar(255)
- picture VarChar(255)
- content VarChar(255)
- postDate DateTime
- createdAt DateTime
- updatedAt DateTime

### Post Comment Table

- id VarChar(255)
- userId VarChar(255)
- postId VarChar(255)
- content VarChar(255)
- createdAt DateTime
- updatedAt DateTime

### Post Like Table

- id VarChar(255)
- userId VarChar(255)
- postId VarChar(255)
- createdAt DateTime
- updatedAt DateTime

### Comment Reply Table

- id VarChar(255)
- userId VarChar(255)
- commentId VarChar(255)
- content VarChar(255)
- createdAt DateTime
- updatedAt DateTime

### Comment Like Table

- id VarChar(255)
- userId VarChar(255)
- commentId VarChar(255)
- createdAt DateTime
- updatedAt DateTime

### User Follower Table

- id VarChar(255)
- userId VarChar(255)
- followerId VarChar(255)
- createdAt DateTime
- updatedAt DateTime

### User Following Table

- id VarChar(255)
- userId VarChar(255)
- followingId VarChar(255)
- createdAt DateTime
- updatedAt DateTime
