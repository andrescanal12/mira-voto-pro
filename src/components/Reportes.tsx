import { Download } from "lucide-react";
import { Voter } from "@/types/voter";
import { exportToExcel } from "@/utils/excelParser";

interface Props {
  voters: Voter[];
}

const Reportes = ({ voters }: Props) => {
  const exports = [
    {
      label: "Exportar todos los registros",
      description: "Descarga la base completa con estados actualizados",
      filter: () => voters,
      filename: "MIRA_Base_Completa.xlsx",
    },
    {
      label: "Solo los que Ya Votaron",
      description: "Exporta únicamente personas que ya votaron",
      filter: () => voters.filter((v) => v.estado === "Ya votó"),
      filename: "MIRA_Ya_Votaron.xlsx",
    },
    {
      label: "Ya Llamados (Seguimiento)",
      description: "Personas contactadas que aún no han votado",
      filter: () => voters.filter((v) => v.estado === "Ya llamado"),
      filename: "MIRA_Ya_Llamados.xlsx",
    },
    {
      label: "Pendientes de Llamar",
      description: "Exporta los pendientes para seguimiento inicial",
      filter: () => voters.filter((v) => v.estado === "Pendiente de llamar"),
      filename: "MIRA_Pendientes.xlsx",
    },
    {
      label: "No Van a Votar",
      description: "Exporta personas que indicaron no van a votar",
      filter: () => voters.filter((v) => v.estado === "No va votar"),
      filename: "MIRA_No_Van_Votar.xlsx",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {exports.map((exp) => {
        const data = exp.filter();
        return (
          <button
            key={exp.filename}
            onClick={() => exportToExcel(data, exp.filename)}
            disabled={data.length === 0}
            className="bg-card border border-border rounded-2xl p-5 text-left hover:border-accent/40 disabled:opacity-40 transition-colors group"
            aria-label={exp.label}
          >
            <div className="flex items-start gap-3">
              <div className="bg-accent/10 text-accent p-2 rounded-xl group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{exp.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{exp.description}</p>
                <p className="text-xs text-accent font-semibold mt-2">
                  {data.length} registro{data.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Reportes;
