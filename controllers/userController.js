const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validation } = require('../models/user.js');

const UserController = {};

UserController.create = async (req, res) => {
  const { name, email, password } = req.body;

  //input data validation
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user with email id already exists
  let user = await User.details(email);
  if (user)
    return res
      .status(400)
      .send('User with the same email-id is already registered.');

  user = await User.create(name, email, password);

  res.status(201).send(_.pick(user, ['name', 'email']));
};

UserController.reset = async (req, res) => {
  const { name, email, password } = req.body;

  //input data validation
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user with email id exists or not
  let user = await User.details(email);
  if (!user)
    return res.status(404).send('User with given email-id does not exists.');

  user = await User.reset(name, email, password);

  res.status(200).send(_.pick(user, ['name', 'email']));
};

UserController.forgot = async (req, res) => {
  const { email } = req.body;

  //check if user with email id exists or not
  let user = await User.details(email);
  if (!user)
    return res.status(404).send('User with given email-id does not exists.');

  user = await User.forgot(email);

  res.status(200).send(_.pick(user, ['name', 'email']));
};

module.exports = UserController;
