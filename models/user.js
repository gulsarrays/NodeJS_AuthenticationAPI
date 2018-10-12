const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 55,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 55,
    required: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true
  }
});

/* eslint-disable */
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
};
/* eslint-enable */

const UserModel = mongoose.model('Users', userSchema);

const User = {};

async function passwordHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  return hashedPass;
}

User.create = async (name, email, password) => {
  const hashedPass = await passwordHash(password);
  let user = new UserModel({ name, email, password: hashedPass });
  user = await user.save();
  return user;
};

User.details = async email => {
  const user = UserModel.findOne({ email });
  return user;
};

User.reset = async (name, email, password) => {
  const hashedPass = await passwordHash(password);
  const user = await UserModel.findOneAndUpdate(
    { email },
    { name, password: hashedPass },
    { new: true }
  );
  return user;
};

User.forgot = async email => {
  const user = await UserModel.findOneAndRemove({ email });
  return user;
};

function validation(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(55)
      .required(),
    email: Joi.string()
      .min(5)
      .max(55)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(55)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.userModel = UserModel;
module.exports.validation = validation;
module.exports.passwordHash = passwordHash;
