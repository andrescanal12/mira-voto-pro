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

  const handleSaveEdit = (id: string, status: VoterStatus, comment: string) => {
    updateVoterStatus(id, status);
    updateVoterComment(id, comment);
  };

  return (
    <div className="min-h-screen bg-background mira-bg-pattern">
      <Header />

      {/* Hero banner */}
      <div className="relative overflow-hidden">
        <img
          src={miraBanner}
          alt="MIRA Candidatos - Ana Paola Agudelo Senado, Alejandra Ospina Cámara"
          className="w-full h-32 md:h-48 object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute top-3 left-3 md:top-4 md:left-6">
          <ContadorRegresivo />
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Tab navigation */}
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
                  {voters.filter((v) => v.estado === "Pendiente de llamar").length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div>
          {activeTab === "dashboard" && <DashboardCards voters={voters} />}
          {activeTab === "base" && (
            <TablaBaseDatos voters={voters} onEdit={setEditingVoter} />
          )}
          {activeTab === "pendientes" && (
            <PendientesModule
              voters={voters}
              onUpdateStatus={updateVoterStatus}
              onUpdateComment={updateVoterComment}
            />
          )}
          {activeTab === "reportes" && <Reportes voters={voters} />}
        </div>
      </main>

      {/* Edit dialog */}
      {editingVoter && (
        <EditVoterDialog
          voter={editingVoter}
          onSave={handleSaveEdit}
          onClose={() => setEditingVoter(null)}
        />
      )}

      {/* Footer */}
      <footer className="colombia-stripe mt-8" />
    </div>
  );
};

export default Index;
