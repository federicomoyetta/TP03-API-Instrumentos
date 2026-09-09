const fs = require('node:fs/promises');

async function leerIntrumentos(rutaDatos) {
    try {
        const contenido = await fs.readFile(rutaDatos, 'utf-8');
        const datosInstr = JSON.parse(contenido);
        return datosInstr;
    }
    catch (error) {
        console.error('Error al leer el archivo de Base de Datos de Instrumentos:', error);
    }
}

module.exports = {leerIntrumentos};