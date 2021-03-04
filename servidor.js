const app = require('./app');

// Iniciar Servidor
const port = 6700;
app.listen(port, () => {
  console.log(`App ejecutando en el puerto: ${port}...`);
});