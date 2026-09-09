const express = require("express");
const path = require("node:path");
const { leerIntrumentos } = require("./archivos");

const appInstrum = express();
const PORT = 3000;
const rutaDatos = path.join(__dirname, "..", "datos", "instrumentos.json");

appInstrum.use(express.json());

async function main() {
  try {
    const datosInstr = await leerIntrumentos(rutaDatos);

    appInstrum.get("/", (req, res) => {
      res.send(
        "Bienvenidos a la API de Instrumentos Musicales // " +
        "Para obtener todos los instrumentos, utilice la ruta /api/instrumentos // " +
        "Para obtener un instrumento por su ID, utilice la ruta /api/instrumentos/:id // " +
        "Para filtrar por familia de instrumentos, utilice la ruta /api/instrumentosxfamilia?familia=nombreFamilia"
      );
    });

    appInstrum.get("/api/instrumentos", (req, res) => {
      res.json(datosInstr);
    });

    appInstrum.get("/api/instrumentos/:id", (req, res) => {
      const { id } = req.params;
      const instrumento = datosInstr.find((i) => i.id === parseInt(id));
      if (!instrumento) {
        return res.status(404).json({ error: "Instrumento no encontrado" });
      }
      res.json(instrumento);
    });

    appInstrum.get("/api/instrumentosxfamilia/", (req, res) => {
      const familia = req.query.familia;
      const instrumentoPorFamilia = datosInstr.filter((f) =>
        f.familia.toLowerCase().includes(familia.toLowerCase()),
      );
      if (instrumentoPorFamilia.length === 0) {
        return res
          .status(200)
          .json({ error: "Familia de Instrumentos no encontrada" });
      }
      res.json(instrumentoPorFamilia);
    });

    appInstrum.post("/api/instrumentos", (req, res) => {
      const { id, nombre, familia, origen, descripcion, disponible } = req.body;
      if (!id || !nombre || !familia || !origen || !descripcion || disponible === undefined) {
        return res.status(400).json({ error: "Faltan datos del instrumento" });
      }
      const nuevoInstrumento = {
        id: instrumentos.length + 1,
        nombre: "Bongó",
        familia: "Percusión",
        origen: "Cuba",
        descripcion: "instrumento musical de percusión membranófono formado por un juego de dos tambores pequeños unidos entre sí",
        disponible: true
      };
      datosInstr.push(nuevoInstrumento);
      res.status(201).json(nuevoInstrumento);
    });

    appInstrum.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al leer los instrumentos:", error);
  }
}

main();
