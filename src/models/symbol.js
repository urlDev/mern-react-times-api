const mongoose = require("mongoose");

const symbolSchema = new mongoose.Schema({
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
    ref: "User",
  },
});

// I needed symbol schema/get endpoint to only send me symbol
// thats why I am deleting the rest from the response
// or to be able to scale it later like this
symbolSchema.methods.toJSON = function () {
  const symbol = this;

  const symbolObject = symbol.toObject();

  return symbolObject;
};

const Symbol = mongoose.model("Symbol", symbolSchema);

module.exports = Symbol;
