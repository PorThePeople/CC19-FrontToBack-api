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

##
