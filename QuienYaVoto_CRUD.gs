// ============================================================
// QUIEN YA VOTÓ - CRUD COMPLETO EN GOOGLE APPS SCRIPT
// ============================================================
// Columnas de la hoja (fila 3 = encabezados):
// A: PAÍS
// B: CIUDAD
// C: NOMBRE IGLESIA
// D: Nº DE CÉDULA
// E: NOMBRES Y APELLIDOS
// F: CELULAR (CON INDICATIVO)
// G: ¿TIENE LA CÉDULA INSCRITA?
// H: ¿ACTIVO COMO LÍDER?
// I: ¿ACTIVO COMO REFERIDO?
// J: (columna vacía / extra)
// K: ESTADO DE INSCRIPCIÓN
// ============================================================

// ----------------------------------------------------------
// CONFIGURACIÓN GLOBAL
// ----------------------------------------------------------
var SHEET_NAME = "Hoja 1";      // Nombre de la hoja en Google Sheets
var HEADER_ROW = 3;              // Fila donde están los encabezados (fila 3)
var DATA_START_ROW = 4;          // Primera fila de datos reales
var CEDULA_COL = 4;              // Columna D = clave primaria (Nº de cédula)

// Índices de columna para leer/escribir (1-based)
var COL = {
  PAIS:             1,
  CIUDAD:           2,
  NOMBRE_IGLESIA:   3,
  CEDULA:           4,
  NOMBRE_APELLIDO:  5,
  CELULAR:          6,
  CEDULA_INSCRITA:  7,
  ACTIVO_LIDER:     8,
  ACTIVO_REFERIDO:  9,
  EXTRA:            10,
  ESTADO:           11
};

// ----------------------------------------------------------
// UTILIDADES INTERNAS
// ----------------------------------------------------------

/**
 * Obtiene la hoja activa por nombre.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('No se encontró la hoja "' + SHEET_NAME + '"');
  }
  return sheet;
}

/**
 * Convierte una fila de valores a un objeto de usuario.
 * @param {Array} row - Array con los valores de la fila.
 * @returns {Object}
 */
function rowToUser_(row) {
  return {
    pais:            row[COL.PAIS - 1]            || "",
    ciudad:          row[COL.CIUDAD - 1]          || "",
    nombreIglesia:   row[COL.NOMBRE_IGLESIA - 1]  || "",
    cedula:          String(row[COL.CEDULA - 1]).trim() || "",
    nombreApellido:  row[COL.NOMBRE_APELLIDO - 1] || "",
    celular:         String(row[COL.CELULAR - 1]) || "",
    cedulaInscrita:  row[COL.CEDULA_INSCRITA - 1] || "",
    activoLider:     row[COL.ACTIVO_LIDER - 1]    || "",
    activoReferido:  row[COL.ACTIVO_REFERIDO - 1] || "",
    estado:          row[COL.ESTADO - 1]           || ""
  };
}

/**
 * Convierte un objeto de usuario a un array de valores para la hoja.
 * @param {Object} u - Objeto usuario.
 * @returns {Array}
 */
function userToRow_(u) {
  return [
    u.pais,
    u.ciudad,
    u.nombreIglesia,
    u.cedula,
    u.nombreApellido,
    u.celular,
    u.cedulaInscrita,
    u.activoLider,
    u.activoReferido,
    "",           // columna extra vacía (col J)
    u.estado
  ];
}

/**
 * Busca la fila (número, 1-based) de un usuario por cédula.
 * Devuelve -1 si no se encuentra.
 * @param {string} cedula
 * @returns {number}
 */
function findRowByCedula_(cedula) {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) return -1;

  var range = sheet.getRange(DATA_START_ROW, COL.CEDULA, lastRow - DATA_START_ROW + 1, 1);
  var values = range.getValues();

  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(cedula).trim()) {
      return DATA_START_ROW + i;
    }
  }
  return -1;
}

// ============================================================
// CREATE - Crear nuevo usuario
// ============================================================

