import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

const STORAGE_KEY = 'traficam.session';

// Garde l'utilisateur connecté entre deux ouvertures de l'application.
export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) || 'null');
        if (saved?.token) {
          await api.me(saved.token);
          setSession(saved);
        }
      } catch (e) {
        // Jeton refusé par le serveur : on redemande la connexion.
        if (e.status === 401) await AsyncStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (phone, name) => {
    const data = await api.login(phone, name);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSession(data);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return { session, loading, login, logout };
}
