const Usuario = require('./../schema/usuario');

const objectFilter = (ob, ...fields) => {
  const newObj = {};
  Object.keys(ob).forEach(el => {
  //Si el array incluye el elemento key del objeto (en este caso será req.body), lo asignamos al nuevo objeto
  if (fields.includes(el)) 
    newObj[el] = ob[el];
  });
  return newObj;
};


exports.allUsuarios = async(req, res) => {
  try {
    const usuarios = await Usuario.find();

    res.status(200).json({
      status: 'success',
      amount: usuarios.length,
      data: {
        usuarios
      }
    });
  } 
  catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};




//ACTUALIZAR USUARIO
exports.updateUser = async (req, res, next) => {
  try {
    // Creamos un error si el usuario intenta actualizar la contraseña
    if (req.body.password || req.body.passwordConfirm) {
      throw new Error('No se puede actualizar la contraseña desde esta ruta.');
    }
    // Quitamos los campos que se mandan en la request que no nos interesan (objectFilter)
    // Luego podremos ampliar estos campos
    const requestBody = objectFilter(req.body, 'name', 'email');
  
    // 3) Update user document
    const updatedUser = await Usuario.findByIdAndUpdate(req.user.id, requestBody, {
      //Ejecutar validaciones de mongoose
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  }
  catch(err) {
    return next(err);
  }
};

//ELIMINAR USUARIO
exports.deleteUser = async (req, res, next) => {
  //Realmente no eliminamos el usuario, simplemente desactivamos la cuenta.
  try {
    await Usuario.findByIdAndUpdate(req.user.id, { activo: false });
    res.status(204).json({
      status: 'success',
      //No mandamos ningún dato
      data: null
    });
  }
  catch(err) {
    return next(err);
  }
};