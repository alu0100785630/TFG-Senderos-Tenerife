const express = require('express');
const controlsReviews = require('./../controls/controlsReviews');
const auth = require('./../controls/controlsAutenticacion');

const router = express.Router();

router
  .route('/')
  .get(controlsReviews.allReviews)
  .post(
    auth.protect,
    auth.restrict('usuario'),
    controlsReviews.crearReview
  );

module.exports = router;