const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }
    let headers = authHeader.split(' ');
    if (headers.length < 1) {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(501);
    }
    const token = authHeader.split(' ')[1];
    if (token == null) {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            return res.sendStatus(401);
        }
        req.auth = verified;
    });
    next();
}

router.get('/trips', tripsController.tripsList);
router.get('/trips/:tripCode', tripsController.tripsOne);
router.post('/trips', authenticateJWT, tripsController.tripsAddTrip);
router.put('/trips/:tripCode', authenticateJWT, tripsController.tripsUpdateTrip);
router.delete('/trips/:tripCode', authenticateJWT, tripsController.tripsDeleteTrip);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;