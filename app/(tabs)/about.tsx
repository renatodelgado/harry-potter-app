import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    Avatar,
    Button,
    Card,
    Divider,
    Surface,
    Text,
    useTheme
} from 'react-native-paper';
import { useHouse } from '../../contexts/HouseThemeContext';

export default function About() {
    const router = useRouter();
    const { colors } = useHouse();
    const theme = useTheme();

    return (
        <LinearGradient colors={['#0f0f0f', '#1a1a2e', '#16213e']} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Surface style={styles.surface} elevation={4}>
                    <Card mode="contained" style={styles.card}>
                        <Card.Content style={{ paddingBottom: 8 }}>
                            {/* Avatar + Título */}
                            <View style={styles.titleSection}>
                                <Avatar.Icon
                                    size={64}
                                    icon="auto-fix"
                                    color="#fff"
                                    style={{ backgroundColor: '#1e1e1e' }}
                                />
                                <Text variant="headlineMedium" style={styles.title}>
                                    Harry Potter App
                                </Text>
                                <Text variant="bodyMedium" style={styles.subtitle}>
                                    Trabalho Acadêmico • 2025
                                </Text>
                            </View>

                            <Divider style={{ marginVertical: 20 }} />

                            {/* Texto com destaque */}
                            <Text variant="bodyLarge" style={styles.paragraph}>
                                Aplicativo móvel desenvolvido com{' '}
                                <Text style={styles.highlight}>React Native</Text> +{' '}
                                <Text style={styles.highlight}>Expo Router</Text> consumindo a API pública:
                            </Text>

                            <Surface style={styles.apiBadge} elevation={2}>
                                <Text style={styles.apiText}>https://hp-api.onrender.com/api</Text>
                            </Surface>

                            <Text variant="bodyLarge" style={styles.paragraph}>
                                Interface construída com{' '}
                                <Text style={styles.highlight}>React Native Paper</Text> seguindo os princípios do
                                Material Design 3.
                            </Text>

                            <Text variant="bodyLarge" style={[styles.paragraph, { marginTop: 24 }]}>
                                Desenvolvido por
                            </Text>

                            {/* Card do aluno */}
                            <Card mode="elevated" style={styles.studentCard}>
                                <Card.Content style={{ padding: 16, alignItems: 'center' }}>
                                    <Avatar.Text label="RD" size={56} style={{ backgroundColor: colors.accent }} />
                                    <Text variant="titleLarge" style={{ color: '#FFF', marginTop: 12 }}>
                                        Renato Delgado
                                    </Text>
                                    <Text variant="bodyMedium" style={{ color: '#AAA', marginTop: 4 }}>
                                        Análise e Desenvolvimento de Sistemas
                                    </Text>
                                    <Text variant="bodySmall" style={{ color: '#888', marginTop: 8, textAlign: 'center' }}>
                                        Faculdade Senac Pernambuco
                                    </Text>
                                    <Text variant="labelMedium" style={{ color: colors.secondary, marginTop: 8 }}>
                                        Professor: Geraldo Júnior • Coding Mobile
                                    </Text>
                                </Card.Content>
                            </Card>

                            <Text variant="bodySmall" style={styles.note}>
                                Este é um trabalho acadêmico sem fins comerciais. Todos os dados de personagens e feitiços são fornecidos pela API pública mencionada.
                            </Text>
                        </Card.Content>
                    </Card>
                </Surface>

                {/* Botão flutuante estilizado */}
                <Button
                    mode="contained"
                    onPress={() => router.push('/')}
                    buttonColor={colors.accent}
                    contentStyle={{ height: 56 }}
                    labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                    style={styles.fab}
                    icon="home"
                >
                    Voltar ao Início
                </Button>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 8,
    },
    headerTitle: {
        color: '#fff',
        fontWeight: '800',
    },
    container: {
        padding: 20,
        paddingTop: 10,
        alignItems: 'center',
        paddingBottom: 100,
    },
    surface: {
        width: '100%',
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 20,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        color: '#fff',
        fontWeight: '900',
        marginTop: 16,
    },
    subtitle: {
        color: '#AAA',
        marginTop: 4,
    },
    paragraph: {
        color: '#E0E0E0',
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: 16,
    },
    highlight: {
        color: '#fff',
        fontWeight: 'bold',
    },
    apiBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        marginVertical: 12,
    },
    apiText: {
        color: '#FFD700',
        fontFamily: 'monospace',
        fontSize: 13,
    },
    studentCard: {
        marginVertical: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 16,
    },
    note: {
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 24,
        fontSize: 13,
    },
    fab: {
        marginTop: 32,
        borderRadius: 30,
        elevation: 8,
    },
});