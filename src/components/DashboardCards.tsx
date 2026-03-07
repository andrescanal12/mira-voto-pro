import { useMemo } from "react";
import { Users, CheckCircle2, Phone, XCircle, Clock } from "lucide-react";
import { Voter } from "@/types/voter";

interface Props {
  voters: Voter[];
  onNavigate: (tab: "dashboard" | "pendientes" | "call_center" | "ya_llamados", filter?: string) => void;
}

const DashboardCards = ({ voters, onNavigate }: Props) => {
  const stats = useMemo(() => {
    const total = voters.length;
    const noVino = voters.filter((v) => v.estado === "Aún no ha venido").length;
    const yaVoto = voters.filter((v) => v.estado === "Ya votó").length;
    const yaLlamado = voters.filter((v) => v.estado === "Ya llamado").length;
    const pendientes = voters.filter((v) => v.estado === "Pendiente de llamar").length;
    const noVota = voters.filter((v) => v.estado === "No va votar").length;
    return { total, noVino, yaVoto, yaLlamado, pendientes, noVota };
  }, [voters]);

  const cards = [
    {
      label: "Total Cargados",
      value: stats.total,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
      action: () => onNavigate("pendientes", ""),
    },
    {
      label: "Aún No Han Venido",
      value: stats.noVino,
      icon: Clock,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      action: () => onNavigate("pendientes", "Aún no ha venido"),
    },
    {
      label: "Ya Votaron",
      value: stats.yaVoto,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
      action: () => onNavigate("pendientes", "Ya votó"),
    },
    {
      label: "Ya Llamados",
      value: stats.yaLlamado,
      icon: Phone,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      action: () => onNavigate("ya_llamados"),
    },
    {
      label: "Falta Llamar",
      value: stats.pendientes,
      icon: Phone,
      color: "text-warning",
      bgColor: "bg-warning/10",
      action: () => onNavigate("call_center"),
    },
    {
      label: "No Van a Votar",
      value: stats.noVota,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      action: () => onNavigate("pendientes", "No va votar"),
    },
  ];

  const chartTotal = stats.total || 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <button
            key={card.label}
            onClick={card.action}
            className="bg-card border border-border rounded-2xl p-4 md:p-5 flex flex-col gap-3 hover:border-accent/40 hover:bg-white/5 transition-all text-left group active:scale-95"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-muted-foreground font-medium">
                {card.label}
              </span>
              <div className={`${card.bgColor} ${card.color} p-2 rounded-xl`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              {card.value.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* Simple bar chart */}
      {stats.total > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Distribución de Estados
          </h3>
          <div className="space-y-3">
            {[
              { label: "Aún No Han Venido", value: stats.noVino, cls: "bg-blue-400" },
              { label: "Ya Votaron", value: stats.yaVoto, cls: "bg-success" },
              { label: "Ya Llamados", value: stats.yaLlamado, cls: "bg-purple-400" },
              { label: "Pendientes", value: stats.pendientes, cls: "bg-warning" },
              { label: "No Van a Votar", value: stats.noVota, cls: "bg-destructive" },
            ].map((bar) => (
              <div key={bar.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <span className="font-semibold text-foreground">
                    {bar.value} ({((bar.value / chartTotal) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bar.cls} rounded-full transition-all duration-700`}
                    style={{ width: `${(bar.value / chartTotal) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCards;
