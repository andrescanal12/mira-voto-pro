import { useState, useEffect, useCallback } from "react";
import { Voter, VoterStatus } from "@/types/voter";

const STORAGE_KEY = "mira-voters-data";

export function useVoters() {
  const [voters, setVoters] = useState<Voter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(voters));
  }, [voters]);

  const loadVoters = useCallback((data: Voter[]) => {
    setVoters(data);
  }, []);

  const updateVoterStatus = useCallback((id: string, status: VoterStatus) => {
    setVoters((prev) =>
      prev.map((v) => (v.id === id ? { ...v, estado: status } : v))
    );
  }, []);

  const updateVoterComment = useCallback((id: string, comentario: string) => {
    setVoters((prev) =>
      prev.map((v) => (v.id === id ? { ...v, comentario } : v))
    );
  }, []);

  const clearData = useCallback(() => {
    setVoters([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { voters, loadVoters, updateVoterStatus, updateVoterComment, clearData };
}
