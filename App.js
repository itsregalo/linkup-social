const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

app.use(express.json()); // for parsing application/json
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));