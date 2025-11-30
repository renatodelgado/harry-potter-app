// app/(tabs)/characters.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Text, TextInput, TouchableRipple } from 'react-native-paper';
import MagicLoader from '../../components/MagicLoader';
import { getThemeForHouse, useHouse } from '../../contexts/HouseThemeContext';
import { Character, getCharacters } from '../../services/api';

function translateHouse(house?: string | null) {
  if (!house || house.trim() === '') return '';
  switch (house) {
    case 'Gryffindor':
      return 'Grifinória';
    case 'Slytherin':
      return 'Sonserina';
    case 'Ravenclaw':
      return 'Corvinal';
    case 'Hufflepuff':
      return 'Lufa-Lufa';
    default:
      return house;
  }
}

type Filter = 'all' | 'Gryffindor' | 'Slytherin' | 'Ravenclaw' | 'Hufflepuff' | 'none';

const filterOptions = [
  { name: 'all' as const, label: 'Todos', color: '#fff' },
  { name: 'Gryffindor' as const, label: 'Grifinória', color: '#AE0001' },
  { name: 'Slytherin' as const, label: 'Sonserina', color: '#1A472A' },
  { name: 'Ravenclaw' as const, label: 'Corvinal', color: '#0E1A40' },
  { name: 'Hufflepuff' as const, label: 'Lufa-Lufa', color: '#ECB939' },
  { name: 'none' as const, label: 'Sem casa', color: '#202020' },
];

