const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less than or equal to 40 characters'],
      minlength: [10, 'A tour name must have more than or equal to 10 characters'],
      validate: [validator.isAlpha, 'tour name must only contain characters']
    },
    slug: String,
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must be at most 5.0'],
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be either: easy, medium, or hard',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual properties are fields defined on the schema but not persisted in MongoDB.
// We use a regular function here (not an arrow function) so that 'this' refers to the document.
tourSchema.virtual('newprice').get(function () {
  return this.price / 100;
});

tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true })
})

tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } })
})

tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
