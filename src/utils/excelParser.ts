import * as XLSX from "xlsx";
import { Voter, VoterStatus } from "@/types/voter";

export function parseExcelFile(file: File): Promise<Voter[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });

        // Find header row - look for the row with CÉDULA or similar
        const voters: Voter[] = [];
        let headerFound = false;
        const allRows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1, defval: "" });

        let headers: string[] = [];
        let dataStartIdx = 0;

        for (let i = 0; i < allRows.length; i++) {
          const row = allRows[i];
          const rowStr = row.map((c) => String(c).toUpperCase());
          if (rowStr.some((c) => c.includes("CÉDULA") || c.includes("CEDULA"))) {
            headers = row.map((c) => String(c).trim());
            dataStartIdx = i + 1;
            headerFound = true;
            break;
          }
        }

        if (!headerFound) {
          // Fallback: use first row as headers
          headers = allRows[0].map((c) => String(c).trim());
          dataStartIdx = 1;
        }

        // Map column indices
        const findCol = (keywords: string[]) =>
          headers.findIndex((h) =>
            keywords.some((k) => h.toUpperCase().includes(k))
          );

        const colPais = findCol(["PAÍS", "PAIS"]);
        const colCiudad = findCol(["CIUDAD"]);
        const colIglesia = findCol(["IGLESIA"]);
        const colCedula = findCol(["CÉDULA", "CEDULA"]);
        const colNombre = findCol(["NOMBRE", "APELLIDO"]);
        const colCelular = findCol(["CELULAR", "TELEFONO", "TELÉFONO"]);
        const colInscrita = findCol(["INSCRITA"]);
        const colLider = findCol(["LÍDER", "LIDER"]);
        const colReferido = findCol(["REFERIDO"]);
        const colEstadoInsc = findCol(["ESTADO"]);
        const colYaVoto = findCol(["VOTÓ", "VOTO", "YA VOTO"]);

        for (let i = dataStartIdx; i < allRows.length; i++) {
          const row = allRows[i];
          const cedula = String(row[colCedula] ?? "").trim();
          const nombre = String(row[colNombre] ?? "").trim();

          if (!cedula || !nombre) continue;

          let estado: VoterStatus = "Pendiente de llamar";
          if (colYaVoto >= 0) {
            const val = String(row[colYaVoto] ?? "").trim().toLowerCase();
            if (val === "sí" || val === "si" || val === "yes") {
              estado = "Ya votó";
            }
          }

          voters.push({
            id: `voter-${cedula}-${i}`,
            pais: String(row[colPais] ?? "").trim(),
            ciudad: String(row[colCiudad] ?? "").trim(),
            iglesia: String(row[colIglesia] ?? "").trim(),
            cedula,
            nombre,
            celular: String(row[colCelular] ?? "").trim(),
            cedulaInscrita: String(row[colInscrita] ?? "").trim(),
            lider: String(row[colLider] ?? "").trim(),
            referido: String(row[colReferido] ?? "").trim(),
            estadoInscripcion: String(row[colEstadoInsc] ?? "").trim(),
            estado,
            comentario: "",
          });
        }

        resolve(voters);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function exportToExcel(voters: Voter[], filename: string) {
  const exportData = voters.map((v) => ({
    "País": v.pais,
    "Ciudad": v.ciudad,
    "Iglesia": v.iglesia,
    "Nº de Cédula": v.cedula,
    "Nombres y Apellidos": v.nombre,
    "Celular": v.celular,
    "Cédula Inscrita": v.cedulaInscrita,
    "Estado de Votación": v.estado,
    "Comentario": v.comentario,
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Votantes");
  XLSX.writeFile(wb, filename);
}
