// ============================================================
// QUIEN YA VOTÓ - WEB APP API (Google Apps Script)
// ============================================================
// INSTRUCCIONES DE DESPLIEGUE:
// 1. Abre tu Google Sheet → Extensiones → Apps Script
// 2. Pega este código completo (borra lo anterior)
// 3. Guarda (Ctrl+S)
// 4. Clic en "Implementar" → "Nueva implementación"
//    (o "Administrar implementaciones" → editar la existente)
// 5. Tipo: "Aplicación web"
// 6. Ejecutar como: "Yo"
// 7. Quién tiene acceso: "Cualquier persona"
// 8. Clic "Implementar" → Copia la URL
// ============================================================

// ── CONFIGURA ESTO CON TU HOJA ──────────────────────────────
var SPREADSHEET_ID = "1gwoKESCKD-VOOcxqsbYcc2ie3J6uOuAPAWsRu0aaEVo";
var SHEET_NAME     = "Votantes"; // Nombre exacto de la pestaña

// Columnas de tu hoja (1 = columna A):
// A=Lugar | B=Puesto de Votación | C=Nombre_Completo
// D=Numero_Cedula | E=Telefono | F=Estado | G=Comentario
var COL = {
  LUGAR:    1,  // A
  MESA:     2,  // B
  NOMBRE:   3,  // C
  CEDULA:   4,  // D
  TELEFONO: 5,  // E
  ESTADO:   6,  // F
  COMENTARIO: 7 // G
};
// ────────────────────────────────────────────────────────────

// ============================================================
// GET — Devuelve TODOS los votantes como array JSON
// React lo llama: fetch(URL) → lee el array
// ============================================================
function doGet(e) {
  try {
    var sheet = getSheet_();
    var lastRow = sheet.getLastRow();
    var numCols = 7;
    var result = [];

    if (lastRow < 2) return jsonOut_(result);

    var data = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();

    for (var i = 0; i < data.length; i++) {
      var cedula = String(data[i][COL.CEDULA - 1]).trim();
      if (!cedula || cedula === "") continue;

      result.push({
        "Lugar":                             String(data[i][COL.LUGAR    - 1]).trim(),
        "Puesto de Votación Registraduria":  String(data[i][COL.MESA     - 1]).trim(),
        "Nombre_Completo":                   String(data[i][COL.NOMBRE   - 1]).trim(),
        "Numero_Cedula":                     cedula,
        "Telefono":                          String(data[i][COL.TELEFONO - 1]).trim(),
        "Estado":                            String(data[i][COL.ESTADO   - 1]).trim(),
        "Comentario":                        String(data[i][COL.COMENTARIO - 1]).trim()
      });
    }

    return jsonOut_(result);
  } catch (err) {
    return jsonOut_({ error: err.message });
  }
}

// ============================================================
// POST — Crear / Actualizar / Eliminar
// La app React envía: { action: "CREATE"|"UPDATE"|"DELETE", data: {...}, id: cedula }
// ============================================================
function doPost(e) {
  try {
    var body   = JSON.parse(e.postData.contents);
    var action = (body.action || "").toUpperCase(); // acepta CREATE, UPDATE, DELETE
    var data   = body.data || {};
    var id     = body.id || data["Numero_Cedula"] || "";

    if (action === "UPDATE") {
      return jsonOut_(handleUpdate_(id, data));
    }
    if (action === "CREATE") {
      return jsonOut_(handleCreate_(data));
    }
    if (action === "DELETE") {
      return jsonOut_(handleDelete_(id));
    }

    return jsonOut_({ error: "Acción desconocida: " + action });
  } catch (err) {
    return jsonOut_({ error: err.message });
  }
}

// ── LÓGICA UPDATE ──────────────────────────────────────────
function handleUpdate_(cedula, data) {
  var fila = findRowByCedula_(cedula);
  if (fila === -1) return { error: "Cédula no encontrada: " + cedula };

  var sheet = getSheet_();
  // Actualiza sólo las columnas que llegaron
  if (data["Estado"]     !== undefined) sheet.getRange(fila, COL.ESTADO).setValue(data["Estado"]);
  if (data["Comentario"] !== undefined) sheet.getRange(fila, COL.COMENTARIO).setValue(data["Comentario"]);
  if (data["Lugar"]      !== undefined) sheet.getRange(fila, COL.LUGAR).setValue(data["Lugar"]);
  if (data["Puesto de Votación Registraduria"] !== undefined) sheet.getRange(fila, COL.MESA).setValue(data["Puesto de Votación Registraduria"]);
  if (data["Nombre_Completo"] !== undefined) sheet.getRange(fila, COL.NOMBRE).setValue(data["Nombre_Completo"]);
  if (data["Telefono"]   !== undefined) sheet.getRange(fila, COL.TELEFONO).setValue(data["Telefono"]);

  Logger.log("UPDATE → fila " + fila + " cédula " + cedula);
  return { success: true, fila: fila };
}

// ── LÓGICA CREATE ──────────────────────────────────────────
function handleCreate_(data) {
  var cedula = (data["Numero_Cedula"] || "").trim();
  if (!cedula) return { error: "Numero_Cedula es obligatoria" };

  var existe = findRowByCedula_(cedula);
  if (existe !== -1) return { error: "Ya existe cédula: " + cedula };

  var sheet = getSheet_();
  sheet.appendRow([
    data["Lugar"] || "",
    data["Puesto de Votación Registraduria"] || "",
    data["Nombre_Completo"] || "",
    cedula,
    data["Telefono"] || "",
    data["Estado"] || "Aún no ha venido",
    data["Comentario"] || ""
  ]);

  Logger.log("CREATE → cédula " + cedula);
  return { success: true };
}

// ── LÓGICA DELETE ──────────────────────────────────────────
function handleDelete_(cedula) {
  var fila = findRowByCedula_(cedula);
  if (fila === -1) return { error: "Cédula no encontrada: " + cedula };
  getSheet_().deleteRow(fila);
  Logger.log("DELETE → cédula " + cedula + " (fila " + fila + ")");
  return { success: true };
}

// ── UTILIDADES ─────────────────────────────────────────────
function getSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("Hoja no encontrada: " + SHEET_NAME);
  return sheet;
}

function findRowByCedula_(cedula) {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var values = sheet.getRange(2, COL.CEDULA, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(cedula).trim()) {
      return i + 2; // +2 porque i=0 corresponde a la fila 2
    }
  }
  return -1;
}

function jsonOut_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Menú extra dentro del Sheet (opcional, muy útil)
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🗳️ Quien Ya Votó")
    .addItem("📊 Ver resumen", "mostrarResumen_")
    .addToUi();
}

function mostrarResumen_() {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  var total = lastRow > 1 ? lastRow - 1 : 0;
  var estados = sheet.getRange(2, COL.ESTADO, total, 1).getValues();
  var yaVotaron = estados.filter(function(r) {
    return String(r[0]).toLowerCase().indexOf("ya") !== -1;
  }).length;
  SpreadsheetApp.getUi().alert(
    "📊 RESUMEN\n\n" +
    "Total registros: " + total + "\n" +
    "✅ Ya votaron: " + yaVotaron + "\n" +
    "⏳ Pendientes: " + (total - yaVotaron)
  );
}
