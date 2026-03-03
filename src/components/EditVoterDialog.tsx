import { useState } from "react";
import { X, Save } from "lucide-react";
import { Voter, VoterStatus } from "@/types/voter";

interface Props {
  voter: Voter;
  onSave: (id: string, status: VoterStatus, comment: string) => void;
  onClose: () => void;
}

const EditVoterDialog = ({ voter, onSave, onClose }: Props) => {
  const [status, setStatus] = useState<VoterStatus>(voter.estado);
  const [comment, setComment] = useState(voter.comentario);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Editar Votante</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground">{voter.nombre}</p>
            <p className="text-xs text-muted-foreground">CC: {voter.cedula} · {voter.ciudad}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as VoterStatus)}
              className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="Aún no ha venido">⏳ Aún no ha venido</option>
              <option value="Pendiente de llamar">📞 Falta llamar</option>
              <option value="Ya votó">✅ Ya votó</option>
              <option value="No va votar">❌ No va votar</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Comentario</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="Agregar un comentario..."
            />
          </div>

          <button
            onClick={() => { onSave(voter.id, status, comment); onClose(); }}
            className="w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground hover:bg-accent/80 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors"
          >
            <Save className="h-4 w-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVoterDialog;
