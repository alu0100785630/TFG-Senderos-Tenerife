const express = require('express');
const controlsSenderos = require('./../controls/controlsSenderos');
const controlsReviews = require('./../controls/controlsReviews');
const auth = require('./../controls/controlsAutenticacion');
const rutasReviews = require('./../rutas/rutasReviews');

const router = express.Router();


// POST /sendero/id-sendero/reviews
// GET  /sendero/id-sendero/reviews

//Le decimos que este router use el reviewRouter si alguna vez se encuentra con una ruta así:
//Es parecido a lo que hacemos con nuestro app.js => app.use('/api/reviews', rutasReviews);
router.use('/:senderoId/reviews', rutasReviews);

router
  .route('/')
  .get(controlsSenderos.allSenderos)
  .post(
    auth.protect,
    auth.restrict('admin', 'guia'),
    controlsSenderos.createSendero
  );

router
  .route('/:id')
  .get(controlsSenderos.singleSendero)
  .patch(
    auth.protect,
    auth.restrict('admin'),
    controlsSenderos.updateSendero
  )
  .delete(
    auth.protect,
    auth.restrict('admin'),
    controlsSenderos.deleteSendero
  );

router
  .route('/:senderoId/reviews')
  .post(
    auth.protect,
    auth.restrict('usuario'),
    controlsReviews.crearReview
  );

module.exports = router;
