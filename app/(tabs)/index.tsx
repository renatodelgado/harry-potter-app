import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { useHouse } from '../../contexts/HouseThemeContext';

const houses = [
  { name: 'Gryffindor' as const, label: 'Grifinória', primary: '#AE0001', secondary: '#EEBA30' },
  { name: 'Slytherin' as const, label: 'Sonserina', primary: '#1A472A', secondary: '#AAAAAA' },
  { name: 'Ravenclaw' as const, label: 'Corvinal', primary: '#0E1A40', secondary: '#946B2D' },
  { name: 'Hufflepuff' as const, label: 'Lufa-Lufa', primary: '#ECB939', secondary: '#372E29' },
];

export default function Home() {
  const router = useRouter();
  const { house: selectedHouse, setHouse } = useHouse();

  const handleHouseSelect = (house: typeof houses[0]['name']) => {
    setHouse(house);
    router.push({ pathname: '/house/[house]', params: { house } });
  };

  return (
    <LinearGradient
      colors={['rgba(0, 0, 0, 1.000)', 'rgba(0, 0, 0, 0.7000)', 'rgba(0, 0, 0, 0.4000)']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Título */}
        <Text style={styles.title}>Harry Potter</Text>
        <Text style={styles.subtitle}>
          {selectedHouse ? 'Você foi selecionado para...' : 'O Chapéu Seletor está pronto'}
        </Text>

        {/* Grid das casas */}
        <View style={styles.housesGrid}>
          {houses.map((house) => {
            const isSelected = selectedHouse === house.name;

            return (
              <TouchableRipple
                key={house.name}
                onPress={() => setHouse(house.name)}
                rippleColor="rgba(255,255,255,0.4)"
                style={styles.buttonRipple}
              >
                <View
                  style={[
                    styles.houseButton,
                    {
                      backgroundColor: isSelected ? house.primary : house.primary + 'CC',
                      transform: [{ scale: isSelected ? 1.08 : 1 }],
                      shadowOpacity: isSelected ? 0.8 : 0.5,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="shield-outline"
                    size={90}
                    color={house.secondary}
                    style={styles.shieldIcon}
                  />

                  {isSelected && (
                    <View style={styles.selectedOverlay}>
                      <MaterialCommunityIcons name="check-circle" size={40} color="#FFF" />
                    </View>
                  )}

                  {/* Nome da casa */}
                  <Text style={styles.houseLabel}>{house.label}</Text>

                </View>
              </TouchableRipple>
            );
          })}
        </View>

        {/* Mensagem final quando já escolheu */}
        {selectedHouse ? (
          <TouchableRipple
            onPress={() => router.push({ pathname: '/house/[house]', params: { house: selectedHouse! } })}
            rippleColor="rgba(255,215,0,0.3)"
            style={{ marginTop: 40, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 30, backgroundColor: '#fff' }}
          >
            <Text style={{ color: '#000', fontSize: 18, fontWeight: '700' }}>
              Ir para o Salão Comunal da {houses.find(h => h.name === selectedHouse)?.label}
            </Text>
          </TouchableRipple>
        ) : (
          <Text style={styles.finalMessage}>
            Escolha sua casa para entrar no Salão Comunal
          </Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: '#000',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 16,
  },
  subtitle: {
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 60,
    fontWeight: '600',
    opacity: 0.9,
  },
  housesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 32,
    maxWidth: 400,
  },
  buttonRipple: {
    borderRadius: 50,
  },
  houseButton: {
    width: 160,
    height: 160,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 25,
    position: 'relative',
    overflow: 'hidden',
  },
  shieldIcon: {
    marginBottom: 8,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  houseLabel: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  selectedText: {
    position: 'absolute',
    bottom: 12,
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '900',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  finalMessage: {
    marginTop: 60,
    fontSize: 18,
    color: '#fff',
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'center',
  },
});