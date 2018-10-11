# NodeJS_AuthenticationAPI

1) run command 
      npm install

2) run command by replacinh 'your_jwt_secret_key' with your own 'key'
      export env_jwtPrivateKey=your_jwt_secret_key

3) API end-points

    a) POST /users/create

        req body = {
                    "name" : "TestName1-edit",
                    "email" : "a@b.com",
                    "password": "password123"
                  }

    b) POST /auth/login

        req body = {
                    "email" : "a@b.com",
                    "password": "password123"
                  }

        The response header will contain the `jwt token`, we need to send this token in below 'reset' and 'forgot' api.

    c) PUT /users/reset

        req body = {
                    "name" : "TestName1-edit",
                    "email" : "a@b.com",
                    "password": "password123"
                  }

        here `key` will be email id ->>> data will updated for the given email-id

    d) DELETE users/forgot

        req body = {
                    "email" : "a@b.com"
                  }
                  
        here `key` will be email id ->>> the given email-id data will get deleted.

4) run the test files as
      a) npm test integration/auth.test.js
      b) npm test integration/users.test.js
      c) npm test /unit/models/users.test.js