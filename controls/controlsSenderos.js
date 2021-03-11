const Sendero = require('./../schema/sendero');
const APIOperations = require('./../api/apiOperations');

exports.allSenderos = async(req, res) => {
  try {

    //El encadenamieno funciona ya que estamos retornando this en las funciones de la API.
    const operations = new APIOperations(Sendero.find(), req.query).filtrar().ordenar().seleccionarCampos();
    
    //Ahora senderos serán los resultados filtrados
    const senderos = await operations.query;

    res.status(200).json({
      status: 'success',
      amount: senderos.length,
      data: {
        senderos
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.singleSendero = async(req, res, next) => {
  try {
    const sendero = await Sendero.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        sendero
      }
    });
  } catch (err) {
    err.message = `No se encuentra un sendero con ese ID.`;
    err.status = 'fail';
    err.statusCode = 404;
    //Lo manda a nuestro controlador de errores globales gracias a next (globalErrorControl).
    return next(err);
  }
};

exports.createSendero = async(req, res, next) => {
  try {
    const newSendero = await Sendero.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        sendero: newSendero
      }
    });
  } catch (err) {
    err.message = `Bad request! Error en el lado del cliente.`;
    err.status = 'fail';
    err.statusCode = 400;
    return next(err);
  }
};

exports.updateSendero = async(req, res, next) => {
  try {
    //Buscamos el documento a actualizar y luego actualizarlo
    const sendero = await Sendero.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      //Que se hagan las validaciones del schema
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        sendero
      }
    });
  } catch (err) {
    err.message = `No se encuentra un sendero con ese ID.`;
    err.status = 'fail';
    err.statusCode = 404;
    return next(err);
  } (globalErrorControl)
};

exports.deleteSendero = async(req, res, next) => {
  try {
    await Sendero.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    err.message = `No se encuentra un sendero con ese ID.`;
    err.status = 'fail';
    err.statusCode = 404;
    return next(err);
  }
};
