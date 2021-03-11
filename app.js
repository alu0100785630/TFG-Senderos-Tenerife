const express = require('express');

//Morgan permite ver el estado de las peticiones en la terminal
const morgan = require('morgan');

//Inlcuir el controlador de errores globales
const controladorErrores = require('./utilities/globalErrorControl');

//Incluimos los módulos
const rutasSenderos = require('./rutas/rutasSenderos');
const rutasUsuarios = require('./rutas/rutasUsuarios');

const app = express();

//Con el argumento especificamos como queremos que sea el loggin
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Esto es un Middleware, es una función que puede modificar los datos entrantes de una petición
//La petición pasa a través de esto mientras se procesa
app.use(express.json());

app.use('/api/senderos', rutasSenderos);
app.use('/api/usuarios', rutasUsuarios);

app.get('/', (req, res) => {
  res.status(200).send('Test para comprobar que el servidor');
});

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