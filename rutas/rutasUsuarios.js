const express = require('express');
const controlsAtutentticacion = require('./../controls/controlsAutenticacion');

const router = express.Router();

router.post('/registro', controlsAtutentticacion.registro);
router.post('/login', controlsAtutentticacion.login);

module.exports = router;