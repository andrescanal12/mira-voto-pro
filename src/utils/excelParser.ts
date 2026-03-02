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
        const allRows = XLSX.utils.sheet_to_json<(string | number | null)[]>(worksheet, {
          header: 1,
          defval: "",
          blankrows: false,
        });

        // Find the header row by looking for CÉDULA keyword in any cell
        let headerIdx = -1;
        let headers: string[] = [];

        for (let i = 0; i < Math.min(allRows.length, 20); i++) {
          const row = allRows[i];
          if (!row || !Array.isArray(row)) continue;
          const rowStrs = row.map((c) => String(c ?? "").toUpperCase().trim());
          // Look for a row that has both CEDULA and NOMBRE-like columns
          const hasCedula = rowStrs.some((c) => c.includes("CÉDULA") || c.includes("CEDULA"));
          const hasNombre = rowStrs.some((c) => c.includes("NOMBRE") || c.includes("APELLIDO"));
          if (hasCedula && hasNombre) {
            headerIdx = i;
            headers = row.map((c) => String(c ?? "").trim());
            break;
          }
        }

        // Fallback: just look for CEDULA
        if (headerIdx === -1) {
          for (let i = 0; i < Math.min(allRows.length, 20); i++) {
            const row = allRows[i];
            if (!row || !Array.isArray(row)) continue;
            const rowStrs = row.map((c) => String(c ?? "").toUpperCase().trim());
            if (rowStrs.some((c) => c.includes("CÉDULA") || c.includes("CEDULA"))) {
              headerIdx = i;
              headers = row.map((c) => String(c ?? "").trim());
              break;
            }
          }
        }

        if (headerIdx === -1) {
          console.warn("No header row found, using first row");
          headerIdx = 0;
          headers = (allRows[0] || []).map((c) => String(c ?? "").trim());
        }

        console.log("Header row index:", headerIdx, "Headers:", headers);

        // Map column indices with flexible matching
        const findCol = (keywords: string[]) =>
          headers.findIndex((h) => {
            const upper = h.toUpperCase();
            return keywords.some((k) => upper.includes(k));
          });

        const colPais = findCol(["PAÍS", "PAIS"]);
        const colCiudad = findCol(["CIUDAD"]);
        const colIglesia = findCol(["IGLESIA"]);
        const colCedula = findCol(["CÉDULA", "CEDULA"]);
        const colNombre = findCol(["NOMBRE", "APELLIDO"]);
        const colCelular = findCol(["CELULAR", "TELEFONO", "TELÉFONO", "INDICATIVO"]);
        const colInscrita = findCol(["INSCRITA"]);
        const colLider = findCol(["LÍDER", "LIDER"]);
        const colReferido = findCol(["REFERIDO"]);
        const colEstadoInsc = findCol(["ESTADO"]);
        const colYaVoto = findCol(["VOTÓ", "VOTO", "YA VOTO"]);

        console.log("Column mapping:", {
          colPais, colCiudad, colIglesia, colCedula,
          colNombre, colCelular, colInscrita, colEstadoInsc
        });

        const voters: Voter[] = [];

        for (let i = headerIdx + 1; i < allRows.length; i++) {
          const row = allRows[i];
          if (!row || !Array.isArray(row)) continue;

          const cedula = String(row[colCedula] ?? "").trim();
          const nombre = colNombre >= 0 ? String(row[colNombre] ?? "").trim() : "";

          // Skip rows without meaningful data
          if (!cedula || cedula === "" || !nombre || nombre === "") continue;
          // Skip if cedula is not numeric-like (filter out header-like rows)
          if (!/\d{4,}/.test(cedula)) continue;

          let estado: VoterStatus = "Pendiente de llamar";
          if (colYaVoto >= 0) {
            const val = String(row[colYaVoto] ?? "").trim().toLowerCase();
            if (val === "sí" || val === "si" || val === "yes") {
              estado = "Ya votó";
            }
          }

          const celularRaw = String(row[colCelular] ?? "").trim();
          // Clean phone number - remove scientific notation artifacts
          let celular = celularRaw;
          if (celularRaw.includes("E+") || celularRaw.includes("e+")) {
            try {
              celular = BigInt(Math.round(Number(celularRaw))).toString();
            } catch {
              celular = celularRaw;
            }
          }

          voters.push({
            id: `voter-${cedula}-${i}`,
            pais: colPais >= 0 ? String(row[colPais] ?? "").trim() : "",
            ciudad: colCiudad >= 0 ? String(row[colCiudad] ?? "").trim() : "",
            iglesia: colIglesia >= 0 ? String(row[colIglesia] ?? "").trim() : "",
            cedula,
            nombre,
            celular,
            cedulaInscrita: colInscrita >= 0 ? String(row[colInscrita] ?? "").trim() : "",
            lider: colLider >= 0 ? String(row[colLider] ?? "").trim() : "",
            referido: colReferido >= 0 ? String(row[colReferido] ?? "").trim() : "",
            estadoInscripcion: colEstadoInsc >= 0 ? String(row[colEstadoInsc] ?? "").trim() : "",
            estado,
            comentario: "",
          });
        }

        console.log("Parsed voters count:", voters.length);
        resolve(voters);
      } catch (err) {
        console.error("Excel parse error:", err);
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
