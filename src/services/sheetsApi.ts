// Servicio de sincronización App React ↔ Google Sheets vía Apps Script
export const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbyT5ejYmm5dMDfAKSkghksTq2N20fsj-LqRhP4dJZ3vN1LdQgoLEpfbE1O2-9LJDZV7Bw/exec";

// Tipos de respuesta del API
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface SheetVoter {
    _fila: number;
    pais: string;
    ciudad: string;
    iglesia: string;
    cedula: string;
    nombre: string;
    celular: string;
    yaVoto: string;
    comentario: string;
}

// Convierte "Ya votó" / "Pendiente de llamar" / "No va votar"
// al valor que va en la columna G del Sheet ("Sí" / "No" / "No")
export function estadoToYaVoto(estado: string): string {
    if (estado === "Ya votó") return "Sí";
    if (estado === "No va votar") return "No va votar";
    return "No";
}

// ============================================================
// READ ALL — Obtener todos los votantes del Sheet
// ============================================================
export async function getAllVoters(): Promise<SheetVoter[]> {
    const url = `${SHEETS_API_URL}?action=getAll`;
    const res = await fetch(url);
    const json: ApiResponse<SheetVoter[]> = await res.json();
    if (!json.success) throw new Error(json.error || "Error al leer el Sheet");
    return json.data || [];
}

export async function updateVoterStatus(
    cedula: string,
    yaVoto: string
): Promise<void> {
    await fetch(SHEETS_API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "updateStatus", cedula, yaVoto }),
    });
}

export async function updateVoterComment(
    cedula: string,
    comentario: string
): Promise<void> {
    await fetch(SHEETS_API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "updateComment", cedula, comentario }),
    });
}

// ============================================================
// UPDATE (campos completos) — Actualiza cualquier campo
// ============================================================
export async function updateVoter(
    cedula: string,
    changes: Partial<SheetVoter>
): Promise<SheetVoter> {
    const res = await fetch(SHEETS_API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "update", cedula, changes }),
    });
    const json: ApiResponse<SheetVoter> = await res.json();
    if (!json.success) throw new Error(json.error || "Error al actualizar");
    return json.data!;
}

// ============================================================
// CREATE — Crear un nuevo votante
// ============================================================
export async function createVoter(voter: Omit<SheetVoter, "_fila">): Promise<SheetVoter> {
    const res = await fetch(SHEETS_API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "create", voter }),
    });
    const json: ApiResponse<SheetVoter> = await res.json();
    if (!json.success) throw new Error(json.error || "Error al crear");
    return json.data!;
}

// ============================================================
// DELETE — Eliminar por cédula
// ============================================================
export async function deleteVoter(cedula: string): Promise<void> {
    const res = await fetch(SHEETS_API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "delete", cedula }),
    });
    const json: ApiResponse<boolean> = await res.json();
    if (!json.success) throw new Error(json.error || "Error al eliminar");
}
