var fs = require('fs');

const travel = (req, res) => {
    var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));
    res.render('travel', { trips: trips });
};

module.exports = { travel };