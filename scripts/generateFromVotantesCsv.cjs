const fs = require('fs');
const path = require('path');

// Ruta al CSV y al archivo de salida TS
const csvPath = path.join(__dirname, "..", "Quien ya voto_ - Votantes.csv");
const outPath = path.join(__dirname, "..", "src", "data", "votersData.ts");

// Utilidad para extraer las columnas ignorando comas dentro de comillas
function parseCSVLine(text) {
    const result = [];
    let insideQuotes = false;
    let currentVal = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            result.push(currentVal.trim());
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    result.push(currentVal.trim());
    return result;
}

// 1. Leer el CSV final del usuario
if (!fs.existsSync(csvPath)) {
    console.error("❌ No se encontró el archivo:", csvPath);
    console.error("❌ Asegúrate de que se llama exactamente 'Quien ya voto_ - Votantes.csv'");
    process.exit(1);
}

const csvData = fs.readFileSync(csvPath, "utf-8");
const lines = csvData.split('\n').filter(line => line.trim() !== "");

// Mapear Cabeceras esperadas:
// Lugar,Puesto de Votación Registraduria ,Nombre_Completo,Numero_Cedula,Telefono,Estado,Comentario

const voters = [];

for (let i = 1; i < lines.length; i++) { // Salto la cabecera (i=0)
    const row = parseCSVLine(lines[i]);
    if (row.length < 4) continue; // Precaución, saltar filas muy vacías

    const lugar = row[0] || ""; // Ciudad
    const puesto = row[1] || ""; // Estado Inscripción
    const nombre = row[2] || "";
    const cedula = row[3] || "";
    const telefono = row[4] || "";
    let estado = row[5] || ""; // Estado
    const comentario = row[6] || "";

    // Normalizar Estado a los esperados por Typescript o default
    if (!["Aún no ha venido", "Pendiente de llamar", "Ya votó", "No va votar"].includes(estado)) {
        estado = "Aún no ha venido";
    }

    voters.push({
        id: cedula ? `voter-${cedula}` : `voter-no-id-${i}`,
        pais: "España", // Asumido
        ciudad: lugar,
        iglesia: "", // No viene en el CSV
        cedula: cedula,
        nombre: nombre,
        celular: telefono,
        cedulaInscrita: cedula ? "Si" : "No", // Asumido
        lider: "Sin asig.", // No viene la jerarquía explícita en el CSV proporcionado
        referido: "",
        estadoInscripcion: puesto,
        estado: estado,
        comentario: comentario
    });
}

// 2. Generar archivo TypeScript
const content = `// AUTO-GENERADO – no editar manualmente. Ejecutar: node scripts/generateFromVotantesCsv.cjs
import { Voter, VoterStatus } from "@/types/voter";

export const BASE_VOTERS: Voter[] = ${JSON.stringify(voters, null, 2)};
`;

fs.writeFileSync(outPath, content, "utf-8");
console.log(`✅ ¡Importación superada! `);
console.log(`✅ ${voters.length} votantes grabados en src/data/votersData.ts desde archivo Quien ya voto_ - Votantes.csv`);
