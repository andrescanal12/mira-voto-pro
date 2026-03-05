import { useState, useMemo } from "react";
import { Search, Phone, ChevronLeft, ChevronRight, MapPin, CreditCard, Save, CheckCircle2 } from "lucide-react";
import { Voter, VoterStatus } from "@/types/voter";

interface Props {
  voters: Voter[];
  onEdit: (voter: Voter) => void;
  onStatusChange?: (id: string, status: VoterStatus) => void;
  onCommentChange?: (id: string, comment: string) => void;
}

const PAGE_SIZE = 15;

const STATUSES: { value: VoterStatus; label: string; active: string; inactive: string }[] = [
  { value: "Aún no ha venido", label: "Pendiente", active: "bg-blue-600 text-white border-transparent", inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200" },
  { value: "Pendiente de llamar", label: "📞 Llamar", active: "bg-yellow-400 text-black border-transparent", inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200" },
  { value: "Ya votó", label: "✅ Ya votó", active: "bg-green-600 text-white border-transparent", inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200" },
  { value: "No va votar", label: "✗ No vota", active: "bg-red-600 text-white border-transparent", inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200" },
];

const statusBadge: Record<VoterStatus, string> = {
  "Aún no ha venido": "bg-blue-100  text-blue-700  border border-blue-300",
  "Ya votó": "bg-green-100 text-green-700 border border-green-300",
  "Pendiente de llamar": "bg-yellow-100 text-yellow-700 border border-yellow-300",
  "No va votar": "bg-red-100   text-red-700   border border-red-300",
};

const statusPill: Record<VoterStatus, string> = {
  "Aún no ha venido": "bg-blue-600   text-white",
  "Ya votó": "bg-green-600  text-white",
  "Pendiente de llamar": "bg-yellow-400 text-black",
  "No va votar": "bg-red-600    text-white",
};

const TablaBaseDatos = ({ voters, onStatusChange, onCommentChange }: Props) => {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [page, setPage] = useState(0);

  // Estado pendiente de guardar: id → { status?, comment?, saved }
  const [pending, setPending] = useState<Record<string, { status?: VoterStatus; comment?: string; saved?: boolean }>>({});

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return voters.filter((v) => {
      const matchSearch =
        !search ||
        v.nombre.toLowerCase().includes(q) ||
        v.cedula.includes(search) ||
        v.celular.includes(search);
      const matchEstado = !filterEstado || v.estado === filterEstado;
      return matchSearch && matchEstado;
    });
  }, [voters, search, filterEstado]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // El usuario selecciona un estado → queda "pendiente"
  const handleStatusSelect = (id: string, status: VoterStatus, currentStatus: VoterStatus) => {
    if (status === currentStatus) return; // sin cambio, ignorar
    setPending((prev) => ({ ...prev, [id]: { ...prev[id], status, saved: false } }));
  };

  // El usuario escribe un comentario → queda "pendiente"
  const handleCommentEdit = (id: string, comment: string) => {
    setPending((prev) => ({ ...prev, [id]: { ...prev[id], comment, saved: false } }));
  };

  // Guardar todos los cambios pendientes del voter id
  const handleSave = (id: string) => {
    const p = pending[id];
    if (!p) return;
    if (p.status !== undefined && onStatusChange) onStatusChange(id, p.status);
    if (p.comment !== undefined && onCommentChange) onCommentChange(id, p.comment);
    // Marcar como guardado con feedback visual y limpiar después de 1.5s
    setPending((prev) => ({ ...prev, [id]: { ...prev[id], saved: true } }));
    setTimeout(() => {
      setPending((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    }, 1500);
  };

  return (
    <div className="space-y-4">

      {/* ── Filtros ── */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Buscar nombre, cedula o telefono..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all border border-white/15"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => { setFilterEstado(e.target.value); setPage(0); }}
          className="w-full rounded-xl px-3 py-2.5 text-sm text-white border border-white/15 focus:outline-none focus:ring-2 focus:ring-accent"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <option value="">📋 Todos los estados</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <p className="text-xs text-white/50 pl-1">
        {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* ══════════════════════════════
          MÓVIL — Tarjetas Blancas
      ══════════════════════════════ */}
      <div className="grid gap-3 md:hidden">
        {pageData.length === 0 && (
          <p className="text-center py-10 text-white/40">No se encontraron registros</p>
        )}
        {pageData.map((v) => {
          const p = pending[v.id];
          const currentStatus = p?.status ?? v.estado;
          const currentComment = p?.comment ?? v.comentario ?? "";
          const hasPending = p && !p.saved && (p.status !== undefined || p.comment !== undefined);
          const justSaved = p?.saved;

          return (
            <div
              key={v.id}
              className={`rounded-2xl p-4 space-y-3 border shadow-sm transition-all duration-300 ${hasPending ? "border-yellow-400 ring-1 ring-yellow-300" : "border-gray-200"}`}
              style={{ background: "#fff" }}
            >
              {/* Nombre + badge */}
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-gray-900 text-[15px] leading-tight">{v.nombre}</p>
                <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${statusBadge[currentStatus]}`}>
                  {currentStatus === "Aún no ha venido" ? "Pendiente" :
                    currentStatus === "Pendiente de llamar" ? "📞 Llamar" :
                      currentStatus === "Ya votó" ? "✅ Votó" : "✗ No vota"}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> {v.cedula}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {v.ciudad}{v.estadoInscripcion ? ` · ${v.estadoInscripcion}` : ""}
                </span>
              </div>

              {v.celular && (
                <a href={`tel:${v.celular}`} className="flex items-center gap-1.5 text-xs text-blue-600 font-medium w-fit">
                  <Phone className="h-3.5 w-3.5" /> {v.celular}
                </a>
              )}

              {/* Botones estado */}
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => handleStatusSelect(v.id, s.value, v.estado)}
                    className={`text-[12px] font-bold py-2.5 px-3 rounded-xl transition-all duration-150 border ${currentStatus === s.value ? s.active : s.inactive}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Comentario + botón Guardar */}
              <div className="flex gap-2 pt-1 border-t border-gray-100">
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Escribe un comentario..."
                  value={currentComment}
                  onChange={(e) => handleCommentEdit(v.id, e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSave(v.id); } }}
                  className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{ background: "#f9fafb" }}
                />
                {justSaved ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-2 rounded-xl text-white bg-green-500 transition-all">
                    <CheckCircle2 className="h-3.5 w-3.5" /> ¡Listo!
                  </span>
                ) : hasPending ? (
                  <button
                    type="button"
                    onClick={() => handleSave(v.id)}
                    className="flex items-center gap-1 text-[11px] font-bold px-3 py-2 rounded-xl text-white animate-pulse"
                    style={{ background: "#1a3a6e" }}
                  >
                    <Save className="h-3.5 w-3.5" /> Guardar
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════
          ESCRITORIO — Tabla Blanca
      ══════════════════════════════ */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 shadow-lg" style={{ background: "#fff" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#1a3a6e" }}>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider">Nombre</th>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider">Cédula</th>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider">Ciudad · Mesa</th>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider">Teléfono</th>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider min-w-[320px]">Estado</th>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider min-w-[220px]">Comentario / Guardar</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((v, idx) => {
              const p = pending[v.id];
              const currentStatus = p?.status ?? v.estado;
              const currentComment = p?.comment ?? v.comentario ?? "";
              const hasPending = p && !p.saved && (p.status !== undefined || p.comment !== undefined);
              const justSaved = p?.saved;

              return (
                <tr
                  key={v.id}
                  className={`hover:bg-blue-50 transition-colors ${hasPending ? "bg-yellow-50 ring-1 ring-inset ring-yellow-300" : ""}`}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    background: hasPending ? "#fefce8" : idx % 2 === 0 ? "#fff" : "#f9fafb",
                  }}
                >
                  <td className="px-5 py-3 font-semibold text-gray-900">{v.nombre}</td>
                  <td className="px-5 py-3 tabular-nums text-gray-500 text-xs">{v.cedula}</td>
                  <td className="px-5 py-3 text-gray-600 text-xs">
                    {v.ciudad}{v.estadoInscripcion ? ` · ${v.estadoInscripcion}` : ""}
                  </td>
                  <td className="px-5 py-3">
                    {v.celular ? (
                      <a href={`tel:${v.celular}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors">
                        <Phone className="h-3 w-3" /> {v.celular}
                      </a>
                    ) : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {STATUSES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => handleStatusSelect(v.id, s.value, v.estado)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer border ${currentStatus === s.value
                            ? `${statusPill[currentStatus]} border-transparent`
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 border-gray-200"
                            }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        autoComplete="off"
                        value={currentComment}
                        placeholder="Comentario..."
                        onChange={(e) => handleCommentEdit(v.id, e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSave(v.id); } }}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        style={{ maxWidth: 130 }}
                      />
                      {justSaved ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg text-white bg-green-500 whitespace-nowrap">
                          <CheckCircle2 className="h-3 w-3" /> ¡Listo!
                        </span>
                      ) : hasPending ? (
                        <button
                          type="button"
                          onClick={() => handleSave(v.id)}
                          className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg text-white whitespace-nowrap animate-pulse"
                          style={{ background: "#1a3a6e" }}
                        >
                          <Save className="h-3 w-3" /> Guardar
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center gap-1.5 text-sm rounded-xl px-4 py-2 disabled:opacity-30 transition-colors text-white border border-white/15 hover:border-white/30"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <span className="text-xs text-white/50">{page + 1} / {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="inline-flex items-center gap-1.5 text-sm rounded-xl px-4 py-2 disabled:opacity-30 transition-colors text-white border border-white/15 hover:border-white/30"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TablaBaseDatos;
