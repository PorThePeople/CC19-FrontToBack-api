exports.register = (req, res, next) => {
  try {
    res.json({ message: 'Register successful' });
  } catch (error) {
    next(error);
  }
};

exports.login = (req, res, next) => {
  try {
    res.json({ message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};
