import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';
import { REFRESH_INTERVAL_MS } from './config';

// Récupère les signalements actifs toutes les 15 s et repère ceux qui viennent
// d'arriver depuis d'autres usagers, pour les annoncer à l'utilisateur.
export function useReports(currentUserId) {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [newFromOthers, setNewFromOthers] = useState([]);
  const knownIds = useRef(null);

  const refresh = useCallback(async () => {
    try {
      const { reports: list } = await api.listReports();
      if (knownIds.current) {
        const fresh = list.filter(
          (r) => !knownIds.current.has(r.id) && r.auteur.id !== currentUserId,
        );
        if (fresh.length) setNewFromOthers((prev) => [...fresh, ...prev].slice(0, 5));
      }
      knownIds.current = new Set(list.map((r) => r.id));
      setReports(list);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [currentUserId]);

  const pullToRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  // Ajoute tout de suite son propre signalement à la liste, sans attendre le prochain rafraîchissement.
  const addLocal = useCallback((report) => {
    knownIds.current?.add(report.id);
    setReports((prev) => [report, ...prev.filter((r) => r.id !== report.id)]);
  }, []);

  const dismissNew = useCallback(() => setNewFromOthers([]), []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [refresh]);

  return { reports, error, refreshing, pullToRefresh, addLocal, newFromOthers, dismissNew };
}
