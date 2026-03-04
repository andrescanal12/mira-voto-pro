const fs = require("fs");
const path = require("path");

const lideresPath = path.join(__dirname, "..", "LIDERES.csv");
const referidosPath = path.join(__dirname, "..", "REFERIDOS.csv");
const outPath = path.join(__dirname, "..", "src", "data", "votersData.ts");

// Utilidad para parsear CSV básico, manejando comillas
function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuotes = !inQuotes; }
        else if (ch === "," && !inQuotes) { result.push(current.trim().replace(/^"|"$/g, "")); current = ""; }
        else { current += ch; }
    }
    result.push(current.trim().replace(/^"|"$/g, ""));
    return result;
}

// 1. Leer y Procesar Líderes
let rawLideres = "";
try {
    rawLideres = fs.readFileSync(lideresPath, "utf-8");
} catch (e) {
    console.error("No se pudo leer LIDERES.csv", e.message);
    process.exit(1);
}

const lideresLines = rawLideres.split(/\r?\n/).filter(line => line.trim() !== "");
const lideresDict = {}; // id -> Nombre Completo
const voters = []; // Todos los votantes (Líderes + Referidos)

// LIDERES.csv: 0=ID, 1=Nombre_Completo, 2=Numero_Cedula, 3=Cedula_Inscrita, 4=Lugar, 5=Puesto de Votación Registraduria
for (let i = 1; i < lideresLines.length; i++) { // Skip header
    const cols = parseCSVLine(lideresLines[i]);
    if (cols.length < 2) continue;

    const idLider = cols[0];
    const nombre = cols[1];
    const cedula = cols[2] || "";
    const cedulaInscrita = cols[3] || "";
    const lugar = cols[4] || "";
    const puestoVotacion = cols[5] || "";

    if (!idLider || !nombre) continue;

    lideresDict[idLider] = nombre;

    voters.push({
        id: `lider-${idLider}-${cedula}`,
        pais: "España", // Asumimos España por defecto
        ciudad: lugar,
        iglesia: "", // No viene en el CSV
        cedula: cedula.replace(/\D+$/, "").trim(),
        nombre: nombre,
        celular: "", // Lideres.csv no tiene teléfono
        cedulaInscrita: cedulaInscrita.toUpperCase() === "TRUE" ? "Si" : "No",
        lider: "Líder Principal", // Es un líder
        referido: "",
        estadoInscripcion: puestoVotacion, // Mapeado a donde votaría
        estado: "Aún no ha venido", // Estado por defecto
        comentario: "Es líder",
    });
}

// 2. Leer y Procesar Referidos
let rawReferidos = "";
try {
    rawReferidos = fs.readFileSync(referidosPath, "utf-8");
} catch (e) {
    console.error("No se pudo leer REFERIDOS.csv", e.message);
    process.exit(1);
}

const referidosLines = rawReferidos.split(/\r?\n/).filter(line => line.trim() !== "");

// REFERIDOS.csv: 0=ID_Lider, 1=Nombre_Completo, 2=Numero_Cedula, 3=Telefono, 4=Cedula_Inscrita, 5=Lugar, 6=Puesto de Votación Registraduria
for (let i = 1; i < referidosLines.length; i++) { // Skip header
    const cols = parseCSVLine(referidosLines[i]);
    if (cols.length < 3) continue;

    const idLider = cols[0];
    const nombre = cols[1];
    const cedula = cols[2] || "";
    const telefono = cols[3] || "";
    const cedulaInscrita = cols[4] || "";
    const lugar = cols[5] || "";
    const puestoVotacion = cols[6] || "";

    if (!nombre) continue;

    const nombreLiderBase = lideresDict[idLider] || `ID Líder: ${idLider}`; // Obtener nombre real del líder!

    voters.push({
        id: `referido-${cedula}-${i}`,
        pais: "España",
        ciudad: lugar,
        iglesia: "",
        cedula: cedula.replace(/\D+$/, "").trim(),
        nombre: nombre,
        celular: telefono,
        cedulaInscrita: cedulaInscrita.toUpperCase() === "TRUE" ? "Si" : "No",
        lider: nombreLiderBase, // ¡Aplicamos el nombre del líder correcto!
        referido: "Sí",
        estadoInscripcion: puestoVotacion,
        estado: "Aún no ha venido",
        comentario: "",
    });
}

// 3. Generar el archivo TypeScript para la App
const outDir = path.dirname(outPath);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const content = `// AUTO-GENERADO – no editar manualmente. Ejecutar: node scripts/importLideresYReferidos.cjs
import { Voter, VoterStatus } from "@/types/voter";

export const BASE_VOTERS: Voter[] = ${JSON.stringify(voters, null, 2)};
`;

fs.writeFileSync(outPath, content, "utf-8");
console.log(`✅ Importación correcta: ${Object.keys(lideresDict).length} Líderes, ${voters.length - Object.keys(lideresDict).length} Referidos.`);
console.log(`✅ Total en Base de Datos: ${voters.length} votantes grabados en src/data/votersData.ts`);
