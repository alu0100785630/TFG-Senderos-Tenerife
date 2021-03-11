const Usuario = require('./../schema/usuario');

exports.registro = async(req, res, next) => {
  try {
    const newUsuario = await Usuario.create(req.body);

    res.status(201).json({
      status: 'success',
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