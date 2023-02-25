const User = require('../models/user');

const { ERROR_CODE, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => res.status(ERROR_CODE_SERVER).send({ message: 'Server-side error' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      console.log(userId.length);
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'User not found' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Incorrect card ID' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Server-side error' });
      }
    });
};

module.exports.createUser = (req, res) => {
  console.log(req.body);
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Incorrect data passed' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Server-side error' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  console.log(req.body);
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Wrong user ID' });
        return;
      }
      console.log(user);
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Wrong keys or not all fiels are filled out' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Server-side error' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!avatar) {
        res
          .status(ERROR_CODE_NOT_FOUND)
          .send({ message: 'Wrong "avatar" key or "avatar" key is not filled out' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Wrong user ID' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Server-side error' });
      }
    });
};