export default function CharactersScreen() {
  const { colors, house } = useHouse(); // pegamos house também!
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filtered, setFiltered] = useState<Character[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { filter: filterParam, chip: chipParam } = useLocalSearchParams<{ filter?: string; chip?: string }>();

  const router = useRouter();



  const clearFilters = () => {
    setFilter('all');
    router.replace('/characters');
  };

  const getActiveFilterLabel = () => {
    if (chipParam) {
      if (chipParam === 'student') return 'Filtro ativo: Estudantes';
      if (chipParam === 'staff') return 'Filtro ativo: Professores';
      if (chipParam === 'dead') return 'Filtro ativo: Mortos';
      if (chipParam.startsWith('species:')) {
        const val = decodeURIComponent(chipParam.split(':')[1] || '');
        return `Filtro ativo: Espécie — ${val || 'Desconhecida'}`;
      }
      if (chipParam.startsWith('gender:')) {
        const val = (chipParam.split(':')[1] || '').toLowerCase();
        return `Filtro ativo: Gênero — ${val === 'male' ? 'Masculino' : val === 'female' ? 'Feminino' : val || 'Desconhecido'}`;
      }
      return `Filtro ativo: ${chipParam}`;
    }

    if (filter === 'all') return 'Filtro ativo: Todos';
    if (filter === 'none') return 'Filtro ativo: Sem casa';
    return `Filtro ativo: ${translateHouse(filter)}`;
  };

  useEffect(() => {
    if (filterParam) {
      // aceitar apenas valores válidos; se inválido, manter 'all'
      const allowed = ['all', 'Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff', 'none'];
      if (allowed.includes(filterParam)) {
        setFilter(filterParam as Filter);
      } else {
        setFilter('all');
      }
    }
  }, [filterParam]);

  useEffect(() => {
    getCharacters().then(data => {
      setCharacters(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let list = characters;
    if (filter === 'none') {
      list = list.filter(c => !c.house || c.house.trim() === '');
    } else if (filter !== 'all') {
      list = list.filter(c => c.house === filter);
    }

    if (chipParam) {
      if (chipParam === 'student') {
        list = list.filter(c => c.hogwartsStudent);
      } else if (chipParam === 'staff') {
        list = list.filter(c => c.hogwartsStaff);
      } else if (chipParam === 'dead') {
        list = list.filter(c => !c.alive);
      } else if (chipParam.startsWith('species:')) {
        const val = decodeURIComponent(chipParam.split(':')[1] || '').toLowerCase();
        if (val) list = list.filter(c => (c.species || '').toLowerCase().includes(val));
      } else if (chipParam.startsWith('gender:')) {
        const val = (chipParam.split(':')[1] || '').toLowerCase();
        if (val) list = list.filter(c => (c.gender || '').toLowerCase() === val);
      }
    }

    const term = search.trim().toLowerCase();
    if (term.length > 0) {
      list = list.filter(c => {
        const name = (c.name || '').toLowerCase();
        const actor = (c.actor || '').toLowerCase();
        return name.includes(term) || actor.includes(term);
      });
    }

    setFiltered(list);
  }, [filter, characters, search, chipParam]);

  if (loading) {
    return <MagicLoader message="Carregando personagens..." />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
      <View style={{ flex: 1, backgroundColor: '#686262' }}>
        {/* BUSCA */}
        <View style={styles.searchRow} pointerEvents="box-none">
          <TextInput
            mode="flat"
            placeholder="Buscar personagens..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            left={<TextInput.Icon icon="magnify" />}
            right={search ? <TextInput.Icon icon="close" onPress={() => setSearch('')} /> : undefined}
            placeholderTextColor="rgba(255,255,255,0.6)"
            theme={{ colors: { text: '#FFF', placeholder: 'rgba(255,255,255,0.6)' } }}
          />
        </View>

        {/* BARRA DE FILTROS */}
        <View style={[
          styles.filterBar,
          { backgroundColor: 'rgba(78, 78, 78, 0.65)', borderColor: 'rgba(255,255,255,0.06)' }
        ]}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filterOptions}
            keyExtractor={item => item.name}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            renderItem={({ item }) => {
              const isActive = filter === item.name;
              return (
                <TouchableRipple
                  onPress={() => setFilter(item.name)}
                  rippleColor="rgba(255,215,0,0.3)"
                  style={{ marginHorizontal: 8 }}
                >
                  <View style={[
                    styles.filterItem,
                    isActive && styles.filterActive
                  ]}>
                    <MaterialCommunityIcons name="shield" size={36} color={item.color} />
                    <Text style={[
                      styles.filterLabel,
                      { color: isActive ? '#FFFFFF' : '#AAAAAA' }
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableRipple>
              );
            }}
          />
        </View>

        {/* Indicador do filtro ativo */}
        <View style={styles.filterIndicator}>
          <View style={styles.filterIndicatorRow}>
            <Text style={styles.filterIndicatorText} numberOfLines={1} ellipsizeMode="tail">{getActiveFilterLabel()}</Text>
            <IconButton icon="close" size={18} onPress={clearFilters} style={styles.clearButton} iconColor="#DDD" />
          </View>
        </View>

        {/* LISTA DE PERSONAGENS */}
        <FlatList
          data={filtered}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.text }]}>
              Nenhum bruxo encontrado
            </Text>
          }
          renderItem={({ item }) => {
            const themeForChar = getThemeForHouse(item.house);
            const characterColor = themeForChar?.primary ?? '#666666';
            const characterTextColor = themeForChar?.text ?? '#FFFFFF';
            const characterSecondaryColor = themeForChar?.secondary ?? '#dddddd';
            const characterAccentColor = themeForChar?.accent ?? '#9E9E9E';
            const characterGradientColor = themeForChar?.gradient[0] ?? '#333333';
            const gr = characterGradientColor + 'DD';
            const shieldColor = themeForChar?.accent ?? '#666666';
            const characterBackground = themeForChar?.background ?? '#121212';

            return (
              <Link href={`/character/${item.id}`} asChild>
                <TouchableOpacity activeOpacity={0.8}>
                  <View style={[
                    styles.card,
                    {
                      backgroundColor: characterBackground,
                      borderLeftColor: characterAccentColor,
                    }
                  ]}>


                    <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
                      {item.name}
                    </Text>

                    <Text style={[styles.house, { color: characterSecondaryColor }]}> {translateHouse(item.house)}</Text>

                    <View style={styles.statusContainer}>
                      <View style={styles.badges}>

                        {item.hogwartsStudent && (
                          <View style={styles.badge}>
                            <MaterialCommunityIcons name="school" size={16} color="#FFD700" />
                            <Text style={styles.badgeText}>Estudante</Text>
                          </View>
                        )}
                        {item.hogwartsStaff && (
                          <View style={styles.badge}>
                            <MaterialCommunityIcons name="book-open-variant" size={16} color="#9C27B0" />
                            <Text style={styles.badgeText}>Professor</Text>
                          </View>
                        )}
                      </View>

                      {!item.alive && (
                        <MaterialCommunityIcons name="cross" size={24} color="#C62828" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            );
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterBar: { backgroundColor: '#0A0A0A', paddingVertical: 14, borderBottomWidth: 1, borderColor: '#333' },
  filterItem: { alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  filterActive: { backgroundColor: 'rgba(255,215,0,0.15)', borderWidth: 2, borderColor: '#FFD700' },
  filterLabel: { marginTop: 6, fontSize: 13, fontWeight: '700' },
  list: { padding: 16, paddingTop: 8 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    flex: 1,
    marginHorizontal: 8,
    height: 160,
    width: 160,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 6,
    elevation: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  shield: { marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '800', textAlign: 'center', lineHeight: 22 },
  house: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  statusContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  badges: { flexDirection: 'row', gap: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 60, fontSize: 18, opacity: 0.7 },
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    width: '100%',
  },
  searchInput: {
    borderRadius: 30,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.06)'
  },
  filterIndicator: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.02)', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  filterIndicatorText: { color: '#DDD', fontSize: 13 },
  filterIndicatorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  clearButton: { margin: 0 },
});