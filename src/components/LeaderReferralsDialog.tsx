import { useState } from "react";
import { X, Phone, Settings2, Save, CheckCircle2 } from "lucide-react";
import { Voter, VoterStatus } from "@/types/voter";

interface Props {
    leaderName: string;
    allVoters: Voter[];
    onClose: () => void;
    onStatusChange?: (id: string, status: VoterStatus) => void;
    onCommentChange?: (id: string, comment: string) => void;
}

const STATUS_OPTIONS: { value: VoterStatus; label: string }[] = [
    { value: "Aún no ha venido", label: "⏳ Pendiente" },
    { value: "Pendiente de llamar", label: "📞 Llamar" },
    { value: "Ya llamado", label: "☎️ Ya llamado" },
    { value: "Ya votó", label: "✅ Ya votó" },
    { value: "No va votar", label: "❌ No vota" },
];

const LeaderReferralsDialog = ({ leaderName, allVoters, onClose, onStatusChange, onCommentChange }: Props) => {
    const [pendingChanges, setPendingChanges] = useState<Record<string, { status?: VoterStatus; comment?: string; saved?: boolean }>>({});

    const referrals = allVoters.filter(v => {
        if (!v.lider) return false;
        const l = v.lider.toLowerCase();
        const ln = leaderName.toLowerCase();
        return l.includes(ln) && v.nombre !== leaderName;
    });

    const getStatusColor = (status: string) => {
        if (status === "Ya votó") return "bg-green-100 text-green-700 border-green-200";
        if (status === "Pendiente de llamar") return "bg-yellow-100 text-yellow-700 border-yellow-300";
        if (status === "Ya llamado") return "bg-purple-100 text-purple-700 border-purple-200";
        if (status === "Aún no ha venido") return "bg-blue-100 text-blue-700 border-blue-200";
        if (status === "No va votar") return "bg-red-100 text-red-700 border-red-200";
        return "bg-gray-100 text-gray-700 border-gray-200";
    };

    const handleStatusSelect = (id: string, status: VoterStatus, currentStatus: VoterStatus) => {
        if (status === currentStatus) return;
        setPendingChanges((prev) => ({ ...prev, [id]: { ...prev[id], status, saved: false } }));
    };

    const handleCommentEdit = (id: string, comment: string) => {
        setPendingChanges((prev) => ({ ...prev, [id]: { ...prev[id], comment, saved: false } }));
    };

    const handleSave = (id: string, currentComment: string) => {
        const p = pendingChanges[id];
        if (!p) return;

        if (!currentComment || currentComment.trim() === "") {
            alert("⚠️ El comentario es obligatorio para registrar la llamada.");
            return;
        }

        if (p.status !== undefined && onStatusChange) onStatusChange(id, p.status);
        if (p.comment !== undefined && onCommentChange) onCommentChange(id, p.comment);

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-card border border-border rounded-2xl p-0 w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh]"
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
                <div className="overflow-y-auto p-5 pb-6 flex-1 space-y-4 custom-scrollbar bg-gray-50/50">
                    {referrals.length === 0 ? (
                        <div className="text-center py-10 px-4">
                            <Settings2 className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No se encontraron referidos exactos para este líder.</p>
                            <p className="text-gray-400 text-xs mt-1">Verifica que el nombre coincida en la columna 'líder' de sus referidos.</p>
                        </div>
                    ) : (
                        referrals.map((v) => {
                            const p = pendingChanges[v.id];
                            const currentStatus = p?.status ?? v.estado;
                            const currentComment = p?.comment ?? v.comentario ?? "";
                            const hasPending = p && !p.saved && (p.status !== undefined || p.comment !== undefined);
                            const justSaved = p?.saved;
                            const isCommentEmpty = !currentComment || currentComment.trim() === "";

                            return (
                                <div
                                    key={v.id}
                                    className={`p-4 rounded-xl bg-white shadow-sm flex flex-col gap-3 transition-all ${hasPending ? "border-2 border-yellow-400 ring-1 ring-yellow-300" : "border border-gray-200 hover:border-blue-200"
                                        }`}
                                >

                                    {/* Fila superior: Info + Botón Llamar */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-bold text-gray-900 text-[15px] leading-snug break-words">{v.nombre}</p>
                                                {hasPending && (
                                                    <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-0.5 rounded-full animate-pulse">
                                                        ⚠ Sin guardar
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                                                <span className="font-medium">CC: <span className="text-gray-700">{v.cedula}</span></span>
                                                <span className="truncate max-w-[150px]">{v.ciudad}</span>
                                                {v.mesa && (
                                                    <span className="font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">🗳️ Mesa: {v.mesa}</span>
                                                )}
                                            </div>
                                        </div>

                                        {v.celular ? (
                                            <a href={`tel:${v.celular}`} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg shrink-0 border border-blue-100 shadow-sm">
                                                <Phone className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{v.celular}</span><span className="sm:hidden">Llamar</span>
                                            </a>
                                        ) : <span className="text-gray-400 text-[11px] font-medium px-2 py-1 shrink-0">Sin número</span>}
                                    </div>

                                    {/* Fila inferior: Controles de edición */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-50">
                                        <select
                                            value={currentStatus}
                                            onChange={(e) => handleStatusSelect(v.id, e.target.value as VoterStatus, v.estado)}
                                            className={`text-xs font-bold px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em] pr-8 ${getStatusColor(currentStatus)}`}
                                            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")` }}
                                        >
                                            {STATUS_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value} className="text-gray-900 bg-white font-medium" style={{ color: "black" }}>{opt.label}</option>
                                            ))}
                                        </select>

                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="💬 Nota..."
                                                value={currentComment}
                                                onChange={(e) => handleCommentEdit(v.id, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleSave(v.id, currentComment);
                                                    }
                                                }}
                                                className={`flex-1 text-xs border rounded-lg px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 bg-[#f9fafb] ${isCommentEmpty && hasPending ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"}`}
                                            />
                                            {justSaved ? (
                                                <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-2 rounded-lg text-white bg-green-500 transition-all shadow-sm">
                                                    <CheckCircle2 className="h-3 w-3" /> ¡Listo!
                                                </span>
                                            ) : hasPending ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSave(v.id, currentComment)}
                                                    disabled={isCommentEmpty}
                                                    className={`flex items-center gap-1 text-[11px] font-bold px-3 py-2 rounded-lg text-white whitespace-nowrap transition-all shadow-sm ${isCommentEmpty ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 animate-pulse"}`}
                                                >
                                                    <Save className="h-3 w-3" /> Guardar
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                    {isCommentEmpty && hasPending && (
                                        <p className="text-[10px] text-red-500 font-bold px-1 mt-[-6px]">⚠️ Comentario obligatorio.</p>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderReferralsDialog;
