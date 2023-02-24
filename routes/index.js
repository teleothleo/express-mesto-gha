const router = require('express').Router();

const { showFalsePath } = require('../controllers/index');

router.get('/404', showFalsePath);

module.exports = router;
