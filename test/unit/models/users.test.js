/* eslint-disable */
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const { userModel: User } = require('../../../models/user');

describe('user.generateAuthToken', () => {
  it('should provide a valid jwt', () => {
    const payLoad = {
      _id: new mongoose.Types.ObjectId().toHexString()
    };
    const user = new User(payLoad);
    console.log(user);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(payLoad);
  });
});
