const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

const tripsList = async (req, res) => {
    Trip.find({}).exec()
        .then(trips => {
            if (!trips || trips.length === 0) {
                return res.status(404).json({ message: 'No trips found' });
            }
            return res.status(200).json(trips);
        })
        .catch(err => res.status(500).json(err));
};

const tripsOne = async (req, res) => {
    Trip.find({ 'code': req.params.tripCode }).exec()
        .then(trip => {
            if (!trip) {
                return res.status(404).json({ message: 'Trip not found' });
            }
            return res.status(200).json(trip);
        })
        .catch(err => res.status(500).json(err));
};

const tripsAddTrip = async (req, res) => {
    Trip.create({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    })
    .then(trip => {
        return res.status(201).json(trip);
    })
    .catch(err => res.status(500).json(err));
};

const tripsUpdateTrip = async (req, res) => {
    console.log(req.params);
    console.log(req.body);
    const q = await Trip
        .findOneAndUpdate(
            { 'code': req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            }
        ).exec();
    if (!q) {
        return res.status(400).json('error');
    } else {
        return res.status(201).json(q);
    }
};

module.exports = { tripsList, tripsOne, tripsAddTrip, tripsUpdateTrip };