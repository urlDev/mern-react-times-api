const mongoose = require('mongoose');

const Symbol = mongoose.model('Symbol', {
    symbol: {
        type: Array,
        required: true,
    },
    owner: {
        // Setting up an owner for each symbols,
        // And the owners type will be their objectId
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // User models name for
        // Binding this and User model
        ref: 'User',
    },
});

module.exports = Symbol;