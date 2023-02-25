const router = require('express').Router();

const { ERROR_CODE_NOT_FOUND } = require('../utils/constants');

router.use((req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'No page here' });
});

module.exports = router;
