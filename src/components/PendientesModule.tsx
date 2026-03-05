import { useState, useMemo } from "react";
import { Phone, Save, Search, ChevronLeft, ChevronRight, MapPin, CreditCard, CheckCircle2, Users } from "lucide-react";
import { Voter, VoterStatus } from "@/types/voter";
import LeaderReferralsDialog from "./LeaderReferralsDialog";

interface Props {
  voters: Voter[];
  onUpdateStatus: (id: string, status: VoterStatus) => void;
  onUpdateComment: (id: string, comment: string) => void;
}

const PAGE_SIZE = 15;

const STATUSES = [
  { v: "Aún no ha venido" as VoterStatus, label: "⏳ Pendiente", active: "bg-blue-600 text-white border-transparent", inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200" },
  { v: "Pendiente de llamar" as VoterStatus, label: "📞 Llamar", active: "bg-yellow-400 text-black border-transparent", inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200" },
  { v: "Ya llamado" as VoterStatus, label: "☎️ Ya llamado", active: "bg-purple-600 text-white border-transparent", inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200" },
  { v: "Ya votó" as VoterStatus, label: "✅ Ya votó", active: "bg-green-600 text-white border-transparent", inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200" },
  { v: "No va votar" as VoterStatus, label: "✗ No vota", active: "bg-red-600 text-white border-transparent", inactive: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200" },
];

const PendientesModule = ({ voters, onUpdateStatus, onUpdateComment }: Props) => {
  const pendientes = useMemo(
    () => voters.filter((v) => v.estado === "Pendiente de llamar" || v.estado === "Aún no ha venido"),
    [voters]
  );

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [page, setPage] = useState(0);
  const [selectedLeader, setSelectedLeader] = useState<string | null>(null);

  // Mapa de líderes y cantidad de referidos (O(N^2) aceptable para ~400 registros)
  const referralsCountMap = useMemo(() => {
    const map = new Map<string, number>();
    voters.forEach(leader => {
      const leaderName = leader.nombre;
      const ln = leaderName.toLowerCase();
      let count = 0;
      voters.forEach(v => {
        if (v.lider && v.lider.toLowerCase().includes(ln) && v.nombre !== leaderName) {
          count++;
        }
      });
      if (count > 0) {
        map.set(leaderName, count);
      }
    });
    return map;
  }, [voters]);

  // pendingChanges: id → { status?, comment?, saved? }
  const [pendingChanges, setPendingChanges] = useState<Record<string, { status?: VoterStatus; comment?: string; saved?: boolean }>>({});

  const filtered = useMemo(() => {
    return pendientes.filter((v) => {
      const s = search.toLowerCase();
      const matchSearch =
        !search ||
        v.nombre.toLowerCase().includes(s) ||
        v.cedula.includes(search) ||
        v.celular.includes(search) ||
        v.ciudad.toLowerCase().includes(s); // Retained city search from original
      const matchRole = !filterRole || (filterRole === "lider" && referralsCountMap.has(v.nombre));
      return matchSearch && matchRole;
    });
  }, [pendientes, search, filterRole, referralsCountMap]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Seleccionar estado → queda pendiente hasta que se guarde
  const handleStatusSelect = (id: string, status: VoterStatus, currentStatus: VoterStatus) => {
    if (status === currentStatus) return;
    setPendingChanges((prev) => ({ ...prev, [id]: { ...prev[id], status, saved: false } }));
  };

  // Editar comentario → queda pendiente
  const handleCommentEdit = (id: string, comment: string) => {
    setPendingChanges((prev) => ({ ...prev, [id]: { ...prev[id], comment, saved: false } }));
  };

  // Guardar todos los cambios pendientes del voter
  const handleSave = (id: string, currentComment: string) => {
    const p = pendingChanges[id];
    if (!p) return;

    // VALIDACIÓN: Comentario obligatorio solo si hay cambios o si se intenta guardar
    if (!currentComment || currentComment.trim() === "") {
      alert("⚠️ El comentario es obligatorio para registrar la llamada.");
      return;
    }

    if (p.status !== undefined) onUpdateStatus(id, p.status);
    if (p.comment !== undefined) onUpdateComment(id, p.comment);

    // Feedback visual "¡Listo!" durante 1.5s
    setPendingChanges((prev) => ({ ...prev, [id]: { ...prev[id], saved: true } }));
    setTimeout(() => {
      setPendingChanges((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    }, 1500);
  };

  return (
    <div className="space-y-4">

      {/* Header de Filtros Profesional */}
      <div className="flex flex-col gap-3">
        {/* Línea 1: Buscador Principal */}
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o teléfono..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent border border-white/20 transition-all shadow-lg"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* Línea 2: Filtro de Rol y Contador */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={filterRole}
              onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}
              className="w-full rounded-2xl px-4 py-3 text-sm text-white border border-white/15 focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em] pr-10 shadow-inner"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`
              }}
            >
              <option value="" style={{ color: "black" }}>👥 Mostrar Todos</option>
              <option value="lider" style={{ color: "black" }}>👑 Ver solo Líderes</option>
            </select>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-sm text-yellow-300 font-bold bg-yellow-500/20 border border-yellow-500/40 px-4 py-3 rounded-2xl shadow-inner">
            <Phone className="h-4 w-4 animate-pulse" />
            <span>{pendientes.length}</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {pageData.map((voter) => {
          const p = pendingChanges[voter.id];
          const currentStatus = p?.status ?? voter.estado;
          const currentComment = p?.comment ?? voter.comentario ?? "";
          const hasPending = p && !p.saved && (p.status !== undefined || p.comment !== undefined);
          const justSaved = p?.saved;
          const isCommentEmpty = !currentComment || currentComment.trim() === "";

          return (
            <div
              key={voter.id}
              className={`rounded-2xl p-4 space-y-3 shadow-sm transition-all duration-300 ${hasPending
                ? "border-2 border-yellow-400 ring-1 ring-yellow-300"
                : "border border-gray-200"
                }`}
              style={{ background: "#fff" }}
            >
              {/* Fila superior: info + llamar */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 text-base leading-tight">{voter.nombre}</p>
                      {hasPending && (
                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-0.5 rounded-full animate-pulse">
                          ⚠ Sin guardar
                        </span>
                      )}
                    </div>

                    {/* Etiquetas de Líder y Referido */}
                    <div className="flex flex-wrap gap-2">
                      {referralsCountMap.has(voter.nombre) && (
                        <button
                          onClick={() => setSelectedLeader(voter.nombre)}
                          className="flex items-center gap-1.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors shadow-sm"
                        >
                          <Users className="h-3 w-3" /> Ver Referidos ({referralsCountMap.get(voter.nombre)})
                        </button>
                      )}
                      {voter.lider && voter.lider !== "Líder Principal" && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full">
                          👤 Líder: {voter.lider}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" /> {voter.cedula}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {voter.ciudad}{voter.estadoInscripcion ? ` · ${voter.estadoInscripcion}` : ""}
                    </span>
                  </div>
                </div>

                {/* Botón LLAMAR */}
                {voter.celular ? (
                  <a
                    href={`tel:${voter.celular}`}
                    className="shrink-0 flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-2.5 text-white shadow transition-all hover:scale-105 active:scale-95 text-center"
                    style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", minWidth: 88, boxShadow: "0 4px 14px rgba(22,163,74,0.35)" }}
                  >
                    <Phone className="h-5 w-5" />
                    <span className="text-[11px] font-black tracking-wide">LLAMAR</span>
                    <span className="text-[10px] font-bold opacity-90">{voter.celular}</span>
                  </a>
                ) : (
                  <div className="shrink-0 flex flex-col items-center gap-1 rounded-2xl px-4 py-2.5 bg-gray-100 text-gray-400" style={{ minWidth: 88 }}>
                    <Phone className="h-5 w-5" />
                    <span className="text-[10px]">Sin número</span>
                  </div>
                )}
              </div>

              {/* Botones de estado */}
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.v}
                    type="button"
                    onClick={() => handleStatusSelect(voter.id, s.v, voter.estado)}
                    className={`text-[12px] font-bold py-2.5 px-3 rounded-xl transition-all duration-150 border ${currentStatus === s.v ? s.active : s.inactive}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Comentario + Guardar */}
              <div className="flex flex-col gap-2 pt-1 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="💬 Nota obligatoria tras la llamada..."
                    value={currentComment}
                    onChange={(e) => handleCommentEdit(voter.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSave(voter.id, currentComment);
                      }
                    }}
                    className={`flex-1 text-xs border rounded-xl px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${isCommentEmpty && hasPending ? "border-red-300 bg-red-50 focus:ring-red-400" : "border-gray-200 bg-[#f9fafb] focus:ring-blue-400"
                      }`}
                  />
                  {justSaved ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-2 rounded-xl text-white bg-green-500 transition-all">
                      <CheckCircle2 className="h-3.5 w-3.5" /> ¡Listo!
                    </span>
                  ) : hasPending ? (
                    <button
                      type="button"
                      onClick={() => handleSave(voter.id, currentComment)}
                      disabled={isCommentEmpty}
                      className={`flex items-center gap-1 text-[11px] font-bold px-4 py-2 rounded-xl text-white whitespace-nowrap transition-all ${isCommentEmpty ? "bg-gray-400 cursor-not-allowed" : "bg-[#1a3a6e] shadow-md animate-pulse"
                        }`}
                    >
                      <Save className="h-3.5 w-3.5" /> Guardar
                    </button>
                  ) : null}
                </div>
                {isCommentEmpty && hasPending && (
                  <p className="text-[10px] text-red-500 font-bold px-1">⚠️ Debes escribir un comentario antes de guardar.</p>
                )}
              </div>
            </div>
          );
        })}

        {pageData.length === 0 && (
          <div className="text-center py-16 text-white/40">
            <Phone className="h-14 w-14 mx-auto mb-4 opacity-30" />
            <p className="text-base font-semibold">
              {search ? "Sin resultados para esa búsqueda" : "¡Sin pendientes!"}
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center gap-1 text-sm rounded-xl px-4 py-2 disabled:opacity-30 text-white border border-white/15"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <span className="text-xs text-white/50">Página {page + 1} de {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="inline-flex items-center gap-1 text-sm rounded-xl px-4 py-2 disabled:opacity-30 text-white border border-white/15"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
      {selectedLeader && (
        <LeaderReferralsDialog
          leaderName={selectedLeader}
          allVoters={voters}
          onClose={() => setSelectedLeader(null)}
          onStatusChange={onUpdateStatus}
          onCommentChange={onUpdateComment}
        />
      )}
    </div>
  );
};

export default PendientesModule;
