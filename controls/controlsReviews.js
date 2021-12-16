const Review = require('./../schema/review');

exports.allReviews = async(req, res) => {
  try {
    const reviews = await Review.find();

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