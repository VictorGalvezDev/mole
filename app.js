require("dotenv").config();
const db = require("./dbMoleculas.js");
const express = require("express");
const app = express();

const PORT = process.env.PORT || process.env.PUERTO || 80;
app.use(express.json());
app.use(express.static("public"));


app.get("/estructuras", async (req, res) => {
    res.json(await db.buscarEstructuras(req.query.busqueda));
});

app.get("/atomos", async (req, res) => {
  res.json(await db.buscarAtomos(req.query.busqueda));
});

app.get("/estructuras/:nombre", async (req, res) => {
    const estructura = await db.buscarEstructuraPorNombre(req.params.nombre);
    if (estructura) {
      res.json(estructura);
    } else {
      res.status(404).send("la estructura no existe")
    }
});

app.get("/atomos/:id", async (req, res) => {
  const atomo = await db.buscarAtomoPorID(req.params.id);
  if (atomo) {
    res.json(atomo);
  } else {
    res.status(404).send("la estructura no existe")
  }
});

app.delete("/estructuras/:nombre", async (req, res) => {
  if (await db.borrarEstructura(req.params.nombre)) res.sendStatus(204);
  else res.status(404).send("la estructura no existe");
});

app.post("/estructuras", async (req, res) => {
  if (req.body.nombre && await db.buscarEstructuraPorNombre(req.body.nombre)) {
    res.status(409).send("La estructura ya existe")
    return undefined
  }
  const estructuraRecibida = await db.guardarEstructura(req.body);
  if (estructuraRecibida) res.location(`/estructuras/${estructuraRecibida.nombre}`).status(201).send("Estructura creada");
  else res.status(400).send("Error en la creación de estructura.");
})


db.conectar().then(() => {
    console.log("Conectado a la base de datos.");
    app.listen(PORT, () =>
    console.log(`Servidor escuchando en el puerto ${PORT}.`)
  );
});
