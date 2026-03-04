import { useState, useMemo } from "react";
import { Phone, Save, Search, ChevronLeft, ChevronRight, MapPin, CreditCard } from "lucide-react";
import { Voter, VoterStatus } from "@/types/voter";

interface Props {
  voters: Voter[];
  onUpdateStatus: (id: string, status: VoterStatus) => void;
  onUpdateComment: (id: string, comment: string) => void;
}

const PAGE_SIZE = 15;

const PendientesModule = ({ voters, onUpdateStatus, onUpdateComment }: Props) => {
  const pendientes = useMemo(
    () => voters.filter((v) => v.estado === "Pendiente de llamar" || v.estado === "Aún no ha venido"),
    [voters]
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [localChanges, setLocalChanges] = useState<Record<string, { status?: VoterStatus; comment?: string }>>({});

  const filtered = useMemo(() => {
    if (!search) return pendientes;
    const s = search.toLowerCase();
    return pendientes.filter(
      (v) =>
        v.nombre.toLowerCase().includes(s) ||
        v.cedula.includes(search) ||
        v.ciudad.toLowerCase().includes(s)
    );
  }, [pendientes, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSave = (voter: Voter) => {
    const changes = localChanges[voter.id];
    if (!changes) return;
    if (changes.status) onUpdateStatus(voter.id, changes.status);
    if (changes.comment !== undefined) onUpdateComment(voter.id, changes.comment);
    setLocalChanges((prev) => {
      const next = { ...prev };
      delete next[voter.id];
      return next;
    });
  };

  return (
    <div className="space-y-4">

      {/* Header barra */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o ciudad..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all border border-white/15"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
        </div>
        <span className="text-sm text-yellow-300 font-bold whitespace-nowrap bg-yellow-500/15 border border-yellow-500/30 px-3 py-1.5 rounded-xl">
          📞 {pendientes.length} pendientes
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {pageData.map((voter) => {
          const changes = localChanges[voter.id] || {};
          const hasChanges = changes.status || changes.comment !== undefined;

          return (
            <div
              key={voter.id}
              className="rounded-2xl p-4 border border-white/10 backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              {/* Fila superior: nombre + botón llamar */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-base leading-tight">{voter.nombre}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-white/55">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" /> {voter.cedula}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {voter.ciudad}{voter.estadoInscripcion ? ` · ${voter.estadoInscripcion}` : ""}
                    </span>
                  </div>
                </div>

                {/* ── BOTÓN LLAMAR GRANDE ── */}
                {voter.celular ? (
                  <a
                    href={`tel:${voter.celular}`}
                    className="shrink-0 flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-2.5 font-bold text-white shadow-lg text-center transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #16a34a, #15803d)",
                      minWidth: 90,
                      boxShadow: "0 4px 14px rgba(22,163,74,0.4)"
                    }}
                    aria-label={`Llamar a ${voter.nombre}`}
                  >
                    <Phone className="h-5 w-5" />
                    <span className="text-[11px] font-black tracking-wide">LLAMAR</span>
                    <span className="text-[10px] font-bold opacity-90">{voter.celular}</span>
                  </a>
                ) : (
                  <div className="shrink-0 flex flex-col items-center gap-1 rounded-2xl px-4 py-2.5 opacity-40"
                    style={{ background: "rgba(255,255,255,0.1)", minWidth: 90 }}>
                    <Phone className="h-5 w-5 text-white" />
                    <span className="text-[10px] text-white">Sin número</span>
                  </div>
                )}
              </div>

              {/* Selectores de estado rápidos */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {([
                  { v: "Aún no ha venido", label: "⏳ Pendiente", cls: "bg-blue-600 text-white ring-2 ring-blue-400" },
                  { v: "Pendiente de llamar", label: "📞 Llamar", cls: "bg-yellow-500 text-black ring-2 ring-yellow-300" },
                  { v: "Ya votó", label: "✅ Ya votó", cls: "bg-green-600 text-white ring-2 ring-green-400" },
                  { v: "No va votar", label: "✗ No vota", cls: "bg-red-600 text-white ring-2 ring-red-400" },
                ] as const).map((s) => {
                  const currentStatus = changes.status || voter.estado;
                  return (
                    <button
                      key={s.v}
                      onClick={() => {
                        const newChanges = { ...localChanges, [voter.id]: { ...localChanges[voter.id], status: s.v as VoterStatus } };
                        setLocalChanges(newChanges);
                        // Guardado inmediato al tocar
                        onUpdateStatus(voter.id, s.v as VoterStatus);
                        setLocalChanges((prev) => {
                          const next = { ...prev };
                          if (next[voter.id]) delete next[voter.id].status;
                          return next;
                        });
                      }}
                      className={`text-[11px] font-bold py-2 px-2 rounded-xl transition-all duration-150 ${currentStatus === s.v
                          ? s.cls
                          : "bg-white/8 text-white/60 hover:bg-white/15 hover:text-white"
                        }`}
                      style={currentStatus !== s.v ? { background: "rgba(255,255,255,0.07)" } : {}}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>

              {/* Comentario */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="💬 Agregar nota o comentario..."
                  value={changes.comment ?? voter.comentario}
                  onChange={(e) =>
                    setLocalChanges((prev) => ({
                      ...prev,
                      [voter.id]: { ...prev[voter.id], comment: e.target.value },
                    }))
                  }
                  className="flex-1 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-accent border border-white/10"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <button
                  onClick={() => handleSave(voter)}
                  disabled={!hasChanges}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-25 transition-all hover:scale-105"
                  style={{ background: hasChanges ? "linear-gradient(135deg,#FFD700,#f59e0b)" : "rgba(255,255,255,0.1)", color: hasChanges ? "#000" : "#fff" }}
                >
                  <Save className="h-3 w-3" /> Guardar
                </button>
              </div>
            </div>
          );
        })}

        {pageData.length === 0 && (
          <div className="text-center py-16 text-white/35">
            <Phone className="h-14 w-14 mx-auto mb-4 opacity-30" />
            <p className="text-base font-semibold">¡Sin pendientes!</p>
            <p className="text-sm mt-1 opacity-70">Todos han sido contactados</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center gap-1 text-sm rounded-xl px-4 py-2 disabled:opacity-30 transition-colors text-white border border-white/15"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <span className="text-xs text-white/50">Página {page + 1} de {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="inline-flex items-center gap-1 text-sm rounded-xl px-4 py-2 disabled:opacity-30 transition-colors text-white border border-white/15"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PendientesModule;
