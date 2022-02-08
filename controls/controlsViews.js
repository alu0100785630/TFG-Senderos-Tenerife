const Sendero = require('../schema/sendero');
const Usuario = require('../schema/usuario');
const Review = require('../schema/review');

exports.allOverview = async(req, res, next) => {
  try {

    const senderos = await Sendero.find();

    res.status(200).render('overview', {
      title: 'Senderos',
      //Le pasamos los senderos como dato a renderizar
      senderos: senderos
    });

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.senderoOverview = async(req, res, next) => {
  try {

    const sendero = await Sendero.findOne({ slug: req.params.slug }).populate({
      //Para acceder a las reviews
      path: 'reviews',
      //No necesitamos todos los fields así que solo especificamos los que queremos.
      fields: 'rating review usuario'
    });
    
    // Review.schema.statics.calcAverageGrades(sendero._id, Review);

    // if ((!sendero.reviews || sendero.reviews.length == 0) && (sendero.gradeAverage != 0 && sendero.gradeQuantity != 0)) {
    //   await Sendero.findOneAndUpdate( {_id: sendero._id}, {$set : {gradeAverage: 0, gradeQuantity: 0}} );
    // }

    if (!sendero) {
      throw new Error('No existe un sendero con ese nombre');
    }

    res.status(200).render('sendero', {
      title: sendero.name,
      //Le pasamos los senderos como dato a renderizar
      sendero
    });

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.userLogin = async(req, res, next) => {
  try {
    res.status(200).render('login', {
      title: 'Log In'
    })

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};


exports.registerUser = async(req, res, next) => {
  try {
    res.status(200).render('register', {
      title: 'Registro'
    })

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createSenderoAdmin = async(req, res, next) => {
  try {
    res.status(200).render('create', {
      title: 'Crear Sendero'
    })

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};