/**
 * Crea un nuevo registro en la hoja. Lanza error si la cédula ya existe.
 *
 * @param {Object} usuario - Datos del usuario a crear.
 * @param {string} usuario.pais              - País
 * @param {string} usuario.ciudad            - Ciudad
 * @param {string} usuario.nombreIglesia     - Nombre de la iglesia
 * @param {string} usuario.cedula            - Nº de cédula (clave única)
 * @param {string} usuario.nombreApellido    - Nombres y apellidos
 * @param {string} usuario.celular           - Celular con indicativo
 * @param {string} usuario.cedulaInscrita    - ¿Tiene la cédula inscrita? (Sí/No)
 * @param {string} usuario.activoLider       - ¿Activo como líder? (Sí/No)
 * @param {string} usuario.activoReferido    - ¿Activo como referido? (Sí/No)
 * @param {string} usuario.estado            - Estado de inscripción (COMPLETO/EN PROCESO)
 * @returns {Object} - El usuario creado con el número de fila.
 */
function crearUsuario(usuario) {
  if (!usuario.cedula || String(usuario.cedula).trim() === "") {
    throw new Error("El número de cédula es obligatorio.");
  }

  var fila = findRowByCedula_(usuario.cedula);
  if (fila !== -1) {
    throw new Error('Ya existe un registro con cédula "' + usuario.cedula + '" en la fila ' + fila + '.');
  }

  var sheet = getSheet_();
  var newRow = userToRow_(usuario);
  sheet.appendRow(newRow);

  var insertedRow = sheet.getLastRow();
  Logger.log("✅ Usuario creado en fila " + insertedRow + ": " + usuario.nombreApellido);
  return { fila: insertedRow, datos: usuario };
}

// ============================================================
// READ - Leer usuario(s)
// ============================================================

/**
 * Obtiene todos los usuarios de la hoja (omite filas vacías).
 * @returns {Array<Object>} - Lista de todos los usuarios.
 */
function obtenerTodosLosUsuarios() {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < DATA_START_ROW) {
    Logger.log("No hay datos en la hoja.");
    return [];
  }

  var numRows = lastRow - DATA_START_ROW + 1;
  var data = sheet.getRange(DATA_START_ROW, 1, numRows, 11).getValues();

  var usuarios = [];
  for (var i = 0; i < data.length; i++) {
    var cedula = String(data[i][COL.CEDULA - 1]).trim();
    // Omitir filas vacías o filas de totales
    if (cedula === "" || cedula.toLowerCase().includes("total")) continue;
    var u = rowToUser_(data[i]);
    u._fila = DATA_START_ROW + i;
    usuarios.push(u);
  }

  Logger.log("📋 Total de usuarios encontrados: " + usuarios.length);
  return usuarios;
}

/**
 * Obtiene un usuario por su número de cédula.
 * @param {string} cedula - Nº de cédula a buscar.
 * @returns {Object|null} - El usuario o null si no existe.
 */
function obtenerUsuarioPorCedula(cedula) {
  var fila = findRowByCedula_(cedula);
  if (fila === -1) {
    Logger.log("⚠️ No se encontró usuario con cédula: " + cedula);
    return null;
  }

  var sheet = getSheet_();
  var row = sheet.getRange(fila, 1, 1, 11).getValues()[0];
  var u = rowToUser_(row);
  u._fila = fila;

  Logger.log("🔍 Usuario encontrado: " + u.nombreApellido + " (fila " + fila + ")");
  return u;
}

/**
 * Busca usuarios por nombre (búsqueda parcial, sin distinción de mayúsculas).
 * @param {string} nombre - Texto a buscar en el campo de nombres y apellidos.
 * @returns {Array<Object>} - Lista de usuarios coincidentes.
 */
function buscarUsuariosPorNombre(nombre) {
  var todos = obtenerTodosLosUsuarios();
  var query = nombre.toLowerCase().trim();
  var resultado = todos.filter(function(u) {
    return u.nombreApellido.toLowerCase().indexOf(query) !== -1;
  });
  Logger.log("🔍 Búsqueda por nombre '" + nombre + "': " + resultado.length + " resultado(s).");
  return resultado;
}

/**
 * Filtra usuarios por estado de inscripción.
 * @param {string} estado - "COMPLETO" o "EN PROCESO"
 * @returns {Array<Object>}
 */
function filtrarPorEstado(estado) {
  var todos = obtenerTodosLosUsuarios();
  var resultado = todos.filter(function(u) {
    return u.estado.toUpperCase() === estado.toUpperCase();
  });
  Logger.log("📊 Usuarios con estado '" + estado + "': " + resultado.length);
  return resultado;
}

