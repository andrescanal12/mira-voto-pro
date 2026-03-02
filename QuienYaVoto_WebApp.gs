// ============================================================
// QUIEN YA VOTÓ - WEB APP API (Google Apps Script)
// ============================================================
// INSTRUCCIONES DE DESPLIEGUE:
// 1. Abre tu Google Sheet → Extensiones → Apps Script
// 2. Pega este código completo
// 3. Guarda (Ctrl+S)
// 4. Clic en "Implementar" → "Nueva implementación"
// 5. Tipo: "Aplicación web"
// 6. Ejecutar como: "Yo"
// 7. Quién tiene acceso: "Cualquier persona"
// 8. Clic "Implementar" → Copia la URL que te da
// 9. Pega esa URL en src/services/sheetsApi.ts de tu app React
// ============================================================

var SPREADSHEET_ID = "1gwoKESCKD-VOOcxqsbYcc2ie3J6uOuAPAWsRu0aaEVo";
var SHEET_NAME = "Hoja 1";
var HEADER_ROW = 1;     // Fila donde están los encabezados
var DATA_START = 2;     // Primera fila de datos

// Índices de columna (1-based) según tu Google Sheet:
// A=1 PAÍS | B=2 CIUDAD | C=3 IGLESIA | D=4 CÉDULA
// E=5 NOMBRE | F=6 CELULAR | G=7 YA VOTO | H=8 COMENTARIO
var COL = {
  PAIS:       1,
  CIUDAD:     2,
  IGLESIA:    3,
  CEDULA:     4,
  NOMBRE:     5,
  CELULAR:    6,
  YA_VOTO:    7,
  COMENTARIO: 8
};

// ============================================================
// CORS HEADERS — necesarios para que React pueda llamar al API
// ============================================================
function corsHeaders_() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}

function jsonResponse_(data, code) {
  var output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ============================================================
// GET — Leer todos los votantes
// Llamar: GET https://<url-web-app>?action=getAll
// ============================================================
function doGet(e) {
  try {
    var action = e && e.parameter && e.parameter.action ? e.parameter.action : "getAll";

    if (action === "getAll") {
      return jsonResponse_({ success: true, data: getAllVoters_() });
    }

    if (action === "getByCedula") {
      var cedula = e.parameter.cedula;
      if (!cedula) return jsonResponse_({ success: false, error: "Cédula requerida" });
      var voter = getVoterByCedula_(cedula);
      if (!voter) return jsonResponse_({ success: false, error: "No encontrado" });
      return jsonResponse_({ success: true, data: voter });
    }

    return jsonResponse_({ success: false, error: "Acción no reconocida" });

  } catch (err) {
    return jsonResponse_({ success: false, error: err.message });
  }
}

// ============================================================
// POST — Crear / Actualizar / Eliminar
// Body JSON: { action: "create"|"update"|"delete", ... }
// ============================================================
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;

    if (action === "create") {
      var result = createVoter_(body.voter);
      return jsonResponse_({ success: true, data: result });
    }

    if (action === "update") {
      var updated = updateVoter_(body.cedula, body.changes);
      return jsonResponse_({ success: true, data: updated });
    }

    if (action === "updateStatus") {
      // Actualiza solo el campo "Ya votó" de una cédula
      var res = updateStatus_(body.cedula, body.yaVoto);
      return jsonResponse_({ success: true, data: res });
    }

    if (action === "updateComment") {
      // Actualiza solo el campo "Comentario" de una cédula
      var resC = updateComment_(body.cedula, body.comentario);
      return jsonResponse_({ success: true, data: resC });
    }

    if (action === "delete") {
      var deleted = deleteVoter_(body.cedula);
      return jsonResponse_({ success: true, data: { deleted: deleted } });
    }

    return jsonResponse_({ success: false, error: "Acción no reconocida: " + action });

  } catch (err) {
    return jsonResponse_({ success: false, error: err.message });
  }
}

// ============================================================
// UTILIDADES INTERNAS
// ============================================================

function getSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("No se encontró la hoja: " + SHEET_NAME);
  return sheet;
}

function rowToVoter_(row, rowNum) {
  return {
    _fila:      rowNum,
    pais:       row[COL.PAIS - 1]        || "",
    ciudad:     row[COL.CIUDAD - 1]      || "",
    iglesia:    row[COL.IGLESIA - 1]     || "",
    cedula:     String(row[COL.CEDULA - 1] || "").trim(),
    nombre:     row[COL.NOMBRE - 1]      || "",
    celular:    String(row[COL.CELULAR - 1] || "").trim(),
    yaVoto:     row[COL.YA_VOTO - 1]     || "",
    comentario: row[COL.COMENTARIO - 1]  || ""
  };
}

function findRowByCedula_(cedula) {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < DATA_START) return -1;
  var values = sheet.getRange(DATA_START, COL.CEDULA, lastRow - DATA_START + 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(cedula).trim()) {
      return DATA_START + i;
    }
  }
  return -1;
}

// ============================================================
// READ ALL
// ============================================================
function getAllVoters_() {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < DATA_START) return [];

  var numRows = lastRow - DATA_START + 1;
  var maxCol = Math.max.apply(null, Object.values(COL));
  var data = sheet.getRange(DATA_START, 1, numRows, maxCol).getValues();

  var voters = [];
  for (var i = 0; i < data.length; i++) {
    var cedula = String(data[i][COL.CEDULA - 1]).trim();
    if (!cedula || cedula === "" || /^total/i.test(cedula)) continue;
    if (!/\d{4,}/.test(cedula)) continue;
    voters.push(rowToVoter_(data[i], DATA_START + i));
  }
  return voters;
}

