const bcrypt = require('bcrypt');
const { User } = require('../models/user.js');

const AuthController = {};

AuthController.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.details(email);
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();

  const message = `Welcome ${user.name}
  
  you have signed-in successfully. Plese use the 
  `;
  return res.header('x-auth-token', token).send(message);
};

module.exports = AuthController;
