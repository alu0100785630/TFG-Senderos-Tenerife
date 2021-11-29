const express = require('express');
const controlsSenderos = require('./../controls/controlsSenderos');
const auth = require('./../controls/controlsAutenticacion');

const router = express.Router();

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
  .patch(controlsSenderos.updateSendero)
  .delete(controlsSenderos.deleteSendero);

module.exports = router;
