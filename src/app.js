const express = require('express');
const userRouter = require('./routes/user');
const symbolRouter = require('./routes/symbol');
require('./db/mongoose');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(symbolRouter);

module.exports = app;