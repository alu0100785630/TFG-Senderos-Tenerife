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
      min: 0,
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

//Para evitar duplicados
reviewSchema.index({ sendero: 1, usuario: 1 }, { unique: true });


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

//Escribiremos un método static en el Schema. De este modo podremos llamar a la función en el propio Model. Review.function()
reviewSchema.statics.calcAverageGrades = async function(senderoId) {
  //Es como una query normal pero se pueden manipular los datos siguiendo unos pasos.
  //Pasamos un array de "stages" => los docuemntos pasarán por estos stages uno a uno en la secuencia en la que los definamos

  const ratings = await this.aggregate([
    {
      //match es para filtrar o seleccionar ciertos documentos. Como un filter object
      $match : { sendero : senderoId}
    },
    {
      //group permite agrupar documentos usando acumuladores.
      $group : {
        //Siempre necesitamos especificar el ID. Especifica qué vamos a agrupar (group by)
        //null agrupa los documentos en un solo grupo
        _id: '$sendero',
        //Solo añadimos uno cada vez que se hace una review
        nRating : { $sum : 1 },
        //Pasamos el nombre del campo
        avgRating : { $avg : '$rating' }

      }
    }
  ]);

  console.log(`Valoraciones del sendero: ${ratings[0].nRating}`);
  console.log(`Media de valoraciones del sendero: ${ratings[0].avgRating}`);

  await Sendero.findByIdAndUpdate(senderoId, {
    gradeQuantity: ratings[0].nRating,
    gradeAverage: ratings[0].avgRating
  });
}

reviewSchema.post('save', function() {
  //this.constructor es el Model actual. No podemos llamar a Review porque no está declarado
  this.constructor.calcAverageGrades(this.sendero);
});


const Review = mongoose.model('Review', reviewSchema);

//Exportamos
module.exports = Review;