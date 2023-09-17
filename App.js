const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./api/Routes/routes');
const authenticationRouter = require('./api/apps/Authentication/authenticationRouter');
const categoryRouter = require('./api/apps/Categories/CategoriesRouter');
const commentRouter = require('./api/apps/Comments/CommentsRouter');
const followersRouter = require('./api/apps/Followers/followersRouter');
const postsRouter = require('./api/apps/Posts/postsRouter');
const profileRouter = require('./api/apps/Profile/profileRouter');
const likesRouter = require('./api/apps/likes/likesRouter');

require('dotenv').config();

const app = express();

app.use(express.json()); // for parsing application/json
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

// auth
app.use('/api/auth', authenticationRouter);

// categories
app.use('/api/categories', categoryRouter);

//comments
app.use('/api/comments', commentRouter);

//follow following
app.use('/api/followers', followersRouter);

// posts
app.use('/api/posts', postsRouter);

//likes
app.use('/api/likes', likesRouter);

// user profile
app.use('/api/user', profileRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});