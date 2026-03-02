import { useState, useEffect, useCallback } from "react";
import { Voter, VoterStatus } from "@/types/voter";
import { BASE_VOTERS } from "@/data/votersData";
import {
  updateVoterStatus as syncStatusToSheet,
  updateVoterComment as syncCommentToSheet,
  estadoToYaVoto,
  SHEETS_API_URL,
} from "@/services/sheetsApi";

const STORAGE_KEY = "mira-voters-data";
const IS_SYNC_ENABLED = SHEETS_API_URL.startsWith("https://script.google.com");

export function useVoters() {
  const [voters, setVoters] = useState<Voter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length >= 100) return parsed;
      } catch {
        // ignore
      }
    }
    localStorage.removeItem(STORAGE_KEY);
    return BASE_VOTERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(voters));
  }, [voters]);

  const loadVoters = useCallback((data: Voter[]) => {
    setVoters(data);
  }, []);

  // Actualiza el estado en la app Y en Google Sheets simultáneamente
  const updateVoterStatus = useCallback((id: string, status: VoterStatus) => {
    setVoters((prev) => {
      const updated = prev.map((v) => {
        if (v.id !== id) return v;
        // Sincroniza con Google Sheets si está configurado
        if (IS_SYNC_ENABLED) {
          syncStatusToSheet(v.cedula, estadoToYaVoto(status)).catch((err) =>
            console.warn("⚠️ No se pudo sincronizar con Sheet:", err)
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
    isSyncEnabled: IS_SYNC_ENABLED,
    loadVoters,
    updateVoterStatus,
    updateVoterComment,
    clearData,
  };
}
