const mongoose = require('mongoose');
const validator = require('validator');

const usuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Introduzca un nombre.']
  },
  email: {
    type: String,
    required: [true, 'Introduzca un email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Introduzca un formato válido de email (example@email.com).']
  },
  role: {
    type: String,
    enum: ['usuario', 'guia', 'admin'],
    default: 'usuario'
  },
  password: {
    type: String,
    required: [true, 'Introduzca una contraseña.'],
    minlength: 4,
    //Esto hace que el campo contraseña no se muestre en el output
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirme la contraseña.'],
    validate: {
      // Esto solo funciona para las funciones save() y create() en mongoose.
      validator: function(el) {
        return el === this.password;
      },
      message: 'Las contraseñas no coinciden.'
    }
  },
  //Para activar/desactivar cuentas de usuario
  //select: false para que sea una propiedad invisible en la API. Solo será visible en la base de datos.
  activo: {
    type: Boolean,
    default: true,
    select: false
  }
});

usuarioSchema.pre('save', async function(next) {
  //Realizar encriptado de contraseña aquí

  //Confirmación de contraseña a undefined para que no se muestre
  this.passwordConfirm = undefined;
  next();
});

//Middleware Query
//Lo ponemos con la expresión regular para que pille todas las queries (findById, findAndUpdate...)
usuarioSchema.pre(/^find/, function(next) {
  // this apunta a la query actual
  // No muestra en la API los usuarios inactivos (activo != false)
  this.find({ activo: { $ne: false } });
  next();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;