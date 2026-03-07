import { useState, useEffect } from "react";
import { BarChart3, Database, Phone, FileDown, CheckCircle2, UserPlus, Search, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import ContadorRegresivo from "@/components/ContadorRegresivo";
import DashboardCards from "@/components/DashboardCards";
import TablaBaseDatos from "@/components/TablaBaseDatos";
import PendientesModule from "@/components/PendientesModule";
import Reportes from "@/components/Reportes";
import EditVoterDialog from "@/components/EditVoterDialog";
import AddVoterDialog from "@/components/AddVoterDialog";
import { useVoters } from "@/hooks/useVoters";
import { Voter, VoterStatus } from "@/types/voter";
import miraBanner from "@/assets/mira-banner.png";
import miraLogo from "@/assets/mira-logo.jpg";

// URLs directas del sitio oficial – imágenes con fondo transparente
const ANA_PHOTO = "https://candidatos2026.partidomira.com/archivos/default/archivo-general?unique_id=archivo-bc152cebff9cb7a0&v=1772071197";
const ALE_PHOTO = "https://candidatos2026.partidomira.com/archivos/default/archivo-general?unique_id=archivo-8af4539df67fb959&v=1772072982";
const ANA_BALLOT = "https://candidatos2026.partidomira.com/archivos/default/archivo-general?unique_id=archivo-a3d4c06a513ff00f&v=1772071197";
const ALE_BALLOT = "https://candidatos2026.partidomira.com/archivos/default/archivo-general?unique_id=archivo-9d8a3014e35dcc79&v=1772072982";
const ANA_NAME = "https://candidatos2026.partidomira.com/archivos/default/archivo-general?unique_id=archivo-fd58e2984c78c17f&v=1772071197";
const ALE_NAME = "https://candidatos2026.partidomira.com/archivos/default/archivo-general?unique_id=archivo-f63ec40a857cc934&v=1772072982";

type Tab = "dashboard" | "pendientes" | "ya_llamados" | "reportes";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "pendientes", label: "Call-Center", icon: Phone },
  { id: "ya_llamados", label: "Ya llamados", icon: CheckCircle2 },
  { id: "reportes", label: "Reportes", icon: FileDown },
];

