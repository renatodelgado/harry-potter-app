import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Chip, IconButton, List, Text } from 'react-native-paper';
import MagicLoader from '../../components/MagicLoader';
import { getThemeForHouse, useHouse } from '../../contexts/HouseThemeContext';

interface Character {
  id: string;
  name: string;
  alternate_names: string[];
  house: string;
  image: string;
  actor: string;
  species: string;
  gender: string;
  dateOfBirth: string | null;
  ancestry: string;
  patronus: string;
  wand: { wood: string; core: string; length: number | null };
  hogwartsStudent: boolean;
  hogwartsStaff: boolean;
  alive: boolean;
  eyeColour: string;
  hairColour: string;
}

export default function CharacterDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useHouse();
  const router = useRouter();

  const [character, setCharacter] = useState<Character | null>(null);
  const [photoUrl, setPhotoUrl] = useState<any>({ uri: 'https://ik.imagekit.io/hpapi/hogwarts-crest.png' });
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageFetched, setImageFetched] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await axios.get(`https://hp-api.onrender.com/api/character/${id}`);
        const char: Character = res.data[0];
        setCharacter(char);

        if (char.image && char.image.includes('ik.imagekit.io/hpapi')) {
          setPhotoUrl({ uri: char.image });
          setImageFetched(true);
        }

        setImageError(null);
        setImageLoading(false);
        setLoading(false);
      } catch (err) {
        console.log('Erro ao carregar imagem da wiki:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCharacter();
  }, [id]);

  // traduz species e retorna metadados visuais (label, ícone, cores)
  const getSpeciesInfo = (raw?: string | null) => {
    const s = (raw || '').toLowerCase().trim();

    const map: Record<string, { label: string; icon: string; color?: string }> = {
      human: { label: 'Humano', icon: 'account' },
      'half-giant': { label: 'Meio-gigante', icon: 'account' },
      werewolf: { label: 'Lobisomem', icon: 'paw' },
      wolf: { label: 'Lobisomem', icon: 'paw' },
      owl: { label: 'Coruja', icon: 'owl' },
      dog: { label: 'Cão', icon: 'dog' },
      cat: { label: 'Gato', icon: 'cat' },
      snake: { label: 'Serpente', icon: 'snake' },
      serpent: { label: 'Serpente', icon: 'snake' },
      phoenix: { label: 'Fênix', icon: 'fire' },
      dragon: { label: 'Dragão', icon: 'paw' },
      centaur: { label: 'Centauro', icon: 'horse' },
      goblin: { label: 'Duende', icon: 'trophy' },
      'house-elf': { label: 'Elfo doméstico', icon: 'face-man' },
      'house elf': { label: 'Elfo doméstico', icon: 'face-man' },
      ghost: { label: 'Fantasma', icon: 'ghost' },
      poltergeist: { label: 'Poltergeist', icon: 'ghost' },
      'three-headed dog': { label: 'Cão 3-cabeças', icon: 'dog' },
      hippogriff: { label: 'Hipogrifo', icon: 'bird' },
      acromantula: { label: 'Acromântula', icon: 'spider' },
      selkie: { label: 'Selkie', icon: 'water' },
      'pygmy puff': { label: 'Pygmy Puff', icon: 'balloon' },
      toad: { label: 'Sapo', icon: 'paw' },
      vampire: { label: 'Vampiro', icon: 'tooth' },
      giant: { label: 'Gigante', icon: 'account' },
      cephalopod: { label: 'Cefalópode', icon: 'octagon' },
      horse: { label: 'Cavalo', icon: 'horse' }
    };

    if (map[s]) return map[s];

    for (const key of Object.keys(map)) {
      if (s.includes(key)) return map[key];
    }

    return { label: s ? capitalize(s) : 'Desconhecido', icon: 'paw' };
  };

  const capitalize = (str: string) => {
    return str.replace(/(^|\s)\S/g, t => t.toUpperCase());
  };

  function translateHouse(house?: string | null) {
    if (!house || house.trim() === '') return 'Sem casa';
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

  const hexToRgba = (hex?: string, alpha = 1) => {
    if (!hex) return `rgba(255,255,255,${alpha})`;
    const h = hex.replace('#', '');
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const speciesInfo = useMemo(() => getSpeciesInfo(character?.species), [character?.species]);

  const fetchWikiImage = async () => {
    if (!character) return;
    if (imageLoading || imageFetched) return;

    setImageLoading(true);
    setImageError(null);
    const controller = new AbortController();
    imageFetchController.current = controller;
    try {
      const wikiName = encodeURIComponent(character.name.replace(/ /g, '_'));
      const wikiUrl = `https://harrypotter.fandom.com/wiki/${wikiName}`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${wikiUrl}`;

      const response = await fetch(proxyUrl, { signal: controller.signal });
      if (!response.ok) throw new Error('Proxy falhou');

      const html = await response.text();
      const match = /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i.exec(html);

      if (match?.[1]) {
        let imageUrl = match[1].split('/revision')[0].replace(/\/scale-to-width-down\/\d+/, '');

        setPhotoUrl({
          uri: imageUrl,
          headers: {
            Referer: 'https://harrypotter.fandom.com/',
            'User-Agent': 'Mozilla/5.0'
          }
        });
        setImageFetched(true);
      } else {
        setImageError('Imagem não encontrada');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.log('Erro ao carregar imagem da wiki (on demand):', err);
      setImageError('Falha ao carregar imagem');
    } finally {
      setImageLoading(false);
    }
    // limpa referência ao controller
    imageFetchController.current = null;
  };

  const imageFetchController = useRef<AbortController | null>(null);

  // aborta requisição de imagem em caso de unmount
  useEffect(() => {
    return () => {
      imageFetchController.current?.abort();
    };
  }, []);

  // theme for this character (falls back to neutral if no house)
  const charTheme = character ? getThemeForHouse(character.house) : undefined;

  if (loading) {
    return <MagicLoader message={`Invocando ${character?.name || 'o bruxo'}...`} />;
  }

  if (!character) {
    return <Text style={styles.error}>Personagem não encontrado</Text>;
  }

  const theme = charTheme ?? colors;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Hero com gradiente da casa */}
      <View style={styles.heroContainer}>
        <ImageBackground source={photoUrl} style={styles.heroImage} resizeMode="cover">
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)', theme.background]} style={StyleSheet.absoluteFill} />
        </ImageBackground>

        <View style={styles.heroContent}>
          <IconButton
            icon="arrow-left"
            size={26}
            onPress={() => router.back()}
            style={styles.backButton}
            iconColor="#FFF"
          />
          <Text variant="displayMedium" style={styles.name}>
            {character.name}
          </Text>
          {character.alternate_names.length > 0 && (
            <Text style={styles.nickname}>"{character.alternate_names.join(' • ')}"</Text>
          )}
          {character.house && (
            <View style={[styles.houseBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.houseText}>{translateHouse(character.house)}</Text>
            </View>
          )}

          {/* botão para carregar imagem via web-scraping sob demanda */}
          {imageLoading ? (
            <ActivityIndicator size={20} color={theme.accent} style={{ marginTop: 12 }} />
          ) : (
            !imageFetched && (!character.image || !character.image.includes('ik.imagekit.io/hpapi')) && (
              <Chip
                icon="cloud-download"
                onPress={fetchWikiImage}
                style={[styles.loadImageChip, { marginTop: 12 }]}
                textStyle={{ color: theme.text }}
              >
                Carregar imagem
              </Chip>
            )
          )}

          {imageError && <Text style={{ color: '#FFB4B4', marginTop: 8 }}>{imageError}</Text>}
        </View>
      </View>

      {/* Chips de status */}
      <View style={styles.chipsContainer}>
        {character.hogwartsStudent && (
          <Chip
            icon="school"
            onPress={() => router.push('/characters?chip=student')}
            style={[
              styles.chip,
              {
                backgroundColor: "#fff",
                borderColor: hexToRgba(theme.accent, 0.12),
                borderWidth: 0
              }
            ]}
            textStyle={{ color: theme.accent }}
          >
            Estudante
          </Chip>
        )}
        {character.hogwartsStaff && (
          <Chip
            icon="book-open"
            onPress={() => router.push('/characters?chip=staff')}
            style={[
              styles.chip,
              {
                backgroundColor: '#fff',
                borderColor: hexToRgba(theme.accent, 0.12),
                borderWidth: 0
              }
            ]}
            textStyle={{ color: theme.accent }}
          >
            Professor
          </Chip>
        )}
        {!character.alive && (
          <Chip
            icon="skull"
            onPress={() => router.push('/characters?chip=dead')}
            style={[
              styles.chip,
              {
                backgroundColor: '#fff',
                borderColor: hexToRgba(theme.accent, 0.12),
                borderWidth: 0
              }
            ]}
            textStyle={{ color: theme.accent }}
          >
            Morto
          </Chip>
        )}
        <Chip
          icon={speciesInfo.icon}
          onPress={() => router.push(`/characters?chip=species:${encodeURIComponent(character.species || '')}`)}
          style={[
            styles.chip,
            {
              backgroundColor: '#fff',
              borderColor: hexToRgba(theme.accent, 0.12),
              borderWidth: 0
            }
          ]}
          textStyle={{ color: theme.accent }}
        >
          {speciesInfo.label}
        </Chip>
        <Chip
          icon="gender-male-female"
          onPress={() => router.push(`/characters?chip=gender:${character.gender || ''}`)}
          style={[
            styles.chip,
            {
              backgroundColor: '#fff',
              borderColor: hexToRgba(theme.accent, 0.12),
              borderWidth: 0
            }
          ]}
          textStyle={{ color: theme.accent }}
        >
          {character.gender === 'male' ? 'Masculino' : 'Feminino'}
        </Chip>
      </View>

      {/* Card de informações */}
      <Card style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
        <Card.Content>
          <List.Section>
            <List.Item
              title="Casa"
              description={character.house ? translateHouse(character.house) : 'Desconhecida'}
              left={() => <List.Icon icon="shield-home" color={theme.accent} />}
              titleStyle={[styles.listTitle, { color: theme.accent }]}
              descriptionStyle={[styles.listDesc, { color: theme.text, opacity: 0.95 }]}
            />
            <List.Item
              title="Ator/Atriz"
              description={character.actor || 'Sem ator/atriz'}
              left={() => <List.Icon icon="movie" color={theme.accent} />}
              titleStyle={[styles.listTitle, { color: theme.accent }]}
              descriptionStyle={[styles.listDesc, { color: theme.text, opacity: 0.95 }]}
            />
            <List.Item
              title="Nascimento"
              description={character.dateOfBirth || 'Desconhecido'}
              left={() => <List.Icon icon="calendar" color={theme.accent} />}
              titleStyle={[styles.listTitle, { color: theme.accent }]}
              descriptionStyle={[styles.listDesc, { color: theme.text, opacity: 0.95 }]}
            />
            <List.Item
              title="Ancestralidade"
              description={character.ancestry || 'Desconhecida'}
              left={() => <List.Icon icon="family-tree" color={theme.accent} />}
              titleStyle={[styles.listTitle, { color: theme.accent }]}
              descriptionStyle={[styles.listDesc, { color: theme.text, opacity: 0.95 }]}
            />
            <List.Item
              title="Patrono"
              description={character.patronus || 'Nenhum'}
              left={() => <List.Icon icon="paw" color={theme.accent} />}
              titleStyle={[styles.listTitle, { color: theme.accent }]}
              descriptionStyle={[styles.listDesc, { color: theme.text, opacity: 0.95 }]}
            />
            <List.Item
              title="Varinha"
              description={`${character.wand.wood || '?'} / ${character.wand.core || '?'} / ${character.wand.length || '?'}`}
              left={() => <List.Icon icon="auto-fix" color={theme.accent} />}
              titleStyle={[styles.listTitle, { color: theme.accent }]}
              descriptionStyle={[styles.listDesc, { color: theme.text, opacity: 0.95 }]}
            />
            <List.Item
              title="Olhos"
              description={character.eyeColour || 'Desconhecido'}
              left={() => <List.Icon icon="eye" color={theme.accent} />}
              titleStyle={[styles.listTitle, { color: theme.accent }]}
              descriptionStyle={[styles.listDesc, { color: theme.text, opacity: 0.95 }]}
            />
            <List.Item
              title="Cabelo"
              description={character.hairColour || 'Desconhecido'}
              left={() => <List.Icon icon="face-woman-shimmer" color={theme.accent} />}
              titleStyle={[styles.listTitle, { color: theme.accent }]}
              descriptionStyle={[styles.listDesc, { color: theme.text, opacity: 0.95 }]}
            />
          </List.Section>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#FF8080', textAlign: 'center', marginTop: 100, fontSize: 20 },
  heroContainer: { height: 420, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden', elevation: 12 },
  heroImage: { width: '100%', height: '100%' },
  heroContent: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  name: { color: '#FFF', fontSize: 34, fontWeight: '900', textAlign: 'center', textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 6 },
  nickname: { color: '#FFDD66', fontSize: 18, fontStyle: 'italic', marginTop: 8, opacity: 0.95 },
  houseBadge: { marginTop: 12, paddingHorizontal: 22, paddingVertical: 8, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)' },
  houseText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  backButton: { position: 'absolute', left: 12, top: 12, backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 10 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 16, gap: 10 },
  chip: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, minWidth: 92, justifyContent: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.05)' },
  deadChip: { backgroundColor: 'rgba(139,0,0,0.9)', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  loadImageChip: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 6 },
  infoCard: { margin: 16, marginTop: 0, borderRadius: 18, borderWidth: 0, elevation: 8, backgroundColor: 'rgba(255,255,255,0.02)' },
  listTitle: { fontWeight: '800', fontSize: 16, color: '#FFD670' },
  listDesc: { fontSize: 15, color: '#EEE', opacity: 0.95 },
});