const express = require('express');
const controlsUsuarios = require('./../controls/controlsUsuarios');
const auth = require('./../controls/controlsAutenticacion');

const router = express.Router();

router.post('/registro', auth.registro);
router.post('/login', auth.login);

router.patch('/update-user', auth.protect, controlsUsuarios.updateUser);

module.exports = router;