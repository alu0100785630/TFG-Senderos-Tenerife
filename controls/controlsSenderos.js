const Sendero = require('./../schema/sendero');

exports.allSenderos = async(req, res) => {
  try {

    const senderos = await Sendero.find();

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

exports.singleSendero = async(req, res) => {
  try {
    const sendero = await Sendero.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        sendero
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createSendero = async(req, res) => {
  try {
    const newSendero = await Sendero.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        sendero: newSendero
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateSendero = async(req, res) => {
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
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteSendero = async(req, res) => {
  try {
    await Sendero.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};