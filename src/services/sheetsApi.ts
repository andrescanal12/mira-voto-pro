// Servicio de sincronización App React ↔ Google Sheets vía Apps Script
// Las columnas de tu hoja son:
// Lugar | Puesto de Votación Registraduria | Nombre_Completo | Numero_Cedula | Telefono | Estado | Comentario
export const SHEETS_API_URL =
    "https://script.google.com/macros/s/AKfycbz2TOOd-wc5-9cjV1mdbMTj_E9ba7MS80Ju17rTZnHnOGldlyV5SR03jkBoxY0qYkj6Jg/exec";

import { Voter, VoterStatus } from "@/types/voter";

// ============================
// Tipos de respuesta del API
// ============================
export interface SheetRow {
    Lugar: string;
    "Puesto de Votación Registraduria": string;
    Nombre_Completo: string;
    Numero_Cedula: string;
    Telefono: string;
    Estado: string;
    Comentario: string;
}

// Convierte una fila del Sheet → objeto Voter de la App
export function sheetRowToVoter(row: SheetRow): Voter {
    const estado = normalizarEstado(row.Estado);
    return {
        id: row.Numero_Cedula ? `voter-${row.Numero_Cedula}` : `voter-${Math.random()}`,
        pais: "España",
        ciudad: row["Lugar"] || "",
        iglesia: "",
        cedula: row["Numero_Cedula"] || "",
        nombre: row["Nombre_Completo"] || "",
        celular: row["Telefono"] || "",
        cedulaInscrita: row["Numero_Cedula"] ? "Si" : "No",
        lider: "Sin asig.",
        referido: "",
        estadoInscripcion: row["Puesto de Votación Registraduria"] || "",
        estado,
        comentario: row["Comentario"] || "",
    };
}

// Normaliza el valor Estado del Sheet a los tipos que usa la App
function normalizarEstado(rawEstado: string): VoterStatus {
    const cleaned = (rawEstado || "").trim().toLowerCase();
    if (cleaned === "ya votó" || cleaned === "ya voto" || cleaned === "si" || cleaned === "sí") return "Ya votó";
    if (cleaned === "no va votar" || cleaned === "no va a votar") return "No va votar";
    if (cleaned === "pendiente de llamar") return "Pendiente de llamar";
    return "Aún no ha venido";
}

// ============================================================
// READ ALL — Obtener todos los votantes del Sheet
// ============================================================
export async function getAllVotersFromSheet(): Promise<Voter[]> {
    const res = await fetch(SHEETS_API_URL);
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const json: SheetRow[] = await res.json();
    if (!Array.isArray(json)) throw new Error("La respuesta del servidor no es un array válido.");
    return json.map(sheetRowToVoter).filter(v => v.nombre.trim() !== "");
}

// ============================================================
// UPDATE STATUS + COMMENT — Actualiza estado y comentario
// ============================================================
export async function updateVoterStatus(cedula: string, estado: string): Promise<void> {
    // mode: no-cors evita el bloqueo CORS del navegador al enviar al Apps Script
    fetch(SHEETS_API_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
            action: "UPDATE",
            data: { Numero_Cedula: cedula, Estado: estado },
        }),
    }).catch(err => console.warn("UPDATE estado falló:", err));
}

export async function updateVoterComment(cedula: string, comentario: string): Promise<void> {
    fetch(SHEETS_API_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
            action: "UPDATE",
            data: { Numero_Cedula: cedula, Comentario: comentario },
        }),
    }).catch(err => console.warn("UPDATE comentario falló:", err));
}

// ============================================================
// CREATE — Crear nueva fila en el Sheet
// ============================================================
export async function createVoterInSheet(voter: Voter): Promise<void> {
    const sheetData: SheetRow = {
        Lugar: voter.ciudad,
        "Puesto de Votación Registraduria": voter.estadoInscripcion,
        Nombre_Completo: voter.nombre,
        Numero_Cedula: voter.cedula,
        Telefono: voter.celular,
        Estado: voter.estado,
        Comentario: voter.comentario,
    };
    fetch(SHEETS_API_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ action: "CREATE", data: sheetData }),
    }).catch(err => console.warn("CREATE falló:", err));
}

// ============================================================
// DELETE — Eliminar por cédula
// ============================================================
export async function deleteVoterFromSheet(cedula: string): Promise<void> {
    fetch(SHEETS_API_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ action: "DELETE", id: cedula }),
    }).catch(err => console.warn("DELETE falló:", err));
}

// Compatibilidad hacia atrás
export function estadoToYaVoto(estado: string): string {
    if (estado === "Ya votó") return "Ya votó";
    if (estado === "No va votar") return "No va votar";
    if (estado === "Pendiente de llamar") return "Pendiente de llamar";
    return "Aún no ha venido";
}
