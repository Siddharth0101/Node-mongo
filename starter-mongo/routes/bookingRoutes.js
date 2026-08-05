const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// All booking routes are protected
router.use(authController.protect);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.createBooking,
  );

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.updateBooking,
  )
  .delete(
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.deleteBooking,
  );

module.exports = router;
