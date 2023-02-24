const router = require('express').Router();

router.use((req, res) => {
  res.status(404).send({ message: 'No page here' });
});

module.exports = router;
