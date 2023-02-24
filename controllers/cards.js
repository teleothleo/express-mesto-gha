const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  console.log(req.body);
  Card.find({})
    .then((cards) => {
      console.log(cards);
      res.send(cards);
    })
    .catch((err) => res.status(500).send({ name: err.name, message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(name, link);
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        res.status(500).send({ message: 'Server-side error' });
        return;
      }
      res.send(card);
    })
    .catch((err) => res.status(400).send({ name: err.name, message: err.message }));
};

module.exports.deleteCard = (req, res) => Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }
    card.remove().then(() => res.send({ message: 'Card was deleted successfully' }));
  })
  .catch((err) => {
    if (req.params.cardId.length !== 24) {
      res.status(400).send({ message: 'Incorrect card ID' });
    } else {
      res.status(500).send({ name: err.name, message: err.message });
    }
  });

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (req.params.cardId.length !== 24) {
        res.status(400).send({ message: 'Incorrect card ID' });
      } else {
        res.status(500).send({ name: err.name, message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (req.params.cardId.length !== 24) {
        res.status(400).send({ message: 'Incorrect card ID' });
      } else {
        res.status(500).send({ name: err.name, message: err.message });
      }
    });
};
