//Al especificar 4 parámetros Express sabe que se trata de un middleware para manejar errores
module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  //Leemos el status del objeto error
  //El status code será igual al status code (si existe) o 500
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  //Enviamos la respuesta
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};