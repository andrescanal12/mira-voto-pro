export type VoterStatus = "Aún no ha venido" | "Pendiente de llamar" | "Ya llamado" | "Ya votó" | "No va votar";

export interface Voter {
  id: string;
  pais: string;
  ciudad: string;
  iglesia: string;
  cedula: string;
  nombre: string;
  celular: string;
  cedulaInscrita: string;
  lider: string;
  referido: string;
  estadoInscripcion: string;
  estado: VoterStatus;
  comentario: string;
}
