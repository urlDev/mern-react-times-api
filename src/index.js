const express = require('express');
const userRouter = require('./routes/user');
const symbolRouter = require('./routes/symbol');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(symbolRouter);

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});