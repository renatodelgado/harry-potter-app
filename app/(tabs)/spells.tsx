import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import MagicLoader from '../../components/MagicLoader';
import { getSpells, Spell } from '../../services/api';


export default function Spells() {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpells().then(data => {
      setSpells(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <MagicLoader message="Carregando feitiços..." />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#111' }}>
      <View style={styles.container}>
        {spells.map((spell) => (
          <Card key={spell.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.spell}>{spell.name}</Text>
              <Text style={styles.effect}>{spell.description}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 18 },
  header: { color: '#FFD770', textAlign: 'center', fontSize: 26, marginBottom: 18, fontWeight: '800' },
  card: { marginBottom: 14, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 14, elevation: 6 },
  spell: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  effect: { color: '#D1D1D1', marginTop: 6, lineHeight: 20 },
});