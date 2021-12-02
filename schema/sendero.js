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
      minlength: [5, 'Longitud mínima de 5 caracteres']
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
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
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
      //Tipo y Coordinadas
      type: {
        type: String,
        //También puede ser Polygon, Lines.. pero nos interesa Point. (Coordinada)
        default: 'Point',
        enum: ['Point']
      },
      //Esta sintaxis nos dice que espera un array de números. Latitud y altitud
      coordinadas: [Number],
      description: String,
      address: String
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
        coordinadas: [Number],
        address: String,
        description: String
      }
    ],

  },

);

//Document Middleware => un middleware que se ejecuta para los documentos
//En este caso, antes de guardar el documento le pone un slug.
senderoSchema.pre('save', function(next) {
  //this es el documento que se va a guardar en la base de datos
  //creamos un string que se puede poner en la url con el nombre del sendero
  this.slug = slugify(this.name, { lower: true });
  //Necesitamos llamar a next() para que sigan corriendo los middleware
  next();
});

const Sendero = mongoose.model('Sendero', senderoSchema);

//Exportamos
module.exports = Sendero;