/**
 * Filtra usuarios por ciudad.
 * @param {string} ciudad
 * @returns {Array<Object>}
 */
function filtrarPorCiudad(ciudad) {
  var todos = obtenerTodosLosUsuarios();
  return todos.filter(function(u) {
    return u.ciudad.toUpperCase() === ciudad.toUpperCase();
  });
}

// ============================================================
// UPDATE - Actualizar usuario existente
// ============================================================

/**
 * Actualiza los datos de un usuario identificado por su cédula.
 * Solo se actualizan los campos que se pasen en el objeto (merge parcial).
 *
 * @param {string} cedula - Cédula del usuario a actualizar.
 * @param {Object} cambios - Objeto con los campos a modificar.
 * @returns {Object} - El usuario actualizado.
 */
function actualizarUsuario(cedula, cambios) {
  var fila = findRowByCedula_(cedula);
  if (fila === -1) {
    throw new Error('No se encontró usuario con cédula "' + cedula + '".');
  }

  var sheet = getSheet_();
  var rowActual = sheet.getRange(fila, 1, 1, 11).getValues()[0];
  var usuarioActual = rowToUser_(rowActual);

  // Merge: combinar datos actuales con los cambios
  var usuarioActualizado = Object.assign({}, usuarioActual, cambios);
  // Asegurarse que la cédula no cambie
  usuarioActualizado.cedula = cedula;

  var nuevaFila = userToRow_(usuarioActualizado);
  sheet.getRange(fila, 1, 1, 11).setValues([nuevaFila]);

  Logger.log("✏️ Usuario actualizado en fila " + fila + ": " + usuarioActualizado.nombreApellido);
  return { fila: fila, datos: usuarioActualizado };
}

/**
 * Actualiza únicamente el estado de inscripción de un usuario.
 * @param {string} cedula
 * @param {string} nuevoEstado - "COMPLETO" o "EN PROCESO"
 */
function actualizarEstado(cedula, nuevoEstado) {
  return actualizarUsuario(cedula, { estado: nuevoEstado });
}

// ============================================================
// DELETE - Eliminar usuario
// ============================================================

/**
 * Elimina el registro de un usuario por su cédula.
 * La fila se elimina completamente de la hoja.
 *
 * @param {string} cedula - Cédula del usuario a eliminar.
 * @returns {boolean} - true si se eliminó correctamente.
 */
function eliminarUsuario(cedula) {
  var fila = findRowByCedula_(cedula);
  if (fila === -1) {
    throw new Error('No se encontró usuario con cédula "' + cedula + '".');
  }

  var sheet = getSheet_();
  // Guardar nombre antes de borrar para el log
  var nombreBorrado = sheet.getRange(fila, COL.NOMBRE_APELLIDO, 1, 1).getValue();
  sheet.deleteRow(fila);

  Logger.log("🗑️ Usuario eliminado: " + nombreBorrado + " (cédula: " + cedula + ", antes en fila " + fila + ")");
  return true;
}

// ============================================================
// ESTADÍSTICAS
// ============================================================

/**
 * Genera un resumen estadístico de los datos.
 * @returns {Object}
 */
function obtenerEstadisticas() {
  var todos = obtenerTodosLosUsuarios();
  var completos  = todos.filter(function(u) { return u.estado.toUpperCase() === "COMPLETO"; });
  var enProceso  = todos.filter(function(u) { return u.estado.toUpperCase() === "EN PROCESO"; });
  var lideres    = todos.filter(function(u) { return u.activoLider.toUpperCase()    === "SÍ" || u.activoLider.toUpperCase()    === "SI"; });
  var referidos  = todos.filter(function(u) { return u.activoReferido.toUpperCase() === "SÍ" || u.activoReferido.toUpperCase() === "SI"; });

  var ciudades = {};
  todos.forEach(function(u) {
    ciudades[u.ciudad] = (ciudades[u.ciudad] || 0) + 1;
  });

  var stats = {
    total:            todos.length,
    completos:        completos.length,
    enProceso:        enProceso.length,
    lideres:          lideres.length,
    referidos:        referidos.length,
    porCiudad:        ciudades
  };

  Logger.log("📊 Estadísticas:\n" + JSON.stringify(stats, null, 2));
  return stats;
}

