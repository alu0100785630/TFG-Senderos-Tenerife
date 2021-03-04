const express = require('express');

//Morgan permite ver el estado de las peticiones en la terminal
const morgan = require('morgan');


const app = express();

//Con el argumento especificamos como queremos que sea el loggin
app.use(morgan('dev'));

//Esto es un Middleware, es una función que puede modificar los datos entrantes de una petición
//La petición pasa a través de esto mientras se procesa
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Test para comprobar que el servidor');
});

//Esto lo hacemos para separar express y el servidor
module.exports = app;