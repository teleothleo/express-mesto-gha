module.exports.showFalsePath = (req, res) => {
  res.status(404).send({ message: 'No path here' });
};
