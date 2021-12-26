const express = require('express');
const controlsReviews = require('./../controls/controlsReviews');
const auth = require('./../controls/controlsAutenticacion');

//Esto es porque cada router solo tiene acceso a los parámetros de su ruta específica.
const router = express.Router({ mergeParams : true });

//Gracias a mergeParams no importa que ruta tengamos:
// POST /sendero/sendero-id/reviews
// POST /reviews
//Acabará en este handler

router
  .route('/')
  .get(controlsReviews.allReviews)
  .post(
    auth.protect,
    auth.restrict('usuario'),
    controlsReviews.crearReview
  );

module.exports = router;