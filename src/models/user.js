const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Symbol = require("../models/symbol");

const userSchema = new mongoose.Schema({
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
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cant be password");
      }
    },
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar: {
    png: {
      type: Buffer,
    },
    webp: {
      type: Buffer,
    },
  },
});

// symbols name is what we gave just now
userSchema.virtual("symbols", {
  // Model name for symbol
  ref: "Symbol",
  // how the symbol is saved/related with,
  // with user _id
  localField: "_id",
  // tasks owner key
  foreignField: "owner",
});

// this will be added to individual user and convert the user to JSON,
// so we can manipulate it like below
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON_behavior
userSchema.methods.toJSON = function () {
  const user = this;
  // Converts user to an object
  // https://mongoosejs.com/docs/api.html#document_Document-toObject
  // toObject converts it to object but strips the extra mongooose adds to objects
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// methods is for individual user. A function that we add to an individual user
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = [...user.tokens, { token }];
  await user.save();

  return token;
};

// with statics, I am attaching a function to User model,
// to be able to use it in routes
// https://mongoosejs.com/docs/guide.html#statics
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// saving hashed password if its modified
// .isModified comes from mongoose
// https://mongoosejs.com/docs/api.html#document_Document-isModified
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Symbol.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