// ============================================================
// READ ONE
// ============================================================
function getVoterByCedula_(cedula) {
  var fila = findRowByCedula_(cedula);
  if (fila === -1) return null;
  var sheet = getSheet_();
  var maxCol = Math.max.apply(null, Object.values(COL));
  var row = sheet.getRange(fila, 1, 1, maxCol).getValues()[0];
  return rowToVoter_(row, fila);
}

// ============================================================
// CREATE
// ============================================================
function createVoter_(voter) {
  if (!voter.cedula) throw new Error("La cédula es obligatoria.");
  var existing = findRowByCedula_(voter.cedula);
  if (existing !== -1) throw new Error("Ya existe un registro con cédula " + voter.cedula);

  var sheet = getSheet_();
  var newRow = ["", "", "", "", "", "", "", ""];
  newRow[COL.PAIS       - 1] = voter.pais       || "";
  newRow[COL.CIUDAD     - 1] = voter.ciudad     || "";
  newRow[COL.IGLESIA    - 1] = voter.iglesia    || "";
  newRow[COL.CEDULA     - 1] = voter.cedula;
  newRow[COL.NOMBRE     - 1] = voter.nombre     || "";
  newRow[COL.CELULAR    - 1] = voter.celular    || "";
  newRow[COL.YA_VOTO    - 1] = voter.yaVoto     || "";
  newRow[COL.COMENTARIO - 1] = voter.comentario || "";

  sheet.appendRow(newRow);
  var insertedRow = sheet.getLastRow();
  Logger.log("CREATE → fila " + insertedRow + ": " + voter.nombre);
  return rowToVoter_(newRow, insertedRow);
}

// ============================================================
// UPDATE (campos parciales)
// ============================================================
function updateVoter_(cedula, changes) {
  var fila = findRowByCedula_(cedula);
  if (fila === -1) throw new Error("No se encontró cédula: " + cedula);

  var sheet = getSheet_();
  var maxCol = Math.max.apply(null, Object.values(COL));
  var rowActual = sheet.getRange(fila, 1, 1, maxCol).getValues()[0];
  var voterActual = rowToVoter_(rowActual, fila);

  // Merge: solo se actualizan los campos enviados
  var merged = Object.assign({}, voterActual, changes);
  merged.cedula = cedula; // la cédula no cambia

  var newRow = ["", "", "", "", "", "", "", ""];
  newRow[COL.PAIS       - 1] = merged.pais;
  newRow[COL.CIUDAD     - 1] = merged.ciudad;
  newRow[COL.IGLESIA    - 1] = merged.iglesia;
  newRow[COL.CEDULA     - 1] = merged.cedula;
  newRow[COL.NOMBRE     - 1] = merged.nombre;
  newRow[COL.CELULAR    - 1] = merged.celular;
  newRow[COL.YA_VOTO    - 1] = merged.yaVoto;
  newRow[COL.COMENTARIO - 1] = merged.comentario || "";

  sheet.getRange(fila, 1, 1, maxCol).setValues([newRow]);
  Logger.log("UPDATE → fila " + fila + ": " + merged.nombre);
  return rowToVoter_(newRow, fila);
}

// ============================================================
// UPDATE STATUS — Actualiza solo columna "Ya votó" (col G)
// ============================================================
function updateStatus_(cedula, yaVoto) {
  var fila = findRowByCedula_(cedula);
  if (fila === -1) throw new Error("No se encontró cédula: " + cedula);

  var sheet = getSheet_();
  sheet.getRange(fila, COL.YA_VOTO).setValue(yaVoto);
  Logger.log("UPDATE STATUS → cédula " + cedula + " → " + yaVoto);
  return { cedula: cedula, yaVoto: yaVoto, fila: fila };
}

// ============================================================
// UPDATE COMMENT — Actualiza solo columna "Comentario" (col H)
// ============================================================
function updateComment_(cedula, comentario) {
  var fila = findRowByCedula_(cedula);
  if (fila === -1) throw new Error("No se encontró cédula: " + cedula);

  var sheet = getSheet_();
  sheet.getRange(fila, COL.COMENTARIO).setValue(comentario || "");
  Logger.log("UPDATE COMMENT → cédula " + cedula + " → " + comentario);
  return { cedula: cedula, comentario: comentario, fila: fila };
}

// ============================================================
// DELETE
// ============================================================
function deleteVoter_(cedula) {
  var fila = findRowByCedula_(cedula);
  if (fila === -1) throw new Error("No se encontró cédula: " + cedula);

  var sheet = getSheet_();
  var nombre = sheet.getRange(fila, COL.NOMBRE).getValue();
  sheet.deleteRow(fila);
  Logger.log("DELETE → " + nombre + " (cédula: " + cedula + ")");
  return true;
}

// ============================================================
// MENÚ EN LA HOJA (opcional)
// ============================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🗳️ Quien Ya Votó")
    .addItem("📋 Ver total de votantes", "mostrarTotal_")
    .addItem("🔄 Refrescar (ver logs)", "verLogs_")
    .addToUi();
}

function mostrarTotal_() {
  var voters = getAllVoters_();
  var yaVotaron = voters.filter(function(v) {
    return String(v.yaVoto).toLowerCase() === "sí" ||
           String(v.yaVoto).toLowerCase() === "si" ||
           String(v.yaVoto).toLowerCase() === "yes";
  });
  SpreadsheetApp.getUi().alert(
    "📊 RESUMEN\n\n" +
    "Total registros: " + voters.length + "\n" +
    "✅ Ya votaron: " + yaVotaron.length + "\n" +
    "⏳ Pendientes: " + (voters.length - yaVotaron.length)
  );
}

function verLogs_() {
  SpreadsheetApp.getUi().alert("Revisa Ver → Registros en el editor de Apps Script.");
}
