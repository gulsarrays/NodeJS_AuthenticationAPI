/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const { userModel: User } = require('../../models/user');

let appServer;

describe('/users', () => {
  beforeEach(() => {
    appServer = require('../../app');
  });
  afterEach(async () => {
    await User.remove({});
  });

  describe('POST /create', () => {
    const addUser = {
      name: 'TestName1',
      email: 'a@b.com',
      password: 'password1'
    };
    const exec = async userData => {
      return await request(appServer)
        .post('/users/create')
        .send(userData);
    };

    it('should return 400 if invalid input', async () => {
      const user = {
        name: 'TestName1',
        email: 'a@b.com'
      };

      const res = await exec(user);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*password.*/);
    });

    it('should return 400 if name is less than 5 char', async () => {
      const user = {
        name: 'Test',
        email: 'a@b.com',
        password: 'password1'
      };

      const res = await exec(user);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*name.*/);
    });

    it('should return 400 if name is greater than 55 char', async () => {
      const longString = new Array(57).join('a');
      const user = {
        name: longString,
        email: 'a@b.com',
        password: 'password1'
      };

      const res = await exec(user);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*name.*/);
    });

    it('should return 201 if valid input', async () => {
      const res = await exec(addUser);

      expect(res.status).toBe(201);

      expect(res.body).toHaveProperty('email', 'a@b.com');
    });

    it('should return 400 if duplicate email', async () => {
      const result = await exec(addUser);
      const res = await exec(addUser);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*already registered.*/);
    });
  });

  describe('PUT /reset', () => {
    let token;
    let newName;
    let emailId;
    let user;

    const exec = async () => {
      return await request(appServer)
        .put('/users/reset')
        .set('x-auth-token', token)
        .send({
          name: newName,
          email: emailId,
          password: 'password1'
        });
    };

    beforeEach(async () => {
      // Before each test we need to create a user and
      // put it in the database.
      user = new User({
        name: 'TestName1',
        email: 'a@b.com',
        password: 'password1'
      });
      await user.save();

      token = new User().generateAuthToken();
      newName = 'updatedName';
      emailId = 'a@b.com';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if name is less than 5 characters', async () => {
      newName = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than 55 characters', async () => {
      newName = new Array(57).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is invalid', async () => {
      emailId = 'emailid';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if user with the given id was not found', async () => {
      emailId = 'aa@b.com';

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should update the user if input is valid', async () => {
      await exec();

      const updatedUser = await User.findOne({ email: user.email });

      expect(updatedUser.name).toBe(newName);
    });

    it('should return the updated user if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', newName);
    });
  });

  describe('DELETE /forgot', () => {
    let token;
    let user;
    let emailId;

    const exec = async () => {
      return await request(appServer)
        .delete('/users/forgot')
        .set('x-auth-token', token)
        .send({ email: emailId });
    };

    beforeEach(async () => {
      // Before each test we need to create a user and
      // put it in the database.
      user = new User({
        name: 'TestName1',
        email: 'a@b.com',
        password: 'password1'
      });
      await user.save();

      token = new User().generateAuthToken();
      emailId = user.email;
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 404 if email is invalid', async () => {
      emailId = 'emailid';

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no user with the given email was found', async () => {
      emailId = 'aa@b.com';

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the user if input is valid', async () => {
      await exec();

      const userInDb = await User.findOne({ email: 'a@b.com' });

      expect(userInDb).toBeNull();
    });

    it('should return the removed user', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name', user.name);
    });
  });
});
