const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./api/Routes/routes');

require('dotenv').config();

const app = express();

app.use(express.json()); // for parsing application/json
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});