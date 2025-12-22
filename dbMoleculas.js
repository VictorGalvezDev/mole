const mongoose = require("mongoose");
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL;

const AtomoEsquema = new mongoose.Schema({
  nombre: { type: String, required: true, minLength: 1, maxLength: 40 },
  val: { type: Number, required: true, default: 1 },
  color: { type: String, required: true, default: "black" },
  descripcion: String,
  numeroPeriodico: Number,
  peso: { type: Number, required: true }
});


const EstructuraEsquema = new mongoose.Schema({
  nombre: { type: String, required: true, minLength: 1, maxLength: 40, unique: true },
  gData:
  {
    nodes: [
      {
        id: { type: Number },
        val: { type: Number },
        color: { type: String },
        peso: { type: Number }
      }
    ],
    links: [
      {
        source: Number,
        target: Number
      }]
  }
}, {
  virtuals: {
    pesoTotal: {
      get() {
        if (this.gData.nodes.length > 0) {
          let peso = 0;
          for (node of this.gData.nodes) {
            peso += node.peso;
          }
          return peso
        } else {
          return undefined;
        }
      }
    },

    toJSON: { virtuals: true },
  }
});

const Estructura = new mongoose.model("Estructura", EstructuraEsquema);
const Atomo = new mongoose.model("Atomo", AtomoEsquema);


exports.conectar = async function () {
  mongoose.set('strictQuery', false)
  mongoose.connect(dbUrl);
};

exports.cerrarConexion = async function () {
  await mongoose.disconnect();
};

buscarNombre = async function (nombre) {
  const query = Estructura.find()
  const palabras = nombre
    .split(" ")
    .map((texto) => texto.trim())
    .filter((texto) => texto.length > 0);
  if (palabras.length > 0) {
    let patrones = [];
    palabras.forEach((palabra) => {
      patrones.push({ nombre: new RegExp(palabra, "i") });
    });
    query.or(patrones);
  }
  return await query.exec();
};

buscarNombreAtomo = async function (nombre) {
  const query = Atomo.find()
  const palabras = nombre
    .split(" ")
    .map((texto) => texto.trim())
    .filter((texto) => texto.length > 0);
  if (palabras.length > 0) {
    let patrones = [];
    palabras.forEach((palabra) => {
      patrones.push({ nombre: new RegExp(palabra, "i") });
    });
    query.or(patrones);
  }
  return await query.exec();
};

ajustarNombre = function(nombre) {
  return nombre.replaceAll("/","").replaceAll("?","").replaceAll("%","").replaceAll("#","").trim()
}

//operaciones Crud
exports.guardarEstructura = async function (estructuraRecibida) {

  if (estructuraRecibida.nombre) {
    estructuraRecibida.nombre = ajustarNombre(estructuraRecibida.nombre);
  }
  try {
    const estructuraNueva = new Estructura(estructuraRecibida);
    return await estructuraNueva.save();
  } catch (err) {
    return undefined;
  }
};

exports.guardarAtomo = async function (atomoRecibido) {
  try {
    const atomoNuevo = new Atomo(atomoRecibido);
    return await atomoNuevo.save();
  } catch (err) {
    return undefined;
  }
};

exports.borrarEstructura = async function (nombreEstructura) {
  return (await Estructura.deleteOne({ nombre: nombreEstructura })).deletedCount == 1;
};

exports.borrarAtomo = async function (AtomoID) {
  return (await Atomo.deleteOne({ _id: AtomoID })).deletedCount == 1;
};


exports.buscarEstructuras = async function (buscador) {
  if (buscador && buscador.length > 0) {
    return await buscarNombre(buscador)
  }
  return await Estructura.find({})
}

exports.buscarAtomos = async function (buscador) {
  console.log(buscador);
  if (buscador.length > 0) {
    return await buscarNombreAtomo(buscador)
  }
  return await Atomo.find({})
}

exports.buscarEstructuraPorNombre = async function (nombreEstructura) {
  let estructura = await Estructura.find({ nombre: nombreEstructura })
  if (estructura.length > 0) return estructura;
  return undefined
}


exports.buscarAtomoPorID = async function (id) {
  return await Atomo.findById(id)
} 
