const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/react-times', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cant be password');
            }
        },
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        },
    },
});

const me = new User({
    name: 'Can',
    age: 33,
    email: '  can@example.com   ',
    password: '123abca',
});

me.save()
    .then((me) => {
        console.log(me);
    })
    .catch((err) => {
        console.log(err);
    });

const Symbol = mongoose.model('Symbol', {
    symbol: {
        type: String,
    },
    price: {
        type: Number,
    },
});

// const stock = new Symbol({
//     symbol: 'AAPL',
//     price: 113.4,
// });

// stock
//     .save()
//     .then(() => {
//         console.log(stock);
//     })
//     .catch((err) => {
//         console.log(err);
//     });