// 1. List all users
// 2. Update roles
// 3. Delete users

exports.listUsers = async (req, res, next) => {
  try {
    res.json({ message: 'Listing all users...' });
  } catch (error) {
    next(error);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    res.json({ message: 'Updating user roles...' });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    res.json({ message: 'Deleting user...' });
  } catch (error) {
    next(error);
  }
};
