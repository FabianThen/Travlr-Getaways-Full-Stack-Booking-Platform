const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/rooms');

router.get('/', roomsController.rooms);

module.exports = router;