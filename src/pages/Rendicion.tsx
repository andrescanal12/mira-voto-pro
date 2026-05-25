import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  PhoneCall, 
  MapPin, 
  UserCheck, 
  UserX, 
  Search, 
  Award,
  ChevronDown,
  Phone,
  FileDown,
  CheckCircle,
  XCircle,
  LogOut
} from "lucide-react";
import { useVoters } from "@/hooks/useVoters";
import { useAuth } from "@/context/AuthContext";
import { Voter, VoterStatus } from "@/types/voter";

type FilterType = "todos" | "votaron" | "no_votaron" | "llamados" | "no_vinieron" | "llamados_historicos";

const isTargetCity = (city?: string) => {
  if (!city) return false;
  const normalized = city.toUpperCase().trim();
  return normalized === "ALICANTE" || normalized === "BENIDORM" || normalized === "BENIDOR" || normalized === "PETRER";
};

const formatCityName = (city?: string) => {
  if (!city) return "Sin Ciudad";
  const normalized = city.toUpperCase().trim();
  if (normalized === "BENIDOR") return "BENIDORM";
  return normalized;
};

const wasCalled = (v: Voter) => {
  if (v.estado === "Ya llamado") return true;
  const comment = v.comentario?.toLowerCase() || "";
  return (
    comment.includes("[llamado]") ||
    comment.includes("se llamo") ||
    comment.includes("se llamó") ||
    comment.includes("contesta") ||
    comment.includes("apagado") ||
    comment.includes("buzón") ||
    comment.includes("buzon") ||
    comment.includes("llamado") ||
    comment.includes("llamada") ||
    comment.includes("equivocado") ||
    /\b\d{1,2}:\d{2}\b/.test(comment)
  );
};

interface RendicionProps {
  onBack?: () => void;
  readOnly?: boolean;
}

