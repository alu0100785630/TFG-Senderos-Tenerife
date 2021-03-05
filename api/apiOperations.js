class APIOperations {
  constructor(query, cadenaQuery) {
    this.query = query;
    this.cadenaQuery = cadenaQuery;
  }

  // /api/senderos?sort=price,gradeAverage
  // /api/senderos?sort=-price --> con '-' ordena al orden inverso
  ordenar() {
    if (this.cadenaQuery.sort) {
      //En mongoose la función sort usa espacios => sort('price' 'gradeAverage')
      const orderBy = this.cadenaQuery.sort.split(',').join(' ');
      //Ejecutamos la función
      this.query = this.query.sort(orderBy);
    } else {
      //Ordena por nombre por defecto
      this.query = this.query.sort('name');
    }

    return this;
  }

  // /api/senderos?fields=name,price
  seleccionarCampos() {
    if (this.cadenaQuery.fields) {
      //Mismo funcionamiento que la función anterior. select()
      const fields = this.cadenaQuery.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // __v es lo que usar mongoose para seleccionar. Por defecto excluimos solo ese campo.
      this.query = this.query.select('-__v');
    }

    return this;
  }

  filtrar() {
    //Destructuring de ES6 para obtener los datos del objeto, los pongo entre {} para convertirlo directamente en un objeto
    const objetoQuery = { ...this.cadenaQuery };

    //Array con los elementos que quiero excluir
    const camposExclude = ['sort', 'page', 'fields', 'limit'];
    //Recorro el array y elimino los elementos que coincidan en el objeto query.
    camposExclude.forEach(el => delete objetoQuery[el]);

    //Las consultas de de comparación se realizan con $ delante ($gte, $lte). Así que hacemos un replace del string.
    //Convierte el objeto a un string the JSON
    let jsonStr = JSON.stringify(objetoQuery);
    //Sustituimos usando expresión regular
    jsonStr = jsonStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(jsonStr));

    //Devuelve el objeto completo
    return this;
  }
}

//Exportamos
module.exports = APIOperations;
