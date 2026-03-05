import { useState } from "react";
import { X, UserPlus } from "lucide-react";

interface Props {
    onClose: () => void;
    onAdd: (nombre: string, cedula: string) => void;
}

const AddVoterDialog = ({ onClose, onAdd }: Props) => {
    const [nombre, setNombre] = useState("");
    const [cedula, setCedula] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim() || !cedula.trim()) {
            setError("Por favor, ingresa tanto el nombre como la cédula.");
            return;
        }
        onAdd(nombre.trim(), cedula.trim());
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-card w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-border"
                onClick={(e) => e.stopPropagation()}
                style={{ background: "#ffffff" }}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-[#f8fafc]">
                    <h2 className="text-lg font-extrabold text-[#1a3a6e] flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Añadir Persona
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Nombre Completo</label>
                        <input
                            type="text"
                            autoFocus
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Cédula</label>
                        <input
                            type="text"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej. 123456789"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-[#1a3a6e] hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            <UserPlus className="h-4 w-4" />
                            Añadir a la Base de Datos
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVoterDialog;
