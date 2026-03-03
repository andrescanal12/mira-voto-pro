const fs = require("fs");
const path = require("path");

// Columns (0-indexed): A=0 B=1 C=2 D=3(cedula) E=4(nombre) F=5(celular)
// G=6(inscrita) H=7(lider) I=8(referido) J=9(vacía) K=10(vacía) L=11(ESTADO)
const csvPath = path.join(__dirname, "..", "Quien ya voto_ - Hoja 1.csv");
const outPath = path.join(__dirname, "..", "src", "data", "votersData.ts");

const raw = fs.readFileSync(csvPath, "utf-8");
const lines = raw.split(/\r?\n/);

// Columns (0-indexed): A=0 PAÍS, B=1 CIUDAD, C=2 IGLESIA, D=3 CÉDULA,
// E=4 NOMBRE, F=5 CELULAR, G=6 INSCRITA, H=7 LIDER, I=8 REFERIDO, K=10 ESTADO

function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuotes = !inQuotes; }
        else if (ch === "," && !inQuotes) { result.push(current.trim()); current = ""; }
        else { current += ch; }
    }
    result.push(current.trim());
    return result;
}

// Find header row (contains CEDULA)
let headerIdx = -1;
for (let i = 0; i < Math.min(lines.length, 15); i++) {
    if (lines[i].toUpperCase().includes("CÉDULA") || lines[i].toUpperCase().includes("CEDULA")) {
        headerIdx = i;
        break;
    }
}

if (headerIdx === -1) { console.error("No se encontró fila de encabezados"); process.exit(1); }

const voters = [];
for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.trim() === "") continue;

    const cols = parseCSVLine(line);
    const cedula = (cols[3] || "").replace(/\D+$/, "").trim(); // quitar " Verificar cédula" etc.
    const nombre = (cols[4] || "").trim();

    if (!cedula || !/\d{4,}/.test(cedula) || !nombre) continue;
    // Saltar filas de totales
    if (nombre.toLowerCase().includes("total")) continue;

    const estadoInsc = (cols[11] || "").trim().toUpperCase();
    let estado = "Aún no ha venido"; // Estado por defecto para el día D


    voters.push({
        id: `voter-${cedula}-${i}`,
        pais: (cols[0] || "").trim(),
        ciudad: (cols[1] || "").trim(),
        iglesia: (cols[2] || "").trim(),
        cedula,
        nombre,
        celular: (cols[5] || "").trim(),
        cedulaInscrita: (cols[6] || "").trim(),
        lider: (cols[7] || "").trim(),
        referido: (cols[8] || "").trim(),
        estadoInscripcion: estadoInsc,
        estado,
        comentario: "",
    });
}

// Ensure output dir exists
const outDir = path.dirname(outPath);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const content = `// AUTO-GENERADO – no editar manualmente. Ejecutar: node scripts/generateVotersData.cjs
import { Voter } from "@/types/voter";

export const BASE_VOTERS: Voter[] = ${JSON.stringify(voters, null, 2)};
`;

fs.writeFileSync(outPath, content, "utf-8");
console.log(`✅ Generados ${voters.length} votantes en ${outPath}`);
