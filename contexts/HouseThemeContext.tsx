import { LinearGradient } from 'expo-linear-gradient';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { StyleSheet } from 'react-native';

type House = 'Gryffindor' | 'Slytherin' | 'Ravenclaw' | 'Hufflepuff' | null;

interface HouseTheme {
  house: House;
  setHouse: (house: House) => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
    gradient: readonly [string, string, ...string[]];
    activeBar?: string;
    inactiveBar?: string;
  };
}

const themes = {
  Gryffindor: {
    primary: '#AE0001',
    secondary: '#EEBA30',
    background: '#1B0A0A',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    accent: '#AE0001',
    gradient: ['#740001', '#AE0001', '#EEBA30'],
    activeBar: '#fff',
    inactiveBar: '#a8a6a6',
  },
  Slytherin: {
    primary: '#1A472A',
    secondary: '#AAAAAA',
    background: '#0B1D0A',
    surface: '#112318',
    text: '#FFFFFF',
    accent: '#5D7B66',
    gradient: ['#0D6217', '#1A472A', '#2E8B57'],
    activeBar: '#fff',
    inactiveBar: '#8d8d8d',
  },
  Ravenclaw: {
    primary: '#0E1A40',
    secondary: '#946B2D',
    background: '#141F2B',
    surface: '#152038',
    text: '#FFFFFF',
    accent: '#5A7ABF',
    gradient: ['#0E1A40', '#222F5B', '#946B2D'],
    activeBar: '#fff',
    inactiveBar: '#818181',
  },
  Hufflepuff: {
    primary: '#ECB939',
    secondary: '#F0C75E',
    background: '#372E29',
    surface: '#2D2310',
    text: '#FFFFFF',
    accent: '#ECB939',
    gradient: ['#372E29', '#726255', '#ECB939'],
    activeBar: '#fff',
    inactiveBar: '#555555',
  },
} as const;

const neutralTheme = {
  primary: '#5f5f5f',
  secondary: '#474747',
  background: '#0B0B0C',
  surface: '#141414',
  text: '#FFFFFF',
  accent: '#AFAFAF',
  gradient: ['#0B0B0C', '#2B2B2B'],
  activeBar: '#FFFFFF',
  inactiveBar: '#8a8a8a',
} as const;

const HouseContext = createContext<HouseTheme | undefined>(undefined);

export function HouseProvider({ children }: { children: ReactNode }) {
  const [house, setHouse] = useState<House>(null);

  const colors = house ? themes[house] : themes.Gryffindor;

  return (
    <HouseContext.Provider value={{ house, setHouse, colors }}>
      <LinearGradient
        colors={colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </HouseContext.Provider>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
});

export function useHouse() {
  const context = useContext(HouseContext);
  if (!context) throw new Error('useHouse must be used within HouseProvider');
  return context;
}

// Helper: retorna o tema (cores) para uma casa específica sem depender do estado do provider
export function getThemeForHouse(house?: string | null) {
  if (!house) return neutralTheme;
  if (house === 'none') return neutralTheme;
  if (house in themes) {
    return themes[house as keyof typeof themes];
  }
  return neutralTheme;
}