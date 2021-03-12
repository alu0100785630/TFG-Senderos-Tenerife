const Usuario = require('./../schema/usuario');

const jwt = require('jsonwebtoken');

exports.registro = async(req, res, next) => {
  try {
    //Con este código solo permitimos accesso a los datos que realmente necesitamos para crear un usuario.
    const newUsuario = await Usuario.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id: newUsuario._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({
      status: 'success',
      token,
      data: {
        usuario: newUsuario
      }
    });
  } catch (err) {
    err.message = `Bad request! Error en el lado del cliente.`;
    err.status = 'fail';
    err.statusCode = 400;
    return next(err);
  }
};


exports.login = async(req, res, next) => {
  try {

    //Leemos el email y la contraseña desde el body de la petición
    const { email, password } = req.body;
    
    const usuario = await Usuario.findOne({ email: email, password: password }).select('+password');

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({
      status: 'success',
      token,
      name: usuario.name
    });
  } catch (err) {
    err.message = `Email o contraseña incorrectos!`;
    err.status = 'fail';
    err.statusCode = 400;
    return next(err);
  }
};