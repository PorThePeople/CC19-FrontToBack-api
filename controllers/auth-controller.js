const createError = require('../utils/createError');
const prisma = require('../configs/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    // 1. req.body
    const { email, firstname, lastname, password, confirmPassword } = req.body;
    console.log(email, firstname, lastname, password, confirmPassword);
    // 2. validate
    // 3. check if exist
    const checkEmail = await prisma.profile.findFirst({
      where: {
        email: email,
      },
    });
    console.log(checkEmail);
    if (checkEmail) {
      return createError(400, 'Email is already in used');
    }
    // 4. encrypt with Bcrypt
    const salt = bcrypt.genSaltSync(10);
    console.log(salt);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // 5. insert to database
    const profile = await prisma.profile.create({
      data: {
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: hashedPassword,
      },
    });
    // 6. response
    res.json({ message: 'Register successful' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const profile = await prisma.profile.findFirst({
      where: {
        email: email,
      },
    });
    if (!profile) {
      return createError(400, 'Email or Password is Invalid');
    }

    const isMatch = bcrypt.compareSync(password, profile.password);
    if (!isMatch) {
      return createError(400, 'Email or Password is Invalid');
    }

    const payload = {
      id: profile.id,
      email: profile.email,
      firstname: profile.firstname,
      lastname: profile.lastname,
      role: profile.role,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login successful', payload: payload, token: token });
  } catch (error) {
    next(error);
  }
};

exports.currentUser = async (req, res, next) => {
  try {
    res.json({ message: 'Hello, Current User!' });
  } catch (error) {
    next(error);
  }
};
