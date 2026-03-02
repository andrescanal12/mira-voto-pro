import { useState, useMemo } from "react";
import { Phone, Save, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Voter, VoterStatus } from "@/types/voter";

interface Props {
  voters: Voter[];
  onUpdateStatus: (id: string, status: VoterStatus) => void;
  onUpdateComment: (id: string, comment: string) => void;
}

const PAGE_SIZE = 15;

const PendientesModule = ({ voters, onUpdateStatus, onUpdateComment }: Props) => {
  const pendientes = useMemo(
    () => voters.filter((v) => v.estado === "Pendiente de llamar"),
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
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar pendientes..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Buscar en pendientes"
          />
        </div>
        <span className="text-sm text-accent font-bold whitespace-nowrap">
          {pendientes.length} pendientes
        </span>
      </div>

      <div className="space-y-3">
        {pageData.map((voter) => {
          const changes = localChanges[voter.id] || {};
          const hasChanges = changes.status || changes.comment !== undefined;

          return (
            <div
              key={voter.id}
              className="bg-card border border-border rounded-2xl p-4 hover:border-accent/40 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{voter.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    CC: {voter.cedula} · {voter.ciudad}
                  </p>
                </div>

                {voter.celular && (
                  <a
                    href={`tel:${voter.celular}`}
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-accent hover:text-accent-foreground text-primary-foreground px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0"
                    aria-label={`Llamar a ${voter.nombre}`}
                  >
                    <Phone className="h-3 w-3" />
                    {voter.celular}
                  </a>
                )}

                <select
                  value={changes.status || voter.estado}
                  onChange={(e) =>
                    setLocalChanges((prev) => ({
                      ...prev,
                      [voter.id]: { ...prev[voter.id], status: e.target.value as VoterStatus },
                    }))
                  }
                  className="bg-muted border border-border rounded-xl px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label={`Estado de ${voter.nombre}`}
                >
                  <option value="Pendiente de llamar">⏳ Pendiente de llamar</option>
                  <option value="Ya votó">✅ Ya votó</option>
                  <option value="No va votar">❌ No va votar</option>
                </select>
              </div>

              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Agregar comentario..."
                  value={changes.comment ?? voter.comentario}
                  onChange={(e) =>
                    setLocalChanges((prev) => ({
                      ...prev,
                      [voter.id]: { ...prev[voter.id], comment: e.target.value },
                    }))
                  }
                  className="flex-1 bg-muted border border-border rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label={`Comentario para ${voter.nombre}`}
                />
                <button
                  onClick={() => handleSave(voter)}
                  disabled={!hasChanges}
                  className="inline-flex items-center gap-1 bg-accent text-accent-foreground hover:bg-accent/80 disabled:opacity-30 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
                  aria-label="Guardar cambios"
                >
                  <Save className="h-3 w-3" />
                  Guardar
                </button>
              </div>
            </div>
          );
        })}

        {pageData.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Phone className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay personas pendientes de llamar</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default PendientesModule;
