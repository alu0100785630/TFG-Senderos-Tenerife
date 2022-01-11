const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//Morgan permite ver el estado de las peticiones en la terminal
const morgan = require('morgan');

//Inlcuir el controlador de errores globales
const controladorErrores = require('./utilities/globalErrorControl');

//Incluimos los módulos
const rutasSenderos = require('./rutas/rutasSenderos');
const rutasUsuarios = require('./rutas/rutasUsuarios');

//Si tiene body y coincide con los datos del Schema, crea una review.
//Si no tiene body, allReviews
const rutasReviews = require('./rutas/rutasReviews');

const rutasVisual = require('./rutas/rutasVisual');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());

app.options('*', cors());

// Todos los ficheros servidos desde este directorio son estáticos
app.use(express.static(path.join(__dirname, 'assets')));

//Con el argumento especificamos como queremos que sea el loggin
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cookieParser());

//Esto es un Middleware, es una función que puede modificar los datos entrantes de una petición
//La petición pasa a través de esto mientras se procesa
app.use(express.json());

app.use('/', rutasVisual);

app.use('/api/senderos', rutasSenderos);
app.use('/api/usuarios', rutasUsuarios);
app.use('/api/reviews', rutasReviews);

// app.get('/', (req, res) => {
  // res.status(200).send('Test para comprobar que el servidor');
  //En vez de llamar a .json llamamos a .render
  //No necesitamos especificar la extensión del fichero.
  // res.status(200).render('base');
// });

//Como los middleware se ejecutan en orden, ponemos el de manejo de errores aquí,
//así los errores que se produzcan en los controladores vendrán a este middleware.
app.all('*', (req, res, next) => {
  //req.originalUrl muestra la URL de la petición
  //Usamos la clase Error de Express
  const err = new Error(`No se encuentra la ruta: ${req.originalUrl} en este servidor.`);
  err.status = 'fail';
  err.statusCode = 404;

  //Al pasar el error a next, la siguiente función será de error sin importar el orden en la pila de middlwares.
  next(err);

});

app.use(controladorErrores);


//Esto lo hacemos para separar express y el servidor
module.exports = app;