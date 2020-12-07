const express = require('express');
const userRouter = require('./routes/user');
const symbolRouter = require('./routes/symbol');
const avatarsMiddleware = require('adorable-avatars');
const cors = require('cors');
require('./db/mongoose');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/myAvatar', avatarsMiddleware);
app.use(userRouter);
app.use(symbolRouter);

module.exports = app;