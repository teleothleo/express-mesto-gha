const Card = require('../models/card');

const { ERROR_CODE, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  console.log(req.body);
  Card.find({})
    .then((cards) => {
      console.log(cards);
      res.send(cards);
    })
    .catch(() => {
      res.status(ERROR_CODE_SERVER).send({ message: 'Server-side error' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(name, link);
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Incorrect data passed' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Server-side error' });
      }
    });
};

module.exports.deleteCard = (req, res) => Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card not found' });
      return;
    }
    card.remove().then(() => res.send({ message: 'Card was deleted successfully' }));
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Incorrect card ID' });
    } else {
      res.status(ERROR_CODE_SERVER).send({ message: 'Server-side error' });
    }
  });

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card not found' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Incorrect card ID' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Server-side error' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card not found' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Incorrect card ID' });
      } else {
        res.status(ERROR_CODE_SERVER).send({ message: 'Server-side error' });
      }
    });
};