// ============================================================
// MENÚ PERSONALIZADO EN GOOGLE SHEETS
// ============================================================

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🗳️ Quien Ya Votó")
    .addItem("📋 Ver todos los usuarios (log)", "verTodosLog_")
    .addItem("📊 Ver estadísticas (log)", "verEstadisticasLog_")
    .addSeparator()
    .addItem("➕ Crear usuario de prueba", "crearUsuarioPrueba_")
    .addItem("🔍 Buscar por cédula (prompt)", "buscarPorCedulaPrompt_")
    .addItem("✏️ Actualizar estado (prompt)", "actualizarEstadoPrompt_")
    .addItem("🗑️ Eliminar usuario (prompt)", "eliminarUsuarioPrompt_")
    .addSeparator()
    .addItem("❓ Ayuda / Instrucciones", "mostrarAyuda_")
    .addToUi();
}

// ----------------------------------------------------------
// FUNCIONES AUXILIARES PARA EL MENÚ (UI)
// ----------------------------------------------------------

function verTodosLog_() {
  var usuarios = obtenerTodosLosUsuarios();
  Logger.log("Total: " + usuarios.length + " usuarios\n" + JSON.stringify(usuarios, null, 2));
  SpreadsheetApp.getUi().alert("✅ Se listaron " + usuarios.length + " usuarios en el log (Ver > Registros).");
}

function verEstadisticasLog_() {
  var stats = obtenerEstadisticas();
  var msg =
    "📊 ESTADÍSTICAS\n\n" +
    "Total usuarios: "   + stats.total       + "\n" +
    "✅ COMPLETO: "      + stats.completos   + "\n" +
    "🔄 EN PROCESO: "   + stats.enProceso   + "\n" +
    "👑 Líderes activos: " + stats.lideres  + "\n" +
    "🤝 Referidos activos: " + stats.referidos;
  SpreadsheetApp.getUi().alert(msg);
}

function crearUsuarioPrueba_() {
  var nuevoUsuario = {
    pais:           "ESPAÑA",
    ciudad:         "ALICANTE",
    nombreIglesia:  "ALICANTE",
    cedula:         "99999999",
    nombreApellido: "Usuario Prueba Test",
    celular:        "600000000",
    cedulaInscrita: "Sí",
    activoLider:    "",
    activoReferido: "Sí",
    estado:         "EN PROCESO"
  };
  try {
    var resultado = crearUsuario(nuevoUsuario);
    SpreadsheetApp.getUi().alert("✅ Usuario de prueba creado en la fila " + resultado.fila + ".\n\nCédula: 99999999\n\nPuede eliminarlo luego con el menú 'Eliminar usuario'.");
  } catch (e) {
    SpreadsheetApp.getUi().alert("❌ Error: " + e.message);
  }
}

function buscarPorCedulaPrompt_() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.prompt("🔍 Buscar usuario", "Introduce el número de cédula:", ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() === ui.Button.OK) {
    var cedula = resp.getResponseText().trim();
    var u = obtenerUsuarioPorCedula(cedula);
    if (u) {
      ui.alert(
        "✅ Usuario encontrado\n\n" +
        "Nombre: "     + u.nombreApellido  + "\n" +
        "País: "       + u.pais            + "\n" +
        "Ciudad: "     + u.ciudad          + "\n" +
        "Iglesia: "    + u.nombreIglesia   + "\n" +
        "Célula: "     + u.cedula          + "\n" +
        "Celular: "    + u.celular         + "\n" +
        "Inscrita: "   + u.cedulaInscrita  + "\n" +
        "Líder: "      + u.activoLider     + "\n" +
        "Referido: "   + u.activoReferido  + "\n" +
        "Estado: "     + u.estado
      );
    } else {
      ui.alert("⚠️ No se encontró ningún usuario con cédula: " + cedula);
    }
  }
}

