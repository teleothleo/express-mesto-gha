const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => res.status(500).send({ name: err.name, message: err.message }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(500).send({ message: 'Server-side error' });
      }
      res.send(user);
    })
    .catch((err) => {
      res.status(404).send({ name: err.name, message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  console.log(req.body);
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        res.status(500).send({ message: 'Server-side error' });
        return;
      }
      res.send(user);
    })
    .catch((err) => res.status(400).send({ name: err.name, message: err.message }));
};

module.exports.updateUser = (req, res) => {
  console.log(req.body);
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about, avatar })
    .then((user) => {
      if (!name || !about || !avatar) {
        res.status(400).send({ message: 'Wrong keys or not all fiels are filled out' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Wrong user ID' });
      } else {
        res.status(500).send({ name: err.name, message: err.message });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if (!avatar) {
        res
          .status(400)
          .send({ message: 'Wrong "avatar" key or "avatar" key is not filled out' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Wrong user ID' });
      } else {
        res.status(500).send({ name: err.name, message: err.message });
      }
    });
};
