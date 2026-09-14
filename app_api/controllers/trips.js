const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

/**
 * Maps the fields Travlr accepts on a trip out of the incoming request body.
 * Centralized here so create and update can never drift out of sync with
 * each other, which was a real duplication bug in the original controller.
 */
const buildTripFromBody = (body) => ({
    code: body.code,
    name: body.name,
    length: body.length,
    start: body.start,
    resort: body.resort,
    perPerson: body.perPerson,
    image: body.image,
    description: body.description
});

/**
 * Validates the fields required to create or update a trip.
 * Returns an array of human-readable error messages; an empty array
 * means the payload is valid.
 */
const validateTripBody = (body) => {
    const errors = [];

    if (!body.code || typeof body.code !== 'string' || body.code.trim() === '') {
        errors.push('code is required and must be a non-empty string');
    }
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
        errors.push('name is required and must be a non-empty string');
    }
    if (body.length === undefined || isNaN(Number(body.length)) || Number(body.length) <= 0) {
        errors.push('length is required and must be a positive number');
    }
    if (!body.start) {
        errors.push('start date is required');
    }
    if (!body.resort || typeof body.resort !== 'string' || body.resort.trim() === '') {
        errors.push('resort is required and must be a non-empty string');
    }
    if (body.perPerson === undefined || isNaN(Number(body.perPerson)) || Number(body.perPerson) < 0) {
        errors.push('perPerson is required and must be a non-negative number');
    }

    return errors;
};

/**
 * Sends a sanitized 500 response instead of leaking a raw driver/DB error
 * object (which can expose schema names, stack traces, or internal paths)
 * back to the client. The real error is still logged server-side for
 * debugging.
 */
const handleServerError = (res, context, err) => {
    console.error(`[trips.js] ${context}:`, err);
    return res.status(500).json({ message: 'An unexpected server error occurred. Please try again later.' });
};

const tripsList = async (req, res) => {
    try {
        const trips = await Trip.find({}).exec();
        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: 'No trips found' });
        }
        return res.status(200).json(trips);
    } catch (err) {
        return handleServerError(res, 'tripsList failed', err);
    }
};

const tripsOne = async (req, res) => {
    try {
        const trip = await Trip.findOne({ code: req.params.tripCode }).exec();
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(200).json(trip);
    } catch (err) {
        return handleServerError(res, 'tripsOne failed', err);
    }
};

const tripsAddTrip = async (req, res) => {
    try {
        const validationErrors = validateTripBody(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        }

        const trip = await Trip.create(buildTripFromBody(req.body));
        return res.status(201).json(trip);
    } catch (err) {
        return handleServerError(res, 'tripsAddTrip failed', err);
    }
};

const tripsUpdateTrip = async (req, res) => {
    try {
        const validationErrors = validateTripBody(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        }

        const updatedTrip = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            buildTripFromBody(req.body),
            { new: true } // return the updated document, not the pre-update one
        ).exec();

        if (!updatedTrip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        // 200, not 201: 201 means "created", and this is an update to an
        // existing resource.
        return res.status(200).json(updatedTrip);
    } catch (err) {
        return handleServerError(res, 'tripsUpdateTrip failed', err);
    }
};

const tripsDeleteTrip = async (req, res) => {
    try {
        const deletedTrip = await Trip.findOneAndDelete({ code: req.params.tripCode }).exec();
        if (!deletedTrip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (err) {
        return handleServerError(res, 'tripsDeleteTrip failed', err);
    }
};

module.exports = { tripsList, tripsOne, tripsAddTrip, tripsUpdateTrip, tripsDeleteTrip };
