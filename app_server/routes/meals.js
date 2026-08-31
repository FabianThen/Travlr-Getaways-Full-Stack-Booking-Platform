const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/meals');

router.get('/', mealsController.meals);

module.exports = router;