const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Test para comprobar que el servidor funciona');
});


// Iniciar Servidor
const port = 6700;
app.listen(port, () => {
  console.log(`App ejecutando en el puerto: ${port}...`);
});