const Index = () => {
  const { voters, isLoading, isSyncing, lastSync, manualSync, updateVoterStatus, updateVoterComment, addVoter } = useVoters();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [isAddingVoter, setIsAddingVoter] = useState(false);
  const [imgError, setImgError] = useState(false);
  const handleSaveEdit = (id: string, status: VoterStatus, comment: string) => {
    updateVoterStatus(id, status);
    updateVoterComment(id, comment);
  };

  // Mostrar spinner mientras se cargan datos de Google Sheets
  if (isLoading) {
    return (
      <div className="min-h-screen mira-bg-pattern flex items-center justify-center">
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "4px solid rgba(255,255,255,0.2)",
            borderTop: "4px solid #FFD700",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px"
          }} />
          <p style={{ fontSize: 16, opacity: 0.9 }}>Cargando datos desde Google Sheets…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mira-bg-pattern" style={{ position: "relative" }}>
      {/* ── BACKGROUND FIXED ELEMENTS (Todo el sitio) ── */}
      {/* Orbs */}
      <div className="mira-orb mira-orb-1" />
      <div className="mira-orb mira-orb-2" />
      <div className="mira-orb mira-orb-3" />

      {/* Sunburst radial lines */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none',
        background: 'repeating-conic-gradient(from 0deg at 50% 30%, transparent 0deg 2deg, rgba(255, 255, 255, 0.03) 2deg 4deg)'
      }}></div>

      {/* Polka dots (fixed on top left) */}
      <div style={{ position: "fixed", top: 40, left: "5%", display: "flex", flexDirection: "column", gap: 10, zIndex: 0, pointerEvents: "none", opacity: 0.9 }}>
        {[0, 1].map(row => (
          <div key={row} style={{ display: "flex", gap: 10 }}>
            {[...Array(14)].map((_, i) => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: "50%",
                background: row === 0 && i < 5 ? "#fbba00" : "rgba(255,255,255,0.4)"
              }} />
            ))}
          </div>
        ))}
      </div>

      {/* Onda amarilla flotante derecha */}
      <svg style={{ position: "fixed", top: "35%", right: "-30px", opacity: 0.8, pointerEvents: "none", zIndex: 0 }}
        width="180" height="40" viewBox="0 0 150 40">
        <path d="M0,20 Q37,0 75,20 Q112,40 150,20" stroke="#fbba00" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
      {/* Anillo amarillo derecho */}
      <div style={{
        position: "fixed", top: "15%", right: "-120px", width: 350, height: 350, borderRadius: "50%",
        border: "3px solid rgba(251,186,0,0.6)", pointerEvents: "none", zIndex: 0
      }} />

      {/* Franjas curvas de Colombia en la parte inferior */}
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 0, pointerEvents: "none", opacity: 0.85, overflow: "hidden", lineHeight: 0 }}>
        <svg viewBox="0 0 1440 120" width="100%" height="auto" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "120px", transform: "scaleX(1.1)" }}>
          <path d="M0,35 C320,105 640,-35 1440,55 L1440,120 L0,120 Z" fill="#CE1126" />
          <path d="M0,25 C320,85 640,-45 1440,35 L1440,120 L0,120 Z" fill="#003893" />
          <path d="M0,15 C320,65 640,-55 1440,15 L1440,120 L0,120 Z" fill="#FCD116" />
        </svg>
      </div>

      {/* Todo el contenido encima de los orbs */}
      <div className="relative z-10 min-h-screen">

        {/* ── HEADER RESPONSIVO INSTITUCIONAL ── */}
        <div className="flex flex-col lg:flex-row items-center justify-center px-4 pt-6 lg:pt-8 w-full relative z-50">

          {/* Contador (Mobile: flujo centrado arriba, Desktop: Fijo arriba a la izquierda) */}
          <div className="flex justify-center w-full lg:w-auto lg:absolute lg:top-8 lg:left-8 mb-6 lg:mb-0">
            <ContadorRegresivo />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 lg:gap-6 lg:mx-auto text-center md:text-left">
            {/* Logo de MIRA */}
            <img
              src={miraLogo}
              alt="MIRA"
              style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "50%", border: "3px solid white", filter: "drop-shadow(0 4px 12px rgba(0,0,50,0.5))" }}
              className="lg:w-[110px] lg:h-[110px]"
            />

            {/* Texto Título de la Aplicación (ALICANTE) */}
            <div className="flex flex-col">
              <div className="text-white font-extrabold tracking-tight leading-tight text-xl lg:text-2xl">
                Sistema de Seguimiento Electoral <span style={{ color: "#fbba00" }}>ALICANTE</span>
              </div>
              <div className="text-white/80 font-medium text-sm lg:text-base mt-1">
                MIRA España — Partido Político
              </div>
            </div>
          </div>
        </div>

        {/* ── HERO SECCIÓN ── */}
        <section style={{ padding: "0", position: "relative", zIndex: 2 }}>



          {/* ── Fórmula Electoral – igual al oficial ── */}
          {!imgError ? (
            <div className="max-w-[1200px] mx-auto px-1 md:px-4 relative overflow-hidden">
              {/* Dos fotos superpuestas como en el sitio oficial */}
              <div className="flex justify-center items-end gap-0 mt-4 md:mt-8 mb-4">

                {/* ANA PAOLA – margen negativo derecho adaptativo */}
                <div className="relative flex-1 max-w-[550px] z-[5] -mr-8 sm:-mr-12 md:-mr-[90px]">
                  <img
                    src={ANA_PHOTO}
                    alt="Ana Paola Agudelo"
                    onError={() => setImgError(true)}
                    className="w-full h-auto max-h-[350px] sm:max-h-[450px] md:max-h-[650px] object-contain object-bottom block"
                    style={{
                      maskImage: "linear-gradient(#00289f 82%, transparent)",
                      WebkitMaskImage: "linear-gradient(#00289f 82%, transparent)"
                    }}
                  />
                  {/* Tarjetón – posición absoluta responsiva */}
                  <div className="absolute top-[35%] md:top-[50%] left-0 z-20 w-[65%] md:w-[42%] pointer-events-none">
                    <img src={ANA_BALLOT} alt="Tarjetón Senado MIRA 2"
                      className="w-full h-auto block drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
                  </div>
                  {/* Nombre removido por petición del usuario para evitar solapamiento */}
                </div>

                {/* ALEJANDRA – z-index mayor (para mostrar el nombre completo arriba) */}
                <div className="relative flex-1 max-w-[550px] z-10 -ml-8 sm:-ml-12 md:-ml-[90px] self-end">
                  <img
                    src={ALE_PHOTO}
                    alt="Alejandra Ospina"
                    onError={() => setImgError(true)}
                    className="w-full h-auto max-h-[320px] sm:max-h-[400px] md:max-h-[600px] object-contain object-bottom block"
                    style={{
                      maskImage: "linear-gradient(#00289f 82%, transparent)",
                      WebkitMaskImage: "linear-gradient(#00289f 82%, transparent)"
                    }}
                  />
                  {/* Tarjetón Cámara responsivo */}
                  <div className="absolute top-[35%] md:top-[50%] right-0 z-20 w-[65%] md:w-[42%] pointer-events-none">
                    <img src={ALE_BALLOT} alt="Tarjetón Cámara MIRA 402"
                      className="w-full h-auto block drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
                  </div>
                  {/* Nombre responsivo – Z-index alto para evitar cortes */}
                  <div className="absolute bottom-0 right-0 z-30 w-[100%] md:w-[78%]">
                    <img src={ALE_NAME} alt="Alejandra Ospina"
                      className="w-full h-auto block drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Fallback con el banner propio */
            <div>
              <img src={miraBanner} alt="MIRA Candidatas"
                style={{ width: "100%", maxHeight: 380, objectFit: "cover", objectPosition: "center 15%", display: "block" }} />
            </div>
          )}

          {/* Desvanezco la parte inferior negra innecesaria y dejo todo transparente al final */}
        </section>

        {/* ── MAIN CONTENT ── */}
        <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
          {/* Nav + indicador de sync */}
          <div>
            {/* Nav + acciones */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <nav className="flex gap-1 bg-card border border-border rounded-2xl p-1 overflow-x-auto" role="tablist">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    {tab.id === "pendientes" && (
                      <span className="bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {voters.filter((v) => v.estado === "Pendiente de llamar" || v.estado === "Aún no ha venido").length}
                      </span>
                    )}
                    {tab.id === "ya_llamados" && (
                      <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {voters.filter((v) => v.estado === "Ya llamado").length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="flex items-center justify-between sm:justify-end gap-3 px-1">
                {/* Botón Añadir Persona */}
                <button
                  onClick={() => setIsAddingVoter(true)}
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-[12px] font-bold px-3 py-1.5 rounded-xl transition-colors shadow-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Añadir Persona
                </button>
              </div>
            </div>

            {/* Enlace Oficial a la Registraduría Mejorado */}
            <div className="mb-4 bg-[#1a3a6e] border border-blue-400/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3 text-white">
                <Search className="h-8 w-8 text-[#fbba00]" />
                <div>
                  <h3 className="font-extrabold text-lg flex items-center gap-2">
                    ¿Consulta tu mesa si no la recuerdas?
                  </h3>
                  <p className="text-white/80 text-sm">
                    Revisa directamente en la Registraduría Nacional del Estado Civil.
                  </p>
                </div>
              </div>
              <a
                href="https://eleccionescolombia.registraduria.gov.co/identificacion"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 bg-[#fbba00] hover:bg-[#e0a600] text-[#00289f] font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Consultar aquí
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            {activeTab === "dashboard" && <DashboardCards voters={voters} />}
            {activeTab === "pendientes" && (
              <PendientesModule voters={voters} onUpdateStatus={updateVoterStatus} onUpdateComment={updateVoterComment} />
            )}
            {activeTab === "ya_llamados" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-purple-400" />
                    Votantes Ya Llamados
                  </h2>
                </div>
                <TablaBaseDatos
                  voters={voters.filter(v => v.estado === "Ya llamado")}
                  onEdit={setEditingVoter}
                  onStatusChange={updateVoterStatus}
                  onCommentChange={updateVoterComment}
                />
              </div>
            )}
            {activeTab === "reportes" && <Reportes voters={voters} />}
          </div>
        </main>

        {editingVoter && (
          <EditVoterDialog voter={editingVoter} onSave={handleSaveEdit} onClose={() => setEditingVoter(null)} />
        )}

        {isAddingVoter && (
          <AddVoterDialog onAdd={addVoter} onClose={() => setIsAddingVoter(false)} />
        )}

      </div>
    </div>
  );
};

export default Index;