export default function Rendicion({ onBack, readOnly = false }: RendicionProps) {
  const navigate = useNavigate();
  const { voters, isLoading } = useVoters();
  const { user, logout } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<"resumen" | "lideres" | "referidos" | "listas">("resumen");
  const [listFilter, setListFilter] = useState<FilterType>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLeader, setExpandedLeader] = useState<string | null>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  // ── FILTRADO POR CIUDAD ORIGEN (Alicante, Benidorm, Petrer) ─────
  const targetVoters = useMemo(() => {
    return voters.filter(v => isTargetCity(v.ciudad));
  }, [voters]);

  // ── PROCESAMIENTO DE DATOS ──────────────────────────────────────

  const stats = useMemo(() => {
    const total = targetVoters.length;
    const votaron = targetVoters.filter(v => v.estado === "Ya votó").length;
    const noVotaron = total - votaron;
    const llamadosActivos = targetVoters.filter(v => v.estado === "Ya llamado").length;
    const llamadosHistoricos = targetVoters.filter(wasCalled).length;
    const noVinieron = targetVoters.filter(v => v.estado === "Aún no ha venido").length;
    const porcentajeVoto = total > 0 ? Math.round((votaron / total) * 100) : 0;

    return { total, votaron, noVotaron, llamadosActivos, llamadosHistoricos, noVinieron, porcentajeVoto };
  }, [targetVoters]);

  const leadersData = useMemo(() => {
    const groups: Record<string, { total: number; votaron: number; noVotaron: number; votersVotaron: Voter[]; votersNoVotaron: Voter[] }> = {};
    
    targetVoters.forEach(voter => {
      const leaderName = voter.lider?.trim() || "Sin Líder Asignado";
      if (!groups[leaderName]) {
        groups[leaderName] = { total: 0, votaron: 0, noVotaron: 0, votersVotaron: [], votersNoVotaron: [] };
      }
      groups[leaderName].total += 1;
      if (voter.estado === "Ya votó") {
        groups[leaderName].votaron += 1;
        groups[leaderName].votersVotaron.push(voter);
      } else {
        groups[leaderName].noVotaron += 1;
        groups[leaderName].votersNoVotaron.push(voter);
      }
    });

    return Object.entries(groups)
      .map(([name, data]) => ({
        name,
        ...data,
        porcentaje: data.total > 0 ? Math.round((data.votaron / data.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);
  }, [targetVoters]);

  const citiesData = useMemo(() => {
    const groups: Record<string, Record<string, { votersVotaron: Voter[]; votersNoVotaron: Voter[] }>> = {};

    targetVoters.forEach(voter => {
      const city = formatCityName(voter.ciudad);
      const referred = voter.referido?.trim() || "Directo / Sin Referido";

      if (!groups[city]) {
        groups[city] = {};
      }
      if (!groups[city][referred]) {
        groups[city][referred] = { votersVotaron: [], votersNoVotaron: [] };
      }
      if (voter.estado === "Ya votó") {
        groups[city][referred].votersVotaron.push(voter);
      } else {
        groups[city][referred].votersNoVotaron.push(voter);
      }
    });

    return Object.entries(groups).map(([cityName, referidosObj]) => {
      const referidosList = Object.entries(referidosObj).map(([referredName, data]) => {
        const total = data.votersVotaron.length + data.votersNoVotaron.length;
        const votaron = data.votersVotaron.length;
        return {
          name: referredName,
          votersVotaron: data.votersVotaron,
          votersNoVotaron: data.votersNoVotaron,
          total,
          votaron,
          porcentaje: total > 0 ? Math.round((votaron / total) * 100) : 0
        };
      }).sort((a, b) => b.total - a.total);

      const totalCity = referidosList.reduce((acc, curr) => acc + curr.total, 0);
      const votaronCity = referidosList.reduce((acc, curr) => acc + curr.votaron, 0);

      return {
        name: cityName,
        referidos: referidosList,
        total: totalCity,
        votaron: votaronCity,
        porcentaje: totalCity > 0 ? Math.round((votaronCity / totalCity) * 100) : 0
      };
    }).sort((a, b) => b.total - a.total);
  }, [targetVoters]);

  const filteredVoters = useMemo(() => {
    return targetVoters.filter(voter => {
      if (listFilter === "votaron" && voter.estado !== "Ya votó") return false;
      if (listFilter === "no_votaron" && voter.estado === "Ya votó") return false;
      if (listFilter === "llamados" && voter.estado !== "Ya llamado") return false;
      if (listFilter === "no_vinieron" && voter.estado !== "Aún no ha venido") return false;
      if (listFilter === "llamados_historicos" && !wasCalled(voter)) return false;

      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          voter.nombre?.toLowerCase().includes(search) ||
          voter.cedula?.toLowerCase().includes(search) ||
          voter.lider?.toLowerCase().includes(search) ||
          voter.referido?.toLowerCase().includes(search) ||
          voter.ciudad?.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }, [targetVoters, listFilter, searchTerm]);

  const downloadCSV = () => {
    const headers = ["Nombre", "Cédula", "Celular", "Ciudad", "Líder", "Referido", "Estado", "Comentario"];
    const rows = filteredVoters.map(v => [
      v.nombre,
      v.cedula,
      v.celular,
      v.ciudad,
      v.lider,
      v.referido,
      v.estado,
      v.comentario.replace(/[\n,]/g, " ")
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val || ""}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rendicion_cuentas_${listFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status: VoterStatus) => {
    switch (status) {
      case "Ya votó":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold";
      case "Ya llamado":
        return "bg-purple-50 text-purple-700 border border-purple-200 font-bold";
      case "Aún no ha venido":
        return "bg-amber-50 text-amber-700 border border-amber-200 font-bold";
      case "No va votar":
        return "bg-rose-50 text-rose-700 border border-rose-200 font-bold";
      default:
        return "bg-blue-50 text-blue-700 border border-blue-200 font-bold";
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#00289F] animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Generando reporte de rendición de cuentas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-800">
      
      {/* ── BARRA SUPERIOR DE ACCIONES (Volver + Usuario + Salir) ── */}
      {!readOnly && (
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#00289F] px-4 py-2 rounded-xl transition-all border border-slate-200 text-xs font-bold shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Usuario</span>
              <span className="text-slate-700 font-bold text-sm tracking-tight">{user}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-650 hover:text-[#00289F] px-4 py-2 rounded-xl transition-all border border-slate-200 group shadow-sm"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              <span className="text-sm font-bold">Salir</span>
            </button>
          </div>
        </div>
      )}

      {/* ── SECCIÓN DE CABECERA (Estilo Editorial con Instrument Serif) ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
        <div>
          <span className="rounded-full bg-[#E2E8F5] border border-[#CBD5E1] px-3.5 py-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[#0B3B74] inline-block animate-fade-rise">
            Filtro: Alicante, Benidorm, Petrer
          </span>
          <h2 
            className="text-4xl sm:text-5xl font-normal leading-[1] tracking-tight text-[#0B3B74] mt-3 animate-fade-rise-delay"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Rendición de Cuentas <span className="text-[#00289F] italic font-normal">Electoral</span>
          </h2>
          <p className="text-sm max-w-2xl mt-2 text-slate-500 animate-fade-rise-delay-2">
            Consolidación y auditoría de votos emitidos, llamadas realizadas y faltantes por movilizar.
          </p>
        </div>

        {/* Sub-Navegación en forma de píldora glassmorphic */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {(["resumen", "lideres", "referidos", "listas"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeSubTab === tab 
                  ? "bg-[#00289F] text-white shadow-sm" 
                  : "text-slate-500 hover:text-[#00289F] hover:bg-slate-50"
              }`}
            >
              {tab === "resumen" && "Resumen"}
              {tab === "lideres" && "Líderes"}
              {tab === "referidos" && "Referidos"}
              {tab === "listas" && "Listas"}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENIDO ACTIVO ── */}
      <div className="space-y-8">
        
        {/* ── RESUMEN: BENTO GRID GLASSMORPHIC ── */}
        {activeSubTab === "resumen" && (
          <div className="space-y-8 animate-fade-in">
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Tarjeta 1: Total e Inscritos (Double Bezel Light) */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F5] p-1.5 rounded-[2rem] md:col-span-2 shadow-sm">
                <div className="bg-white border border-[#E2E8F5] p-8 rounded-[calc(2rem-0.375rem)] flex flex-col justify-between h-full min-h-[220px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Padrón Electoral (Zona Objetivo)</span>
                      <h3 className="text-4xl font-extrabold mt-1 text-slate-800 tracking-tight">{stats.total} <span className="text-base font-normal text-slate-550">Votantes Inscritos</span></h3>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[#00289F]">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">{stats.votaron}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Ya Votaron</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-700">{stats.llamadosHistoricos}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Total Llamados</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-rose-650">{stats.noVinieron}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">No Vinieron</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Porcentaje de Participación */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F5] p-1.5 rounded-[2rem] shadow-sm">
                <div className="bg-white border border-[#E2E8F5] p-8 rounded-[calc(2rem-0.375rem)] flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Participación Zona</span>
                      <h3 className="text-5xl font-extrabold mt-2 text-[#00289F] tracking-tighter">{stats.porcentajeVoto}%</h3>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[#00289F]">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-8 space-y-2">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#00289F] rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ width: `${stats.porcentajeVoto}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 text-right font-medium">Meta: 100% de asistencia</p>
                  </div>
                </div>
              </div>

              {/* Tarjeta 3: Votos Confirmados */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F5] p-1.5 rounded-[2rem] shadow-sm">
                <div className="bg-white border border-[#E2E8F5] p-8 rounded-[calc(2rem-0.375rem)] flex flex-col justify-between h-full min-h-[200px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Votos Confirmados</span>
                      <h3 className="text-3xl font-bold mt-2 text-[#00289F]">{stats.votaron} <span className="text-sm font-normal text-slate-550">asistieron</span></h3>
                    </div>
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600">
                      <UserCheck className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-550 mt-4">Personas de Alicante, Benidorm y Petrer que ya depositaron su voto.</p>
                </div>
              </div>

              {/* Tarjeta 4: Pendientes */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F5] p-1.5 rounded-[2rem] shadow-sm">
                <div className="bg-white border border-[#E2E8F5] p-8 rounded-[calc(2rem-0.375rem)] flex flex-col justify-between h-full min-h-[200px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Pendientes de Votar</span>
                      <h3 className="text-3xl font-bold mt-2 text-rose-650">{stats.noVotaron} <span className="text-sm font-normal text-slate-550">restantes</span></h3>
                    </div>
                    <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600">
                      <UserX className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-550 mt-4">Votantes en la zona objetivo que aún no se reportan en las urnas.</p>
                </div>
              </div>

              {/* Tarjeta 5: Gestión Telefónica */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F5] p-1.5 rounded-[2rem] shadow-sm">
                <div className="bg-white border border-[#E2E8F5] p-8 rounded-[calc(2rem-0.375rem)] flex flex-col justify-between h-full min-h-[200px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Gestión de Contactos (Histórico)</span>
                      <h3 className="text-3xl font-bold mt-2 text-slate-700">{stats.llamadosHistoricos} <span className="text-sm font-normal text-slate-500">llamados</span></h3>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[#00289F]">
                      <PhoneCall className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-550 mt-4">Llamados en total (detectados por estado e historial de observaciones). Activos ahora: {stats.llamadosActivos}.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── LÍDERES (Votaron vs No Votaron) ── */}
        {activeSubTab === "lideres" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B3B74]">Líderes de Equipo (Asistencia de Voto)</h3>
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-xs text-slate-550 shadow-sm">
                Total Líderes Activos: <strong className="text-[#00289F] font-bold">{leadersData.length}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {leadersData.map(leader => {
                const isExpanded = expandedLeader === leader.name;
                return (
                  <div key={leader.name} className="bg-[#F8FAFC] border border-[#E2E8F5] p-1.5 rounded-[2rem] transition-all duration-300 shadow-sm">
                    <div className="bg-white border border-[#E2E8F5] p-6 rounded-[calc(2rem-0.375rem)]">
                      
                      {/* Cabecera */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[#00289F]">
                            <Award className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg leading-snug text-[#0B3B74]">{leader.name}</h4>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Líder • Asignados: {leader.total} en zona objetivo</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right hidden sm:block">
                            <span className="text-xl font-bold text-[#00289F]">{leader.porcentaje}%</span>
                            <p className="text-[10px] text-slate-550 uppercase">Votaron ({leader.votaron}/{leader.total})</p>
                          </div>
                          <button
                            onClick={() => setExpandedLeader(isExpanded ? null : leader.name)}
                            className="w-full md:w-auto py-2.5 px-6 bg-white hover:bg-slate-50 text-[#00289F] hover:text-[#0B3B74] rounded-xl transition-all duration-300 flex items-center justify-between text-xs font-bold border border-slate-200 shadow-sm"
                          >
                            <span>{isExpanded ? "Ocultar Detalles" : "Ver quiénes votaron y quiénes no"}</span>
                            <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#0B3B74]" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Progreso */}
                      <div className="mt-4 space-y-1">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#00289F] rounded-full transition-all duration-550"
                            style={{ width: `${leader.porcentaje}%` }}
                          />
                        </div>
                      </div>

                      {/* Detalle Desplegable */}
                      {isExpanded && (
                        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Ya Votaron */}
                          <div className="space-y-3">
                            <h5 className="text-xs uppercase tracking-wider font-bold text-emerald-700 flex items-center gap-2 pb-2 border-b border-slate-100">
                              <CheckCircle className="h-4 w-4 text-emerald-650" />
                              Ya Votaron ({leader.votaron})
                            </h5>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {leader.votersVotaron.length > 0 ? (
                                leader.votersVotaron.map(v => (
                                  <div key={v.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F5] text-xs flex justify-between items-center shadow-sm">
                                    <div>
                                      <p className="font-semibold text-slate-800">{v.nombre}</p>
                                      <p className="text-[10px] text-slate-500 mt-0.5">CI: {v.cedula} • {formatCityName(v.ciudad)}</p>
                                      {v.comentario && <p className="text-[10px] text-slate-600 mt-1 italic">Obs: {v.comentario}</p>}
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-250">VOTÓ</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-slate-400 italic py-2">Ninguno ha votado aún.</p>
                              )}
                            </div>
                          </div>

                          {/* No Votaron */}
                          <div className="space-y-3">
                            <h5 className="text-xs uppercase tracking-wider font-bold text-slate-650 flex items-center gap-2 pb-2 border-b border-slate-100">
                              <XCircle className="h-4 w-4 text-slate-500" />
                              No Votaron ({leader.noVotaron})
                            </h5>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {leader.votersNoVotaron.length > 0 ? (
                                leader.votersNoVotaron.map(v => (
                                  <div key={v.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F5] text-xs flex justify-between items-center shadow-sm">
                                    <div>
                                      <p className="font-semibold text-slate-800">{v.nombre}</p>
                                      <p className="text-[10px] text-slate-500 mt-0.5">CI: {v.cedula} • {formatCityName(v.ciudad)} • Ref: {v.referido || "Directo"}</p>
                                      {v.comentario && <p className="text-[10px] text-slate-600 mt-1 italic">Obs: {v.comentario}</p>}
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadgeClass(v.estado)}`}>
                                      {v.estado}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-slate-400 italic py-2">¡Todos los asignados han votado!</p>
                              )}
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── REFERIDOS POR CIUDAD (Votaron vs No Votaron) ── */}
        {activeSubTab === "referidos" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B3B74]">Referidos por Ciudades (Asistencia)</h3>
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 text-xs text-slate-550 shadow-sm">
                Ciudades Activas: <strong className="text-[#00289F] font-bold">{citiesData.length}</strong>
              </div>
            </div>

            <div className="space-y-4">
              {citiesData.map(city => {
                const isExpanded = expandedCity === city.name;
                return (
                  <div key={city.name} className="bg-[#F8FAFC] border border-[#E2E8F5] p-1.5 rounded-[2rem] transition-all duration-300 shadow-sm">
                    <div className="bg-white border border-[#E2E8F5] p-6 rounded-[calc(2rem-0.375rem)]">
                      
                      {/* Cabecera Ciudad */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[#00289F]">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-[#0B3B74]">{city.name}</h3>
                            <p className="text-xs text-slate-500 uppercase mt-0.5">Total Votantes: {city.total} • Votos: {city.votaron} ({city.porcentaje}%)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                          <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full bg-[#00289F] rounded-full" style={{ width: `${city.porcentaje}%` }} />
                          </div>
                          <button
                            onClick={() => setExpandedCity(isExpanded ? null : city.name)}
                            className="w-full md:w-auto py-2 px-5 bg-white hover:bg-slate-50 text-[#00289F] hover:text-[#0B3B74] rounded-xl transition-all duration-300 flex items-center justify-between text-xs font-bold border border-slate-200 shadow-sm"
                          >
                            <span>{isExpanded ? "Ocultar Referidores" : "Ver Referidores"}</span>
                            <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#0B3B74]" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Desplegable Referidores */}
                      {isExpanded && (
                        <div className="mt-8 pt-6 border-t border-slate-100 space-y-8">
                          {city.referidos.map(ref => (
                            <div key={ref.name} className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F5] space-y-4 shadow-inner">
                              
                              {/* Header Referidor */}
                              <div className="flex justify-between items-center pb-3 border-b border-[#E2E8F5]">
                                <div>
                                  <h4 className="font-bold text-sm text-[#0B3B74]">{ref.name}</h4>
                                  <p className="text-[10px] text-slate-450 uppercase mt-0.5">Referidor de Campaña</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-semibold bg-white text-[#00289F] border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                                    Participación: {ref.votaron}/{ref.total} Votos ({ref.porcentaje}%)
                                  </span>
                                </div>
                              </div>

                              {/* Dos columnas de Votaron vs No Votaron */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                
                                {/* Votaron */}
                                <div className="space-y-2">
                                  <div className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2">
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-650" />
                                    Votaron ({ref.votersVotaron.length})
                                  </div>
                                  <div className="space-y-1.5">
                                    {ref.votersVotaron.length > 0 ? (
                                      ref.votersVotaron.map(v => (
                                        <div key={v.id} className="p-2.5 rounded-lg bg-white border border-[#E2E8F5] flex flex-col justify-start shadow-sm">
                                          <div className="flex justify-between w-full text-xs">
                                            <span className="text-slate-800 font-medium truncate max-w-[150px]">{v.nombre}</span>
                                            <span className="text-[9px] text-slate-500 font-mono">Cédula: {v.cedula}</span>
                                          </div>
                                          {v.comentario && <p className="text-[10px] text-slate-600 mt-1 italic">Obs: {v.comentario}</p>}
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-[10px] text-slate-400 italic">Sin votos de momento.</p>
                                    )}
                                  </div>
                                </div>

                                {/* No Votaron */}
                                <div className="space-y-2">
                                  <div className="text-[10px] text-slate-550 uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2">
                                    <XCircle className="h-3.5 w-3.5 text-slate-400" />
                                    No Votaron ({ref.votersNoVotaron.length})
                                  </div>
                                  <div className="space-y-1.5">
                                    {ref.votersNoVotaron.length > 0 ? (
                                      ref.votersNoVotaron.map(v => (
                                        <div key={v.id} className="p-2.5 rounded-lg bg-white border border-[#E2E8F5] flex flex-col justify-start shadow-sm">
                                          <div className="flex justify-between w-full text-xs">
                                            <span className="text-slate-800 font-medium truncate max-w-[150px]">{v.nombre}</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${getStatusBadgeClass(v.estado)}`}>
                                              {v.estado}
                                            </span>
                                          </div>
                                          {v.comentario && <p className="text-[10px] text-slate-600 mt-1 italic">Obs: {v.comentario}</p>}
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-[10px] text-emerald-650 italic">¡Completado 100%!</p>
                                    )}
                                  </div>
                                </div>

                              </div>

                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LISTADOS DETALLADOS ── */}
        {activeSubTab === "listas" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B3B74]">Control General de Votantes</h3>
              </div>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-[#00289F] hover:bg-[#0B3B74] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md"
              >
                <FileDown className="h-4 w-4" />
                Exportar CSV
              </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
              <div className="flex flex-wrap gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                {(["todos", "votaron", "no_votaron", "llamados", "no_vinieron", "llamados_historicos"] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setListFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                      listFilter === filter 
                        ? "bg-[#00289F] text-white shadow-sm" 
                        : "text-slate-500 hover:text-[#00289F] hover:bg-slate-50"
                    }`}
                  >
                    {filter === "todos" && "Todos"}
                    {filter === "votaron" && "Votaron"}
                    {filter === "no_votaron" && "No Votaron"}
                    {filter === "llamados" && "Llamados Activos"}
                    {filter === "no_vinieron" && "No Vinieron"}
                    {filter === "llamados_historicos" && "Llamados Histórico"}
                  </button>
                ))}
              </div>

              {/* Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por Nombre, Cédula, Líder..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00289F] focus:ring-1 focus:ring-[#00289F] transition-all"
                />
              </div>
            </div>

            {/* Tabla */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F5] p-1.5 rounded-[2rem] shadow-sm">
              <div className="bg-white border border-[#E2E8F5] rounded-[calc(2rem-0.375rem)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2E8F5] bg-slate-50/80">
                        <th className="p-4 font-bold text-slate-500 uppercase tracking-wider">Nombre</th>
                        <th className="p-4 font-bold text-slate-500 uppercase tracking-wider">Cédula</th>
                        <th className="p-4 font-bold text-slate-500 uppercase tracking-wider">Ciudad / Mesa</th>
                        <th className="p-4 font-bold text-slate-500 uppercase tracking-wider">Líder / Referido</th>
                        <th className="p-4 font-bold text-slate-500 uppercase tracking-wider">Celular</th>
                        <th className="p-4 font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredVoters.length > 0 ? (
                        filteredVoters.map(v => (
                          <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4">
                              <p className="font-semibold text-[#0B3B74]">{v.nombre}</p>
                              {v.comentario && <p className="text-[10px] text-slate-500 mt-1 italic">Obs: {v.comentario}</p>}
                            </td>
                            <td className="p-4 text-slate-600 font-mono">{v.cedula}</td>
                            <td className="p-4">
                              <p className="text-slate-800">{formatCityName(v.ciudad)}</p>
                              <p className="text-[10px] text-slate-450 mt-0.5">Mesa: {v.mesa || "—"}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-[#00289F] flex items-center gap-1.5 font-medium">
                                <Award className="h-3 w-3 text-[#00289F]" />
                                {v.lider || "—"}
                              </p>
                              <p className="text-[10px] text-slate-450 mt-0.5 flex items-center gap-1.5">
                                <Users className="h-3 w-3 text-slate-400" />
                                Ref: {v.referido || "—"}
                              </p>
                            </td>
                            <td className="p-4 text-slate-700 flex items-center gap-1.5">
                              {v.celular ? (
                                <>
                                  <Phone className="h-3 w-3 text-slate-400" />
                                  {v.celular}
                                </>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold ${getStatusBadgeClass(v.estado)}`}>
                                {v.estado}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                            No se encontraron votantes con los filtros seleccionados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Conteo */}
            <div className="text-xs text-slate-500 px-2 flex justify-between">
              <span>Mostrando {filteredVoters.length} de {targetVoters.length} votantes registrados</span>
              {searchTerm && <span>Filtro de búsqueda activo</span>}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
