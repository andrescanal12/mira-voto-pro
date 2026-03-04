import { useState, useEffect, useCallback } from "react";
import { Voter, VoterStatus } from "@/types/voter";
import { BASE_VOTERS } from "@/data/votersData";
import {
  getAllVotersFromSheet,
  updateVoterStatus as syncStatusToSheet,
  updateVoterComment as syncCommentToSheet,
  estadoToYaVoto,
  SHEETS_API_URL,
} from "@/services/sheetsApi";

const STORAGE_KEY = "mira-voters-data-v2"; // 'v2' para limpiar caché vieja
const IS_SYNC_ENABLED = SHEETS_API_URL.startsWith("https://script.google.com");

export function useVoters() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar, carga desde Google Sheets si está configurado; si no, usa la base local
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      if (IS_SYNC_ENABLED) {
        try {
          const fromSheet = await getAllVotersFromSheet();
          if (fromSheet.length > 0) {
            setVoters(fromSheet);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fromSheet));
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn("⚠️ No se pudo cargar desde Google Sheets, usando caché local:", err);
        }
      }

      // Fallback: leer de caché o del archivo estático
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVoters(parsed);
            setIsLoading(false);
            return;
          }
        } catch { /* ignore */ }
      }

      setVoters(BASE_VOTERS);
      setIsLoading(false);
    }

    init();
  }, []);

  // Guarda en caché local cada vez que cambia
  useEffect(() => {
    if (voters.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(voters));
    }
  }, [voters]);

  const loadVoters = useCallback((data: Voter[]) => {
    setVoters(data);
  }, []);

  // Actualiza el estado en la app Y en Google Sheets simultáneamente
  const updateVoterStatus = useCallback((id: string, status: VoterStatus) => {
    setVoters((prev) => {
      const updated = prev.map((v) => {
        if (v.id !== id) return v;
        if (IS_SYNC_ENABLED) {
          syncStatusToSheet(v.cedula, estadoToYaVoto(status)).catch((err) =>
            console.warn("⚠️ No se pudo sincronizar estado con Sheet:", err)
          );
        }
        return { ...v, estado: status };
      });
      return updated;
    });
  }, []);

  // Actualiza el comentario en la app Y en Google Sheets
  const updateVoterComment = useCallback((id: string, comentario: string) => {
    setVoters((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        if (IS_SYNC_ENABLED) {
          syncCommentToSheet(v.cedula, comentario).catch((err) =>
            console.warn("⚠️ No se pudo sincronizar comentario con Sheet:", err)
          );
        }
        return { ...v, comentario };
      })
    );
  }, []);

  const clearData = useCallback(() => {
    setVoters(BASE_VOTERS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    voters,
    isLoading,
    isSyncEnabled: IS_SYNC_ENABLED,
    loadVoters,
    updateVoterStatus,
    updateVoterComment,
    clearData,
  };
}
