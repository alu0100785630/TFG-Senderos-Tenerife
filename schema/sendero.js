const mongoose = require('mongoose');
const slugify = require('slugify');

const senderoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El sendero debe tener un nombre'],
      //Para que no existan dos iguales
      unique: true,
      trim: true,
      maxlength: [50, 'Longitud máxima de 50 caracteres'],
      minlength: [3, 'Longitud mínima de 3 caracteres']
    },

    slug: String,
    duration: {
      type: Number,
      required: [true, 'El sendero debe tener una duración']
    },
    difficulty: {
      type: String,
      enum: {
        values: ['facil', 'medio', 'dificil'],
        message: 'La dificultad del sendero puede ser: fácil, medio o difícil.'
      }
    },
    gradeAverage: {
      type: Number,
      default: 0,
      min: [0, 'El rating debe ser mínimo 0'],
      max: [5, 'El rating debe ser máximo 5'],
      //set es una functión que se ejecuta cada vez que un valor se establece en este campo.
      //Le pasamos un callback
      set: val => Math.round(val * 10) / 10   //4.666666 *10 = 46.6666, round = 47, /10 = 4.7
    },
    gradeQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'El sendero debe tener una descripción']
    },
    image: {
      type: String,
      required: [true, 'El sendero debe tener una imagen']
    },
    createdDate: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDate: {
      type: Date,
      default: Date.now(),
      required: [true, 'El sendero debe tener una fecha y hora de comienzo']
    },
    mainLocation: {
      type: String
    },
    //Así se crean Embedded Documents. Especificando un array de objetos, se
    //crearán nuevos documentos dentro del documento padre (en este caso Sendero)
    routeLocations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordenadas: [Number],
        address: String,
        description: String
      }
    ],

    //Queremos referenciar un Documento Usuario en el schema del Sendero
    //Le decimos que esperamos un ID de MongoDB en cada uno de los elementos del array
    guias: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuario'
      }
    ]

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }

);

//Optimizar las búsquedas gracias a los index
// Puede tener valores de 1 o -1
// 1 ASC order
// -1 DESC order

//Funciona para querys complejas e individualmente
//GET /api/senderos?price[lt]=1000&gradeAverage[gte]=4.7
senderoSchema.index({ price: 1, gradeAverage: -1 });

//Añadimos el slug ya que es único para hacer queries a los senderos.
senderoSchema.index({ slug: 1 });


//Virtual Populating
senderoSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'sendero',
  localField: '_id'
});

// senderoSchema.virtual('durationWeeks').get(function() {
//   return this.gradeAverage * 7;
// });
//Document Middleware => un middleware que se ejecuta para los documentos
//En este caso, antes de guardar el documento le pone un slug.
senderoSchema.pre('save', function(next) {
  //this es el documento que se va a guardar en la base de datos
  //creamos un string que se puede poner en la url con el nombre del sendero
  this.slug = slugify(this.name, { lower: true });
  //Necesitamos llamar a next() para que sigan corriendo los middleware
  next();
});




//Añadimos la referencia (populate query) POPULATING
//Se ejecuta a todas las querys a la base de datos que empiezan for find (allSenderos y singleSendero)
senderoSchema.pre('/^find/', function(next) {
  this.populate({
    path: 'guias',
    //No nos interesa el campo __v en la referencia
    select: '-__v'
  });
  next();
});

const Sendero = mongoose.model('Sendero', senderoSchema);

//Exportamos
module.exports = Sendero;
