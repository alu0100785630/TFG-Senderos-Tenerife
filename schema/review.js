const mongoose = require('mongoose');
const Sendero = require('./sendero');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'No se puede dejar una valoración vacía.']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    publishedTime: {
      type: Date,
      default: Date.now()
    },
    sendero: {
      type: mongoose.Schema.ObjectId,
      ref: 'Sendero',
      required: [true, 'La review debe pertenecer a un sendero.']
    },
    usuario: {
      type: mongoose.Schema.ObjectId,
      ref: 'Usuario',
      required: [true, 'La review debe pertenecer a un usuario.']
    }
  },

  //Propiedades Virtuales
  //Cada vez que el output es un JSON o un objeto, muestra los virtuals.
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }

);


//Vamos a hacer “populating" automáticamente con las reviews con los datos del sendero y del usuario cada vez
//que haya una query a una review.
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    //Esta es la propiedad de este Schema, que está referenciada a su vez al Schema de Sendero
    path: 'usuario',
    //Seleccionamos los campos que nos interesan
    select: 'name'
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

//Exportamos
module.exports = Review;