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

const STORAGE_KEY = "mira-voters-data-v2";
const IS_SYNC_ENABLED = SHEETS_API_URL.startsWith("https://script.google.com");

export function useVoters() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Carga inicial desde Google Sheets o caché local ──
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

  // ── Caché local ──
  useEffect(() => {
    if (voters.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(voters));
    }
  }, [voters]);

  // ── Actualiza estado localmente y envía a Sheets ──
  const updateVoterStatus = useCallback((id: string, status: VoterStatus) => {
    setVoters((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        if (IS_SYNC_ENABLED) {
          syncStatusToSheet(v.cedula, estadoToYaVoto(status)).catch((err) =>
            console.warn("⚠️ Sync estado:", err)
          );
        }
        return { ...v, estado: status };
      })
    );
  }, []);

  // ── Actualiza comentario localmente y envía a Sheets ──
  const updateVoterComment = useCallback((id: string, comentario: string) => {
    setVoters((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        if (IS_SYNC_ENABLED) {
          syncCommentToSheet(v.cedula, comentario).catch((err) =>
            console.warn("⚠️ Sync comentario:", err)
          );
        }
        return { ...v, comentario };
      })
    );
  }, []);

  const loadVoters = useCallback((data: Voter[]) => { setVoters(data); }, []);
  const clearData = useCallback(() => {
    setVoters(BASE_VOTERS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    voters,
    isLoading,
    loadVoters,
    updateVoterStatus,
    updateVoterComment,
    clearData,
  };
}
