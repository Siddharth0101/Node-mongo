const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
