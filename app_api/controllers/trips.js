const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

// GET: /api/trips - returns all trips
const tripsList = async (req, res) => {
    Trip
        .find({})
        .exec()
        .then(trips => {
            if (!trips) {
                return res.status(404).json({ message: 'No trips found' });
            }
            if (!Array.isArray(trips) || trips.length === 0) {
                return res.status(404).json({ message: 'No trips found' });
            }
            return res.status(200).json(trips);
        })
        .catch(err => res.status(500).json(err));
};

// GET: /api/trips/:tripCode - returns a single trip
const tripsOne = async (req, res) => {
    Trip
        .find({ 'code': req.params.tripCode })
        .exec()
        .then(trip => {
            if (!trip) {
                return res.status(404).json({ message: 'Trip not found' });
            }
            return res.status(200).json(trip);
        })
        .catch(err => res.status(500).json(err));
};

module.exports = { tripsList, tripsOne };