import { useState, useMemo } from "react";
import { Search, Phone, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { Voter, VoterStatus } from "@/types/voter";

interface Props {
  voters: Voter[];
  onEdit: (voter: Voter) => void;
}

const PAGE_SIZE = 20;

const statusColors: Record<VoterStatus, string> = {
  "Aún no ha venido": "bg-blue-500/20 text-blue-400",
  "Ya votó": "bg-success/20 text-success",
  "Pendiente de llamar": "bg-warning/20 text-warning",
  "No va votar": "bg-destructive/20 text-destructive",
};

const TablaBaseDatos = ({ voters, onEdit }: Props) => {
  const [search, setSearch] = useState("");
  const [filterCiudad, setFilterCiudad] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [page, setPage] = useState(0);

  const ciudades = useMemo(
    () => [...new Set(voters.map((v) => v.ciudad).filter(Boolean))].sort(),
    [voters]
  );

  const filtered = useMemo(() => {
    return voters.filter((v) => {
      const matchSearch =
        !search ||
        v.nombre.toLowerCase().includes(search.toLowerCase()) ||
        v.cedula.includes(search) ||
        v.celular.includes(search);
      const matchCiudad = !filterCiudad || v.ciudad === filterCiudad;
      const matchEstado = !filterEstado || v.estado === filterEstado;
      return matchSearch && matchCiudad && matchEstado;
    });
  }, [voters, search, filterCiudad, filterEstado]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por nombre, cédula o teléfono..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
            aria-label="Buscar votante"
          />
        </div>
        <select
          value={filterCiudad}
          onChange={(e) => { setFilterCiudad(e.target.value); setPage(0); }}
          className="bg-card border border-border rounded-2xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Filtrar por ciudad"
        >
          <option value="">Todas las ciudades</option>
          {ciudades.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filterEstado}
          onChange={(e) => { setFilterEstado(e.target.value); setPage(0); }}
          className="bg-card border border-border rounded-2xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          <option value="Aún no ha venido">Aún no ha venido</option>
          <option value="Pendiente de llamar">Falta llamar</option>
          <option value="Ya votó">Ya votó</option>
          <option value="No va votar">No va votar</option>
        </select>
      </form>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-table-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-table-header text-table-header-foreground">
              <th className="text-left px-4 py-3 font-semibold">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold">Cédula</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Ciudad</th>
              <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Mesa</th>
              <th className="text-left px-4 py-3 font-semibold">Teléfono</th>
              <th className="text-left px-4 py-3 font-semibold">Estado</th>
              <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Comentario</th>
              <th className="text-center px-4 py-3 font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody className="bg-table text-table-foreground">
            {pageData.map((v) => (
              <tr key={v.id} className="border-t border-table-border hover:bg-table-hover transition-colors">
                <td className="px-4 py-3 font-medium">{v.nombre}</td>
                <td className="px-4 py-3 tabular-nums">{v.cedula}</td>
                <td className="px-4 py-3 hidden md:table-cell">{v.ciudad}</td>
                <td className="px-4 py-3 hidden md:table-cell text-xs font-medium">{v.estadoInscripcion || "—"}</td>
                <td className="px-4 py-3">
                  {v.celular ? (
                    <a
                      href={`tel:${v.celular}`}
                      className="inline-flex items-center gap-1 text-mira-blue-light hover:text-accent transition-colors"
                      aria-label={`Llamar a ${v.nombre}`}
                    >
                      <Phone className="h-3 w-3" />
                      {v.celular}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[v.estado]}`}>
                    {v.estado}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground max-w-[200px] truncate">
                  {v.comentario || "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEdit(v)}
                    className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-2 py-1 rounded-lg transition-colors"
                    aria-label={`Editar ${v.nombre}`}
                  >
                    <Edit2 className="h-3 w-3" />
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {
        totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1 text-sm bg-card border border-border rounded-xl px-3 py-2 disabled:opacity-40 hover:border-accent transition-colors text-foreground"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>
            <span className="text-xs text-muted-foreground">
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="inline-flex items-center gap-1 text-sm bg-card border border-border rounded-xl px-3 py-2 disabled:opacity-40 hover:border-accent transition-colors text-foreground"
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )
      }
    </div >
  );
};

export default TablaBaseDatos;
