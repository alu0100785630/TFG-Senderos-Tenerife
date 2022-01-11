const Usuario = require('./../schema/usuario');

//Incluir librería promisify
//Usamos destructuring de ES6 ya que solo vamos a usar el método promisify
const { promisify } = require('util');

const jwt = require('jsonwebtoken');

//Los JWT deben ser guardados en los HTTPOnly Cookie, pero ahora mismo solo estamos
//mandando el token como un simple string en nuestra respuesta JSON.
const cookieJWT = (usuario, statusCode, token, res) => {

  const cookieOpt = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  //1st arg: name of the cookie
  //2nd arg: data of the cookie
  //3rd arg: cookie options
  res.cookie('jwt', token, cookieOpt);

  // Eliminar la contraseña del output
  usuario.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      usuario
    }
  });
};



exports.registro = async(req, res, next) => {
  try {
    //Con este código solo permitimos accesso a los datos que realmente necesitamos para crear un usuario.
    // role : req.body.role,
    const newUsuario = await Usuario.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id: newUsuario._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    cookieJWT(newUsuario, 201, token, res);

  } catch (err) {
    //Esto significa que existe un duplicated key
    if (err.code == 11000) {
      err.message = `Ya existe un usuario con esos valores.`;
    }
    else {
      err.message = `Bad request! Error en el lado del cliente.`;
    }

    err.status = 'fail';
    err.statusCode = 400;
    return next(err);
  }
};


exports.login = async(req, res, next) => {
  try {

    //Leemos el email y la contraseña desde el body de la petición
    const { email, password } = req.body;
    

    if (!email || !password ){
      throw new Error('Email o contraseña vacíos.');
    }

    const usuario = await Usuario.findOne({ email: email, password: password }).select('+password');

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    cookieJWT(usuario, 200, token, res);
    

  } catch (err) {
    console.log(req.body);
    // if (err.message != 'Email o contraseña vacíos.')
    // err.message = `Email o contraseña incorrectos!`;  

    // err.status = 'fail';
    // err.statusCode = 400;
    return next(err);
  }
};

exports.protect = async(req, res, next) => {
  try {
    //1) Obtenemos el token y comprobamos si está ahí
    let token;
    //Los token se envían en los header de las peticiones HTTP
    //El estándar es ==> autorization: 'Bearer token_string' ==> Enviarlo en los headers de la petición de postman
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      //Creamos un array con split y cogemos el segundo elemento que será el token
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.cookie && req.headers.cookie.startsWith('jwt=')) {
      token = req.headers.cookie.replace('jwt=', '');
    }

    //Comprobamos si el token existe
    if (!token) {
      throw new Error('No ha hecho log in. Por favor inicie sesión para obtener acceso.');
    }
    // 2) Verificar token
    //jwt.verify(1,2,3) ==> el tercer arg es una función callback que se ejecuta una vez se ha verificado el token. Por eso verify se considera una función asíncrona
    //Haremos que la función jwt.verify retorne una promesa. Usamos la función built-in the node promisify
    //promisify(jwt.verify) retorna la promesa
    //(token, process.env.JWT_SECRET) llama a la función
    //El resultado será los datos decodificados del JWT (el payload ==> hemos dicho que sea el id del usuario (_id))
    const descode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    // 3) Si la verificación del token es correcta, luego comprobamos si el usuario aún existe
    //El usuario puede haber sido eliminado durante el proceso, pero el token seguirá existiendo.
    //En vez de usar el id de la base de datos, usamos el id del payload (JWT). Si en la base de datos existe un id igual que el id del token, entonces el usuario existe.
    const usuarioActual = await Usuario.findById(descode.id);
    
    if (!usuarioActual) {
      throw new Error('El usuario propietario del token ya no existe.');
    }
    
    //Ponemos los datos del usuario en la request
    req.user = usuarioActual;
    //next nos llevará al siguiente route handler, lo que significa que tendremos acceso a la ruta protegida actual
    next();
  }
  catch (err) {
    return next(err);
  }
};

exports.restrict = (...roles) => {
  // Este middleware funciona porque lo ejecutamos siempre después del
  // middleware protect, que es el que inicia la sesión del usuario.
  //...roles ==> crea un array con los parámetros que le pasemos
  return (req, res, next) => {
    // roles = ['usuario', 'guia', 'admin']
    try {
    // Daremos acceso a la ruta si el tipo de usuario está dentro de los parámetros
    // Si el role del usuario actual (req.user.role) no está en el array de
    // los permitidos, lanzo un error.
      if (!roles.includes(req.user.role)) {
        throw new Error('Permiso denegado! (Capacidad del rol de usuario limitada)');
      }
      next();
    }
    catch(err) {
      return next(err);
    }
  };
};