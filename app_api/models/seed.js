const mongoose = require('mongoose');
const Trip = require('./travlr');
const fs = require('fs');

// Read trips data from JSON file
const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

// Connect to MongoDB
const dbURI = 'mongodb://127.0.0.1/travlr';
mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
    // Delete existing records and insert new ones
    Trip.deleteMany({})
        .then(() => {
            return Trip.insertMany(trips);
        })
        .then(() => {
            console.log('Database seeded successfully!');
            mongoose.connection.close();
        })
        .catch(err => {
            console.log('Error seeding database: ', err);
            mongoose.connection.close();
        });
});