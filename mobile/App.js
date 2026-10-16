import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AlertBanner from './src/components/AlertBanner';
import NavigationBar from './src/components/NavigationBar';
import Snackbar from './src/components/Snackbar';
import TopAppBar from './src/components/TopAppBar';
import LoginScreen from './src/screens/LoginScreen';
import SignalerScreen from './src/screens/SignalerScreen';
import TraficScreen from './src/screens/TraficScreen';
import { useReports } from './src/useReports';
import { useSession } from './src/session';
import { colors } from './src/theme';

// Onglets de la barre de navigation. Ajoutez ici les écrans des autres stories.
const TABS = [
  { key: 'trafic', label: 'Trafic', icon: 'car-multiple', iconActive: 'car-multiple' },
  { key: 'signaler', label: 'Signaler', icon: 'alert-octagon-outline', iconActive: 'alert-octagon' },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    ...MaterialCommunityIcons.font,
  });

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {fontsLoaded ? <Root /> : <Loading />}
    </SafeAreaProvider>
  );
}

function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

function Root() {
  const { session, loading, login, logout } = useSession();

  if (loading) return <Loading />;

  if (!session) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoginScreen onLogin={login} />
      </SafeAreaView>
    );
  }

  return <Main session={session} onLogout={logout} />;
}

function Main({ session, onLogout }) {
  const [tab, setTab] = useState('trafic');
  const [position, setPosition] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const { reports, error, refreshing, pullToRefresh, addLocal, newFromOthers, dismissNew } =
    useReports(session.user.id);

  const handleCreated = useCallback(
    (report) => {
      addLocal(report);
      setConfirmation('Signalement envoyé. Il est maintenant visible par tous les usagers.');
      setTab('trafic');
    },
    [addLocal],
  );

  useEffect(() => {
    if (!confirmation) return;
    const t = setTimeout(() => setConfirmation(null), 4000);
    return () => clearTimeout(t);
  }, [confirmation]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <TopAppBar userName={session.user.name} onLogout={onLogout} />

      <AlertBanner
        reports={newFromOthers}
        onOpen={() => {
          dismissNew();
          setTab('trafic');
        }}
        onDismiss={dismissNew}
      />

      <View style={styles.body}>
        {tab === 'trafic' && (
          <TraficScreen
            reports={reports}
            error={error}
            refreshing={refreshing}
            onRefresh={pullToRefresh}
            userId={session.user.id}
            position={position}
          />
        )}
        {tab === 'signaler' && (
          <SignalerScreen token={session.token} onCreated={handleCreated} onPosition={setPosition} />
        )}
        <Snackbar message={confirmation} />
      </View>

      <NavigationBar tabs={TABS} current={tab} onChange={setTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  body: { flex: 1 },
});
