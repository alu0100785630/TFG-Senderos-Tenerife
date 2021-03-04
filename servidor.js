//Paquete necesario para poder usar nuestras variables de entorno
const dotenv = require('dotenv');
//Le decimos al paquete donde están ubicadas nuestras variables
//Guarda las variables del fichero en nuestras variables de ambiente
//La lectura de este fichero se hace en el proceso, por tanto solo hay que leerla una vez, no hay que inluirla en más sitios.
//Incluir esto antes que nuestra app, para que reconozca las variables
dotenv.config({ path: './.env' })

const app = require('./app');

// Iniciar Servidor
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App ejecutando en el puerto: ${port}...`);
});