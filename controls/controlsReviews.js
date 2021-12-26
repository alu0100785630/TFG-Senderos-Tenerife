const Review = require('./../schema/review');

exports.allReviews = async(req, res) => {
  try {

    //Comprobamos si hay un id en los parámetros. Si lo hay solo accedemos a las reviews de ese sendero.
    //Creamos un objeto filter para usar en la query find()

    let filter = {};
    if (req.params.senderoId) filter = { sendero : req.params.senderoId };

    
    const reviews = await Review.find(filter);

    res.status(200).json({
      status: 'success',
      amount: reviews.length,
      data: {
        reviews
      }
    });
  } 
  catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.crearReview = async(req, res) => {
  try {
    const newReview = await Review.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        review: newReview
      }
    });
  } 
  catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};