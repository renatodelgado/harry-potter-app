// app/house/[house].tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, Title } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHouse } from '../../contexts/HouseThemeContext';

const houseInfo = {
    Gryffindor: {
        nome: 'Grifinória',
        fundador: 'Godric Gryffindor',
        animal: 'Leão',
        valores: 'Coragem, ousadia, bravura e cavalheirismo',
        frase: 'Você pertence à Grifinória!\nOnde moram os corajosos de coração.',
        icon: 'shield' as const,
    },
    Slytherin: {
        nome: 'Sonserina',
        fundador: 'Salazar Slytherin',
        animal: 'Serpente',
        valores: 'Ambição, astúcia, determinação e liderança',
        frase: 'Você foi escolhido pela Sonserina!\nOs grandes realizam grandes coisas.',
        icon: 'shield' as const,
    },
    Ravenclaw: {
        nome: 'Corvinal',
        fundador: 'Rowena Ravenclaw',
        animal: 'Águia',
        valores: 'Inteligência, criatividade, sabedoria e aprendizado',
        frase: 'Bem-vindo à Corvinal!\nOnde os de mente afiada prosperam.',
        icon: 'shield' as const,
    },
    Hufflepuff: {
        nome: 'Lufa-Lufa',
        fundador: 'Helga Hufflepuff',
        animal: 'Texugo',
        valores: 'Lealdade, paciência, trabalho duro e justiça',
        frase: 'Você é da Lufa-Lufa!\nOnde os leais e justos são valorizados.',
        icon: 'shield' as const,
    },
};

export default function HouseScreen() {
    const { house } = useLocalSearchParams<{ house: string }>();
    const router = useRouter();
    const { colors } = useHouse();

    

    const info = houseInfo[house as keyof typeof houseInfo];

    if (!info) {
        return (
            <View style={styles.error}>
                <Text style={{ color: '#FFF' }}>Casa não encontrada</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Button mode="contained" onPress={() => router.back()} style={styles.backButton} buttonColor={colors.accent}>
                Voltar
            </Button>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={info.icon} size={90} color={colors.accent} />
            </View>

            {/* Nome da casa */}
            <Title style={styles.houseName}>{info.nome}</Title>
            <Text style={styles.frase}>{info.frase}</Text>

            {/* Card com informações */}
            <Card style={styles.infoCard}>
                <Card.Content style={styles.cardContent}>
                    <Text style={styles.label}>Fundador(a)</Text>
                    <Text style={styles.value}>{info.fundador}</Text>

                    <Text style={styles.label}>Animal</Text>
                    <Text style={styles.value}>{info.animal}</Text>

                    <Text style={styles.label}>Valores</Text>
                    <Text style={styles.value}>{info.valores}</Text>
                </Card.Content>
            </Card>

            {/* Botão para os personagens da casa */}
            <Card
                style={styles.actionCard}
                onPress={() => router.push({ pathname: '/characters', params: { filter: house } })}
            >
                <Card.Content style={styles.actionContent}>
                    <MaterialCommunityIcons name="lightning-bolt" size={32} color="#fff" />
                    <Text style={styles.actionText}>Ver bruxos da {info.nome}</Text>
                    <MaterialCommunityIcons name="arrow-right-bold" size={32} color="#fff" />
                </Card.Content>
            </Card>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    iconContainer: {
        padding: 36,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 999,
        marginBottom: 32,
        elevation: 6,
    },
    houseName: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFF',
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 12,
        lineHeight: 42,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
    },
    frase: {
        fontSize: 18,
        color: '#EEE',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 26,
        fontStyle: 'italic',
        opacity: 0.95,
    },
    infoCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 16,
        marginBottom: 26,
        borderWidth: 0,
        elevation: 8,
    },
    cardContent: { padding: 18 },
    label: { color: '#BFBFBF', fontSize: 15, fontWeight: '600', marginTop: 12 },
    value: { color: '#FFF', fontSize: 18, fontWeight: '800', marginTop: 6 },
    actionCard: {
        width: '100%',
        backgroundColor: 'rgba(255,215,0,0.12)',
        borderRadius: 14,
        borderWidth: 0,
        elevation: 12,
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    actionText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
        flex: 1,
        marginLeft: 12,
        textAlign: 'center',
    },
    error: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
    },
});