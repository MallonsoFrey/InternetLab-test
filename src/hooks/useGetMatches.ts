import { useCallback, useEffect, useState } from "react";
import { MATCHES_URL } from "../config";
import mockData from "../../data/matches.json";

export type Match = {
  id: string;
  startsAt: string | null;
  status: string;
  minute?: number;
  home: { id: string; name: string; city: string };
  away: { id: string; name: string; city: string };
  score: { home: number; away: number } | null;
};

export function useGetMatches() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(false);
    try {
      const response = await fetch(MATCHES_URL);
      if (!response.ok) throw new Error("Request failed");
      const data: { matches?: Match[] } = await response.json();
      if (!Array.isArray(data?.matches)) throw new Error("Matches not found");
      setMatches(data.matches);
    } catch {
      setMatches(mockData.matches);
      setError(true);
    } finally {
      setUpdatedAt(new Date());
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { matches, loading, refreshing, error, updatedAt, refresh };
}
