const express = require('express');
const controlsUsuarios = require('./../controls/controlsUsuarios');
const auth = require('./../controls/controlsAutenticacion');

const router = express.Router();

router.get('/',     
  auth.protect,
  auth.restrict('admin'),
  controlsUsuarios.allUsuarios
);

router.post('/registro', auth.registro);
router.post('/login', auth.login);

router.patch('/update-user', auth.protect, controlsUsuarios.updateUser);
router.delete('/delete-user', auth.protect, controlsUsuarios.deleteUser);

router.get('/perfil', auth.protect, controlsUsuarios.perfilUsuario );

router.get('/logout', auth.logOut);

module.exports = router;