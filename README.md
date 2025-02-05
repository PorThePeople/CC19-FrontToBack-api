# Server

```bash
npm init -y
```

---

```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod primsa
```

---

Create a top-level index.js file, import express, create an express instance, open server

```js
// index.js
const express = require('express');
const app = express();

const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
```

---

Create script then call `npm start` in CLI to start the server

```js
// package.json
  "scripts": {
    "start": "nodemon index.js"
  },
```

---

Import installed libraries and use pre-built middlewares

```js
// index.js
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
```

---

Create a top-level folder called routes, create a file for 1 specific route

```js
// routes/auth-route.js
const express = require('express');
const router = express.Router();

// @ENDPOINT http://localhost:8000/api/register
router.post('/register', () => {});

module.exports = router;
```

---

Create a top-level folder called controllers, create a file for 1 set of controller, 1 set of controller for 1 route

```js
// controllers/auth-controller.js
exports.register = (req, res, next) => {
  try {
    res.json({ message: 'Register successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server errors' });
  }
};
```

Import the controller to its route file and use the controller

```js
// routes/auth-route.js
const authController = require('../controllers/auth-controller');

// @ENDPOINT http://localhost:8000/api/register
router.post('/register', authControllers.register);
```

---

Import the router into and map it to its path

```js
// server.js
const authRouter = require('./routes/auth-route');

app.use('/api', authRouter);
```

---

Create a top-level folder called middlewares, then create a file for each individual middleware

```js
// middlewares/error.js
const handleErrors = (err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || 'Server Error!' });
};

module.exports = handleErrors;
```

Import and use the error middleware

```js
// server.js
const handleErrors = require('./middlewares/error');

app.use(handleErrors);
```

Re-config controllers (if error handling is hardcoded)

```js
// controllers/auth-controller.js
exports.register = (req, res, next) => {
  try {
    res.json({ message: 'Register successful' });
  } catch (error) {
    next(error);
  }
};
```

---

Create a top-level folder called utils, then create a file for each function

```js
// utils/createError.js
const createError = (code, message) => {
  const error = new Error(message);
  error.statusCode = code;
  throw error;
};

module.exports = createError;
```

Import and use where necessary

```js
// controllers/auth-controller.js
const createError = require('../utils/createError');

exports.register = (req, res, next) => {
  try {
    const { email, firstname, lastname, password, confirmPassword } = req.body;
    if (!email) {
      return createError(400, 'Email is required'); // used here
    }
    if (!firstname) {
      return createError(400, 'Firstname is required'); // used here
    }
    res.json({ message: 'Register successful' });
  } catch (error) {
    next(error);
  }
};
```

## Validate with Zod

Import zod and build a test schema

```js
// middlewares/validators.js
const { z } = require('zod');

exports.registerSchema = z
  .object({
    email: z.string().email('Email invalid format'),
    firstname: z.string().min(3, 'Firstname must be longer than 3 characters'),
    lastname: z.string().min(3, 'Lastname must be longer than 3 characters'),
    password: z.string().min(6, 'Password must be longer than 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be longer than 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password mismatch',
    path: ['confirmPassword'],
  });

exports.loginSchema = z.object({
  email: z.string().email('Email invalid format'),
  password: z.string().min(6, 'Password must be longer than 6 characters'),
});
```

Write a validator function that accepts a schema as an argument

```js
// middlewares/validators.js
exports.validateWithZod = (schema) => (req, res, next) => {
  try {
    console.log('Middleware: ValidateWithZod');
    schema.parse(req.body);
    next();
  } catch (error) {
    const errMsg = error.errors.map((item) => item.message);
    const errTxt = errMsg.join(', ');
    const mergeError = new Error(errTxt);
    next(mergeError);
  }
};
```

Use the validate function in the appropriate routes

```js
// routes/auth-route.js
router.post(
  '/register',
  validateWithZod(registerSchema),
  authControllers.register
);
```

## Prisma

Setting up prisma: add DATABASE_URL in .env

```js
// .env
DATABASE_URL = 'mysql://USER:PASSWORD@HOST:PORT/DATABASE';
```

and change provider in prisma.schema file to "mysql"

```js
// prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

---

Model tables then push to the database (pick one)

```bash
npx prisma db push
npx prisma migrate dev --name migration_name
```

`prisma migrate` generates migration data while `prisma db push` does not

---

Create a top-level folder called configs, and create a prisma.js file

```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
```

## Bcryptjs

Import Bcryptjs and use its methods

```js
// controllers/auth-controller.js
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);
```

No need to separately generate salt, can do `bcrypt.hashSync(password, 10)

Comparing entered password and hashed password stored in a database

```js
// controllers/auth-controller.js
const isMatch = bcrypt.compareSync(password, profile.password);
```

## JSONWebtoken

Import library

```js
// controllers/auth-controller.js
const jwt = require('jsonwebtoken');
```

Once data is validate, create a payload object consisting of all the requied info

```js
// controllers/auth-controller.js
const payload = {
  id: profile.id,
  email: profile.email,
  firstname: profile.firstname,
  lastname: profile.lastname,
  role: profile.role,
};
```

Create a token with the payload, a secret key, and the expiry date

```js
// controllers/auth-controller.js
const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });
```

Attach the token with the outgoing response

```js
// controllers/auth-controller.js
res.json({ message: 'Login successful', token: token });
```
