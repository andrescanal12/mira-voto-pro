import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, Trash2 } from "lucide-react";
import { parseExcelFile } from "@/utils/excelParser";
import { Voter } from "@/types/voter";

interface Props {
  onLoad: (voters: Voter[]) => void;
  hasData: boolean;
  onClear: () => void;
}

const ExcelUploader = ({ onLoad, hasData, onClear }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const voters = await parseExcelFile(file);
      if (voters.length === 0) {
        setError("No se encontraron registros válidos en el archivo.");
      } else {
        onLoad(voters);
      }
    } catch {
      setError("Error al procesar el archivo. Verifica que sea un Excel válido.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
      <FileSpreadsheet className="h-8 w-8 text-accent shrink-0" />
      <div className="flex-1 text-center sm:text-left">
        <p className="text-sm font-semibold text-foreground">
          {hasData ? "Base de datos cargada" : "Cargar base de datos Excel"}
        </p>
        <p className="text-xs text-muted-foreground">
          {hasData
            ? "Puedes reemplazar cargando un nuevo archivo"
            : "Sube un archivo .xlsx con la información de votantes"}
        </p>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
      <div className="flex gap-2">
        <label
          className="inline-flex items-center gap-2 bg-primary hover:bg-accent hover:text-accent-foreground text-primary-foreground px-4 py-2.5 rounded-2xl cursor-pointer transition-colors text-sm font-medium"
          aria-label="Subir archivo Excel"
        >
          <Upload className="h-4 w-4" />
          {loading ? "Procesando..." : "Subir Excel"}
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFile}
            disabled={loading}
          />
        </label>
        {hasData && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground px-3 py-2.5 rounded-2xl transition-colors text-sm font-medium"
            aria-label="Limpiar datos"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ExcelUploader;
