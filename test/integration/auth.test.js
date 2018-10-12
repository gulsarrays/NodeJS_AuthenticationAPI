/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const { userModel: User, passwordHash } = require('../../models/user');

describe('auth middelware', () => {
  let token;

  beforeEach(() => {
    appServer = require('../../app');
  });

  afterEach(async () => {
    await User.remove({});
  });

  let emailId;
  let userpass;

  const exec = async () => {
    return await request(appServer)
      .post('/auth/login')
      .send({
        email: emailId,
        password: userpass
      });
  };

  beforeEach(async () => {
    // Before each test we need to create a user and
    // put it in the database.
    const passHash = await passwordHash('password1');
    user = new User({
      name: 'TestName1',
      email: 'a@b.com',
      password: passHash
    });
    await user.save();

    emailId = 'a@b.com';
    userpass = 'password1';
  });

  it('should return 400 if wrong email provided', async () => {
    emailId = 'aa@b.com';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if wrong password provided', async () => {
    userpass = 'password11';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if input is correct', async () => {
    emailId = 'a@b.com';
    userpass = 'password1';
    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.text).toContain('TestName1');
  });

  it('should show the correct welcome message', async () => {
    emailId = 'a@b.com';
    userpass = 'password1';
    const res = await exec();

    expect(res.text).toContain('TestName1');
  });
});
