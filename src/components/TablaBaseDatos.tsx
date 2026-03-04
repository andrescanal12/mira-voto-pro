import { useState, useMemo } from "react";
import { Search, Phone, ChevronLeft, ChevronRight, MapPin, CreditCard } from "lucide-react";
import { Voter, VoterStatus } from "@/types/voter";

interface Props {
  voters: Voter[];
  onEdit: (voter: Voter) => void;
  onStatusChange?: (id: string, status: VoterStatus) => void;
}

const PAGE_SIZE = 15;

const STATUSES: { value: VoterStatus; label: string; color: string; bg: string; ring: string }[] = [
  {
    value: "Aún no ha venido",
    label: "Pendiente",
    color: "text-blue-300",
    bg: "bg-blue-500/20 hover:bg-blue-500/40",
    ring: "ring-blue-400",
  },
  {
    value: "Pendiente de llamar",
    label: "Llamar",
    color: "text-yellow-300",
    bg: "bg-yellow-500/20 hover:bg-yellow-500/40",
    ring: "ring-yellow-400",
  },
  {
    value: "Ya votó",
    label: "Ya votó ✓",
    color: "text-green-300",
    bg: "bg-green-500/20 hover:bg-green-500/40",
    ring: "ring-green-400",
  },
  {
    value: "No va votar",
    label: "No vota",
    color: "text-red-300",
    bg: "bg-red-500/20 hover:bg-red-500/40",
    ring: "ring-red-400",
  },
];

const statusBadge: Record<VoterStatus, string> = {
  "Aún no ha venido": "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  "Ya votó": "bg-green-500/20 text-green-300 border border-green-500/30",
  "Pendiente de llamar": "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  "No va votar": "bg-red-500/20 text-red-300 border border-red-500/30",
};

const TablaBaseDatos = ({ voters, onEdit, onStatusChange }: Props) => {
  const [search, setSearch] = useState("");
  const [filterCiudad, setFilterCiudad] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [page, setPage] = useState(0);

  const ciudades = useMemo(
    () => [...new Set(voters.map((v) => v.ciudad).filter(Boolean))].sort(),
    [voters]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return voters.filter((v) => {
      const matchSearch =
        !search ||
        v.nombre.toLowerCase().includes(q) ||
        v.cedula.includes(search) ||
        v.celular.includes(search);
      const matchCiudad = !filterCiudad || v.ciudad === filterCiudad;
      const matchEstado = !filterEstado || v.estado === filterEstado;
      return matchSearch && matchCiudad && matchEstado;
    });
  }, [voters, search, filterCiudad, filterEstado]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleStatusClick = (voter: Voter, status: VoterStatus) => {
    if (onStatusChange) onStatusChange(voter.id, status);
  };

  return (
    <div className="space-y-4">
      {/* ── Barra de búsqueda y filtros ── */}
      <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar nombre, cédula o teléfono…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            aria-label="Buscar votante"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterCiudad}
            onChange={(e) => { setFilterCiudad(e.target.value); setPage(0); }}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Filtrar por ciudad"
          >
            <option value="">Todas las ciudades</option>
            {ciudades.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterEstado}
            onChange={(e) => { setFilterEstado(e.target.value); setPage(0); }}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </form>

      {/* Contador */}
      <p className="text-xs text-white/50 pl-1">
        {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* ── VISTA MÓVIL: Tarjetas ── */}
      <div className="grid gap-3 md:hidden">
        {pageData.length === 0 && (
          <p className="text-center py-10 text-white/40">No se encontraron registros</p>
        )}
        {pageData.map((v) => (
          <div
            key={v.id}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-sm"
          >
            {/* Nombre + estado actual */}
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-white text-sm leading-tight">{v.nombre}</p>
              <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[v.estado]}`}>
                {v.estado === "Aún no ha venido" ? "Pendiente" :
                  v.estado === "Pendiente de llamar" ? "Llamar" :
                    v.estado === "Ya votó" ? "Ya votó ✓" : "No vota"}
              </span>
            </div>

            {/* Info compacta */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" /> {v.cedula}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {v.ciudad}
                {v.estadoInscripcion ? ` · ${v.estadoInscripcion}` : ""}
              </span>
            </div>

            {/* Teléfono */}
            {v.celular ? (
              <a
                href={`tel:${v.celular}`}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 w-fit"
              >
                <Phone className="h-3.5 w-3.5" /> {v.celular}
              </a>
            ) : null}

            {/* Botones de estado — 1 toque para cambiar */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleStatusClick(v, s.value)}
                  className={`text-[11px] font-semibold py-2 px-2 rounded-xl transition-all duration-150
                    ${v.estado === s.value
                      ? `${s.bg} ${s.color} ring-2 ${s.ring} ring-offset-1 ring-offset-transparent`
                      : `bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70`
                    }`}
                  aria-label={`Marcar como ${s.label}`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Comentario (si hay) */}
            {v.comentario && (
              <p className="text-xs text-white/40 italic border-t border-white/10 pt-2">
                💬 {v.comentario}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── VISTA ESCRITORIO: Tabla ── */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-table-header text-table-header-foreground">
              <th className="text-left px-4 py-3 font-semibold">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold">Cédula</th>
              <th className="text-left px-4 py-3 font-semibold">Ciudad · Mesa</th>
              <th className="text-left px-4 py-3 font-semibold">Teléfono</th>
              <th className="text-left px-4 py-3 font-semibold min-w-[320px]">Estado</th>
              <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Comentario</th>
            </tr>
          </thead>
          <tbody className="bg-table text-table-foreground">
            {pageData.map((v) => (
              <tr key={v.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium text-white">{v.nombre}</td>
                <td className="px-4 py-3 tabular-nums text-white/70">{v.cedula}</td>
                <td className="px-4 py-3 text-white/70">
                  {v.ciudad}{v.estadoInscripcion ? ` · ${v.estadoInscripcion}` : ""}
                </td>
                <td className="px-4 py-3">
                  {v.celular ? (
                    <a href={`tel:${v.celular}`} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                      <Phone className="h-3 w-3" />{v.celular}
                    </a>
                  ) : <span className="text-white/30">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {STATUSES.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => handleStatusClick(v, s.value)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all duration-150 cursor-pointer
                          ${v.estado === s.value
                            ? `${s.bg} ${s.color} ring-1 ${s.ring}`
                            : "bg-white/5 text-white/35 hover:bg-white/10 hover:text-white/60"
                          }`}
                        title={s.value}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-white/40 max-w-[180px] truncate">
                  {v.comentario || "—"}
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-white/30">
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Paginación ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center gap-1.5 text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2 disabled:opacity-30 hover:border-accent hover:bg-white/10 transition-colors text-white"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <span className="text-xs text-white/50">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="inline-flex items-center gap-1.5 text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2 disabled:opacity-30 hover:border-accent hover:bg-white/10 transition-colors text-white"
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TablaBaseDatos;
