import { useState, useMemo } from "react";
import { Search, Phone, ChevronLeft, ChevronRight, MapPin, CreditCard } from "lucide-react";
import { Voter, VoterStatus } from "@/types/voter";

interface Props {
  voters: Voter[];
  onEdit: (voter: Voter) => void;
  onStatusChange?: (id: string, status: VoterStatus) => void;
}

const PAGE_SIZE = 15;

const STATUSES: { value: VoterStatus; label: string; active: string; inactive: string }[] = [
  {
    value: "Aún no ha venido",
    label: "Pendiente",
    active: "bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-1 ring-offset-black/30",
    inactive: "bg-white/10 text-white/70 hover:bg-white/20",
  },
  {
    value: "Pendiente de llamar",
    label: "📞 Llamar",
    active: "bg-yellow-500 text-black ring-2 ring-yellow-300 ring-offset-1 ring-offset-black/30",
    inactive: "bg-white/10 text-white/70 hover:bg-white/20",
  },
  {
    value: "Ya votó",
    label: "✅ Ya votó",
    active: "bg-green-600 text-white ring-2 ring-green-400 ring-offset-1 ring-offset-black/30",
    inactive: "bg-white/10 text-white/70 hover:bg-white/20",
  },
  {
    value: "No va votar",
    label: "✗ No vota",
    active: "bg-red-600 text-white ring-2 ring-red-400 ring-offset-1 ring-offset-black/30",
    inactive: "bg-white/10 text-white/70 hover:bg-white/20",
  },
];

const statusBadge: Record<VoterStatus, string> = {
  "Aún no ha venido": "bg-blue-500/20  text-blue-200  border border-blue-500/40",
  "Ya votó": "bg-green-500/20 text-green-200 border border-green-500/40",
  "Pendiente de llamar": "bg-yellow-500/20 text-yellow-200 border border-yellow-500/40",
  "No va votar": "bg-red-500/20   text-red-200   border border-red-500/40",
};

const statusPill: Record<VoterStatus, string> = {
  "Aún no ha venido": "bg-blue-600   text-white",
  "Ya votó": "bg-green-600  text-white",
  "Pendiente de llamar": "bg-yellow-500 text-black",
  "No va votar": "bg-red-600    text-white",
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

  const handleStatus = (voter: Voter, status: VoterStatus) => {
    if (onStatusChange) onStatusChange(voter.id, status);
  };

  return (
    <div className="space-y-4">

      {/* ── Filtros ── */}
      <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="search"
            placeholder="Buscar nombre, cédula o teléfono…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-3 bg-white/8 border border-white/15 rounded-2xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <select
            value={filterCiudad}
            onChange={(e) => { setFilterCiudad(e.target.value); setPage(0); }}
            className="w-full rounded-xl px-3 py-2.5 text-sm text-white border border-white/15 focus:outline-none focus:ring-2 focus:ring-accent"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <option value="">🏙️ Todas las ciudades</option>
            {ciudades.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
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
      </form>

      {/* Contador */}
      <p className="text-xs text-white/50 pl-1">
        {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* ══════════════════════════════
          MÓVIL — Tarjetas
      ══════════════════════════════ */}
      <div className="grid gap-3 md:hidden">
        {pageData.length === 0 && (
          <p className="text-center py-10 text-white/40">No se encontraron registros</p>
        )}
        {pageData.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl p-4 space-y-3 backdrop-blur-sm border border-white/10"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {/* Nombre + badge */}
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-white text-[15px] leading-tight">{v.nombre}</p>
              <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${statusBadge[v.estado]}`}>
                {v.estado === "Aún no ha venido" ? "Pendiente" :
                  v.estado === "Pendiente de llamar" ? "📞 Llamar" :
                    v.estado === "Ya votó" ? "✅ Votó" : "✗ No vota"}
              </span>
            </div>

            {/* Datos */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" /> {v.cedula}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {v.ciudad}{v.estadoInscripcion ? ` · ${v.estadoInscripcion}` : ""}
              </span>
            </div>

            {/* Teléfono */}
            {v.celular && (
              <a href={`tel:${v.celular}`} className="flex items-center gap-1.5 text-xs text-blue-300 w-fit font-medium">
                <Phone className="h-3.5 w-3.5" /> {v.celular}
              </a>
            )}

            {/* ── 4 botones de estado 1-toque ── */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleStatus(v, s.value)}
                  className={`text-[12px] font-bold py-2.5 px-3 rounded-xl transition-all duration-150 ${v.estado === s.value ? s.active : s.inactive
                    }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Comentario */}
            {v.comentario && (
              <p className="text-xs text-white/40 italic border-t border-white/10 pt-2">
                💬 {v.comentario}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ══════════════════════════════
          ESCRITORIO — Tabla Premium
      ══════════════════════════════ */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 shadow-lg" style={{ background: "#fff" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#1a3a6e" }}>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider">Nombre</th>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider">Cédula</th>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider">Ciudad · Mesa</th>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider">Teléfono</th>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider min-w-[340px]">Estado</th>
              <th className="text-left px-5 py-3.5 text-white font-semibold text-xs uppercase tracking-wider hidden lg:table-cell">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((v, idx) => (
              <tr
                key={v.id}
                className="hover:bg-blue-50 transition-colors"
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  background: idx % 2 === 0 ? "#fff" : "#f9fafb",
                }}
              >
                <td className="px-5 py-3.5 font-semibold text-gray-900">{v.nombre}</td>
                <td className="px-5 py-3.5 tabular-nums text-gray-500 text-xs">{v.cedula}</td>
                <td className="px-5 py-3.5 text-gray-600 text-xs">
                  {v.ciudad}{v.estadoInscripcion ? ` · ${v.estadoInscripcion}` : ""}
                </td>
                <td className="px-5 py-3.5">
                  {v.celular ? (
                    <a href={`tel:${v.celular}`} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors">
                      <Phone className="h-3 w-3" /> {v.celular}
                    </a>
                  ) : <span className="text-gray-400 text-xs">—</span>}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5 flex-wrap">
                    {STATUSES.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => handleStatus(v, s.value)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${v.estado === s.value
                          ? statusPill[v.estado]
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                          }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell text-xs text-gray-400 max-w-[160px] truncate">
                  {v.comentario || "—"}
                </td>
              </tr>
            ))}
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

      {/* ── Paginación ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center gap-1.5 text-sm rounded-xl px-4 py-2 disabled:opacity-30 transition-colors text-white border border-white/15 hover:border-white/30"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <span className="text-xs text-white/50">{page + 1} / {totalPages}</span>
          <button
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
