import { useState } from "react";
import { BarChart3, Database, Phone, FileDown } from "lucide-react";
import Header from "@/components/Header";
import ContadorRegresivo from "@/components/ContadorRegresivo";
import DashboardCards from "@/components/DashboardCards";
import TablaBaseDatos from "@/components/TablaBaseDatos";
import PendientesModule from "@/components/PendientesModule";
import Reportes from "@/components/Reportes";
import EditVoterDialog from "@/components/EditVoterDialog";
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

type Tab = "dashboard" | "base" | "pendientes" | "reportes";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "base", label: "Base de Datos", icon: Database },
  { id: "pendientes", label: "Pendientes", icon: Phone },
  { id: "reportes", label: "Reportes", icon: FileDown },
];

const Index = () => {
  const { voters, updateVoterStatus, updateVoterComment } = useVoters();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleSaveEdit = (id: string, status: VoterStatus, comment: string) => {
    updateVoterStatus(id, status);
    updateVoterComment(id, comment);
  };

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
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>

        {/* Contador (Fijo arriba a la izquierda para todos los tamaños) */}
        <div style={{ position: "absolute", top: "1.5rem", left: "2rem", zIndex: 50 }}>
          <ContadorRegresivo />
        </div>

        {/* ── HEADER INSTITUCIONAL INSPIRADO EN LA REFERENCIA ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem 1rem 0" }}>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>

            {/* Logo de MIRA */}
            <img
              src={miraLogo}
              alt="MIRA"
              style={{ width: 110, height: 110, objectFit: "cover", borderRadius: "50%", border: "4px solid white", filter: "drop-shadow(0 4px 12px rgba(0,0,50,0.5))" }}
            />

            {/* Texto Título de la Aplicación (ALICANTE) */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ color: "white", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                Sistema de Seguimiento Electoral <span style={{ color: "#fbba00" }}>ALICANTE</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", fontWeight: 500, marginTop: "0.2rem" }}>
                MIRA España — Partido Político
              </div>
            </div>

          </div>
        </div>

        {/* ── HERO SECCIÓN ── */}
        <section style={{ padding: "0", position: "relative", zIndex: 2 }}>



          {/* ── Fórmula Electoral – igual al oficial ── */}
          {!imgError ? (
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem", position: "relative" }}>
              {/* Dos fotos superpuestas como en el sitio oficial */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 0, marginTop: "2rem" }}>

                {/* ANA PAOLA – z-index mayor, margen negativo derecho */}
                <div style={{ position: "relative", flex: 1, maxWidth: 550, zIndex: 2, marginRight: "-90px" }}>
                  <img
                    src={ANA_PHOTO}
                    alt="Ana Paola Agudelo"
                    onError={() => setImgError(true)}
                    style={{
                      maxWidth: "100%", maxHeight: 650, height: "auto", display: "block",
                      maskImage: "linear-gradient(#00289f 82%, transparent)",
                      WebkitMaskImage: "linear-gradient(#00289f 82%, transparent)"
                    }}
                  />
                  {/* Tarjetón – posición absoluta centrada (mitad de la foto) */}
                  <div style={{ position: "absolute", top: "50%", left: "-10px", zIndex: 10, maxWidth: "42%", pointerEvents: "none" }}>
                    <img src={ANA_BALLOT} alt="Tarjetón Senado MIRA 2"
                      style={{
                        width: "100%", height: "auto", display: "block",
                        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))"
                      }} />
                  </div>
                  {/* Nombre – bottom */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, zIndex: 10, maxWidth: "78%" }}>
                    <img src={ANA_NAME} alt="Ana Paola Agudelo"
                      style={{
                        width: "100%", height: "auto", display: "block",
                        filter: "drop-shadow(0 4px 18px rgba(0,0,0,0.6))"
                      }} />
                  </div>
                </div>

                {/* ALEJANDRA – z-index menor, margen negativo izquierdo */}
                <div style={{ position: "relative", flex: 1, maxWidth: 550, zIndex: 1, marginLeft: "-90px", alignSelf: "flex-end" }}>
                  <img
                    src={ALE_PHOTO}
                    alt="Alejandra Ospina"
                    onError={() => setImgError(true)}
                    style={{
                      maxWidth: "100%", maxHeight: 600, height: "auto", display: "block",
                      maskImage: "linear-gradient(#00289f 82%, transparent)",
                      WebkitMaskImage: "linear-gradient(#00289f 82%, transparent)"
                    }}
                  />
                  {/* Tarjetón Cámara */}
                  <div style={{ position: "absolute", top: "50%", right: "-10px", zIndex: 10, maxWidth: "42%", pointerEvents: "none" }}>
                    <img src={ALE_BALLOT} alt="Tarjetón Cámara MIRA 402"
                      style={{
                        width: "100%", height: "auto", display: "block",
                        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))"
                      }} />
                  </div>
                  {/* Nombre */}
                  <div style={{ position: "absolute", bottom: 0, right: 10, zIndex: 10, maxWidth: "78%" }}>
                    <img src={ALE_NAME} alt="Alejandra Ospina"
                      style={{
                        width: "100%", height: "auto", display: "block",
                        filter: "drop-shadow(0 4px 18px rgba(0,0,0,0.6))"
                      }} />
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
          <nav className="flex gap-1 bg-card border border-border rounded-2xl p-1 overflow-x-auto" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
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
                {tab.id === "pendientes" && voters.length > 0 && (
                  <span className="bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {voters.filter((v) => v.estado === "Pendiente de llamar" || v.estado === "Aún no ha venido").length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div>
            {activeTab === "dashboard" && <DashboardCards voters={voters} />}
            {activeTab === "base" && <TablaBaseDatos voters={voters} onEdit={setEditingVoter} />}
            {activeTab === "pendientes" && (
              <PendientesModule voters={voters} onUpdateStatus={updateVoterStatus} onUpdateComment={updateVoterComment} />
            )}
            {activeTab === "reportes" && <Reportes voters={voters} />}
          </div>
        </main>

        {editingVoter && (
          <EditVoterDialog voter={editingVoter} onSave={handleSaveEdit} onClose={() => setEditingVoter(null)} />
        )}

      </div>
    </div>
  );
};

export default Index;
