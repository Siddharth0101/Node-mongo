// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound index: each combination of tour and user must be unique
// This prevents duplicate reviews (one user can only review a tour once)
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// QUERY MIDDLEWARE
// Populate user data on any find query
reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
});

// STATIC METHOD to calculate average ratings for a tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // No reviews left — reset to defaults
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Call calcAverageRatings after a new review is saved
reviewSchema.post('save', function () {
  // this points to current review document
  // this.constructor points to the Model
  this.constructor.calcAverageRatings(this.tour);
});

// Calculate average ratings after findOneAndUpdate or findOneAndDelete
// NOTE (Jonas Course vs Modern Mongoose):
// In Jonas's course (Mongoose 5), he used a 2-step trick because post-hooks didn't have access to the document:
//   reviewSchema.pre(/^findOneAnd/, async function(next) { this.r = await this.findOne(); });
//   reviewSchema.post(/^findOneAnd/, async function() { await this.r.constructor.calcAverageRatings(this.r.tour); });
//
// In modern Mongoose (v6+ / v9), `post(/^findOneAnd/)` receives the updated/deleted `doc` directly as an argument:
reviewSchema.post(/^findOneAnd/, async function (doc) {
  // doc is the document that was found and updated/deleted
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
