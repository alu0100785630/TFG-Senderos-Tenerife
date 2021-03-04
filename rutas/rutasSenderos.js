const express = require('express');
const controlsSenderos = require('./../controls/controlsSenderos');

const router = express.Router();

router
  .route('/')
  .get(controlsSenderos.allSenderos)
  .post(controlsSenderos.createSendero);

router
  .route('/:id')
  .get(controlsSenderos.singleSendero)
  .patch(controlsSenderos.updateSendero)
  .delete(controlsSenderos.deleteSendero);

module.exports = router;
