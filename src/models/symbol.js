const mongoose = require('mongoose');

const Symbol = mongoose.model('Symbol', {
    symbol: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
});

module.exports = Symbol;