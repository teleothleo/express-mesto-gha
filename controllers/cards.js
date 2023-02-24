const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  console.log(req.body);
  Card.find({})
    .then((cards) => {
      console.log(cards);
      res.send(cards);
    })
    .catch((err) => res.status(500).send({ ErrorName: err.name, message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(name, link);
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        res.status(500).send({ ErrorMessage: 'Server-side error' });
        return;
      }
      res.send(card);
    })
    .catch((err) => res.status(400).send({ ErrorName: err.name, message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  console.log(cardId);
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(500).send({ ErrorMessage: 'Server-side error' });
        return;
      }
      card.remove().then(() => res.send({ message: 'Card was deleted successfully' }));
    })
    .catch((err) => res.status(404).send({ ErrorName: err.name, message: err.message }));
};

module.exports.likeCard = (req, res) => {
  console.log(req.params.cardId);
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(() => {
      if (!req.user._id) {
        res.status(400).send({ message: 'Incorrect user data' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ ErrorName: err.name, message: err.message });
      } else {
        res.status(500).send({ ErrorName: err.name, message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  console.log(req.params.cardId);
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(() => {
      if (!req.user._id) {
        res.status(400).send({ message: 'Incorrect user data' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ ErrorName: err.name, message: err.message });
      } else {
        res.status(500).send({ ErrorName: err.name, message: err.message });
      }
    });
};
