import { X, Phone, Settings2 } from "lucide-react";
import { Voter } from "@/types/voter";

interface Props {
    leaderName: string;
    allVoters: Voter[];
    onClose: () => void;
}

const LeaderReferralsDialog = ({ leaderName, allVoters, onClose }: Props) => {
    // Encontrar referidos buscando coincidencias exactas y parciales (ej. por si tiene un sufijo)
    // en el campo 'lider'. Para evitar falsos positivos, normalizamos y comparamos.
    const referrals = allVoters.filter(v => {
        if (!v.lider) return false;
        const l = v.lider.toLowerCase();
        const ln = leaderName.toLowerCase();
        return l.includes(ln) && v.nombre !== leaderName; // Evitar que el líder sea referido de sí mismo
    });

    const getStatusColor = (status: string) => {
        if (status === "Ya votó") return "bg-green-100 text-green-700";
        if (status === "Pendiente de llamar") return "bg-yellow-100 text-yellow-700";
        if (status === "Ya llamado") return "bg-purple-100 text-purple-700";
        if (status === "Aún no ha venido") return "bg-blue-100 text-blue-700";
        if (status === "No va votar") return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-700";
    };

    const getStatusIcon = (status: string) => {
        if (status === "Ya votó") return "✅";
        if (status === "Pendiente de llamar") return "📞";
        if (status === "Ya llamado") return "☎️";
        if (status === "No va votar") return "❌";
        return "⏳";
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-card border border-border rounded-2xl p-0 w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
                style={{ background: "#ffffff" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100" style={{ background: "#f8fafc", borderRadius: "1rem 1rem 0 0" }}>
                    <div>
                        <h3 className="font-extrabold text-foreground text-lg flex items-center gap-2">
                            👥 Referidos de {leaderName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                            Total: <span className="text-accent font-bold">{referrals.length}</span> personas
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full text-muted-foreground hover:text-foreground shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors" aria-label="Cerrar">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-5 pb-6 flex-1 space-y-3 custom-scrollbar">
                    {referrals.length === 0 ? (
                        <div className="text-center py-10 px-4">
                            <Settings2 className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No se encontraron referidos exactos para este líder.</p>
                            <p className="text-gray-400 text-xs mt-1">Verifica que el nombre coincida en la columna 'líder' de sus referidos.</p>
                        </div>
                    ) : (
                        referrals.map((v) => (
                            <div key={v.id} className="p-3.5 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">

                                {/* Info Votante */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 text-sm truncate">{v.nombre}</p>

                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                                        <span className="font-medium text-gray-400">CC: {v.cedula}</span>
                                        <span className="truncate max-w-[150px]">{v.ciudad}</span>
                                    </div>
                                </div>

                                {/* Acciones e Indicadores */}
                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 sm:gap-1.5 shrink-0 pt-2 sm:pt-0 border-t border-gray-50 sm:border-0 mt-1 sm:mt-0">
                                    <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${getStatusColor(v.estado)}`}>
                                        {getStatusIcon(v.estado)} {v.estado}
                                    </span>

                                    {v.celular ? (
                                        <a href={`tel:${v.celular}`} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-[11px] font-bold transition-colors bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md">
                                            <Phone className="h-3 w-3" /> {v.celular}
                                        </a>
                                    ) : <span className="text-gray-400 text-[11px] font-medium px-2 py-1">Sin número</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderReferralsDialog;
