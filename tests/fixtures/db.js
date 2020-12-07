const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Symbol = require('../../src/models/symbol');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'John',
    email: 'john@example.com',
    password: 'abc123!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    }, ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Jess',
    email: 'jess@example.com',
    password: '123abc!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    }, ],
};

const symbolOne = {
    _id: new mongoose.Types.ObjectId(),
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 123.4,
    owner: userOne._id,
};

const symbolTwo = {
    _id: new mongoose.Types.ObjectId(),
    symbol: 'TSLA',
    name: 'Tesla Motors',
    price: 450,
    owner: userOne._id,
};

const symbolThree = {
    _id: new mongoose.Types.ObjectId(),
    symbol: 'GOOG',
    name: 'Alphabet Inc',
    price: 280,
    owner: userTwo._id,
};

const setupDb = async() => {
    await User.deleteMany();
    await Symbol.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Symbol(symbolOne).save();
    await new Symbol(symbolTwo).save();
    await new Symbol(symbolThree).save();
};

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    symbolOne,
    symbolTwo,
    symbolThree,
    setupDb,
};