function actualizarEstadoPrompt_() {
  var ui = SpreadsheetApp.getUi();
  var cedulaResp = ui.prompt("✏️ Actualizar Estado", "Introduce el número de cédula del usuario:", ui.ButtonSet.OK_CANCEL);
  if (cedulaResp.getSelectedButton() !== ui.Button.OK) return;

  var cedula = cedulaResp.getResponseText().trim();
  var estadoResp = ui.prompt("✏️ Nuevo Estado", "Introduce el nuevo estado (COMPLETO / EN PROCESO):", ui.ButtonSet.OK_CANCEL);
  if (estadoResp.getSelectedButton() !== ui.Button.OK) return;

  var nuevoEstado = estadoResp.getResponseText().trim().toUpperCase();
  if (nuevoEstado !== "COMPLETO" && nuevoEstado !== "EN PROCESO") {
    ui.alert("❌ Estado inválido. Solo se permite: COMPLETO o EN PROCESO");
    return;
  }

  try {
    var resultado = actualizarEstado(cedula, nuevoEstado);
    ui.alert("✅ Estado actualizado correctamente.\n\nUsuario: " + resultado.datos.nombreApellido + "\nNuevo estado: " + nuevoEstado);
  } catch (e) {
    ui.alert("❌ Error: " + e.message);
  }
}

function eliminarUsuarioPrompt_() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.prompt("🗑️ Eliminar Usuario", "Introduce el número de cédula del usuario a eliminar:", ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return;

  var cedula = resp.getResponseText().trim();
  var u = obtenerUsuarioPorCedula(cedula);
  if (!u) {
    ui.alert("⚠️ No se encontró ningún usuario con cédula: " + cedula);
    return;
  }

  var confirm = ui.alert(
    "⚠️ ¿Confirmar eliminación?",
    "Vas a eliminar a: " + u.nombreApellido + " (cédula: " + cedula + ")\n\n¿Estás seguro?",
    ui.ButtonSet.YES_NO
  );

  if (confirm === ui.Button.YES) {
    try {
      eliminarUsuario(cedula);
      ui.alert("✅ Usuario eliminado correctamente: " + u.nombreApellido);
    } catch (e) {
      ui.alert("❌ Error: " + e.message);
    }
  } else {
    ui.alert("🚫 Eliminación cancelada.");
  }
}

function mostrarAyuda_() {
  var msg =
    "🗳️ QUIEN YA VOTÓ - AYUDA\n\n" +
    "Este script gestiona el registro de votantes.\n\n" +
    "📌 FUNCIONES PRINCIPALES:\n\n" +
    "• crearUsuario(usuario)            → Crear nuevo registro\n" +
    "• obtenerTodosLosUsuarios()        → Listar todos los registros\n" +
    "• obtenerUsuarioPorCedula(cedula)  → Buscar por cédula\n" +
    "• buscarUsuariosPorNombre(nombre)  → Buscar por nombre\n" +
    "• filtrarPorEstado(estado)         → Filtrar: 'COMPLETO'/'EN PROCESO'\n" +
    "• filtrarPorCiudad(ciudad)         → Filtrar por ciudad\n" +
    "• actualizarUsuario(cedula, datos) → Actualizar campos\n" +
    "• actualizarEstado(cedula, estado) → Cambiar solo el estado\n" +
    "• eliminarUsuario(cedula)          → Eliminar registro\n" +
    "• obtenerEstadisticas()            → Resumen estadístico\n\n" +
    "💡 La cédula (col. D) es la clave primaria única.\n" +
    "💡 Los datos empiezan en la fila 4 (encabezados en fila 3).";
  SpreadsheetApp.getUi().alert(msg);
}

// ============================================================
// EJEMPLOS DE USO (ejecutar individualmente desde el editor)
// ============================================================

function EJEMPLO_crear() {
  var nuevoUsuario = {
    pais:           "ESPAÑA",
    ciudad:         "MADRID",
    nombreIglesia:  "MADRID CENTRO",
    cedula:         "12345678",
    nombreApellido: "Juan Pérez García",
    celular:        "34611223344",
    cedulaInscrita: "Sí",
    activoLider:    "Sí",
    activoReferido: "No",
    estado:         "COMPLETO"
  };
  var resultado = crearUsuario(nuevoUsuario);
  Logger.log("Resultado CREATE: " + JSON.stringify(resultado));
}

function EJEMPLO_leer() {
  var usuario = obtenerUsuarioPorCedula("6774089");
  Logger.log("Resultado READ: " + JSON.stringify(usuario));
}

function EJEMPLO_actualizar() {
  var resultado = actualizarUsuario("12345678", {
    celular: "34699887766",
    estado:  "COMPLETO"
  });
  Logger.log("Resultado UPDATE: " + JSON.stringify(resultado));
}

function EJEMPLO_eliminar() {
  var ok = eliminarUsuario("12345678");
  Logger.log("Resultado DELETE: " + ok);
}
