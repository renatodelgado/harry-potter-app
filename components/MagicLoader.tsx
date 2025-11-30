import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

interface Props {
  message?: string;
}

export default function MagicLoader({ message = 'Carregando...' }: Props) {
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;
  const a3 = useRef(new Animated.Value(0)).current;
  const a4 = useRef(new Animated.Value(0)).current;
  const rot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const float = (anim: Animated.Value, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -18, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true, delay }),
          Animated.timing(anim, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      );

    const r = Animated.loop(
      Animated.timing(rot, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: true })
    );

    const f1 = float(a1, 0);
    const f2 = float(a2, 140);
    const f3 = float(a3, 280);
    const f4 = float(a4, 420);

    f1.start();
    f2.start();
    f3.start();
    f4.start();
    r.start();

    return () => {
      f1.stop();
      f2.stop();
      f3.stop();
      f4.stop();
      r.stop();
    };
  }, [a1, a2, a3, rot]);

  const rotation = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <LinearGradient colors={["#121212", "#1b1b1b"]} style={styles.container}>
      <View style={styles.inner} pointerEvents="none">
        <View style={styles.orbsRow}>
          <Animated.View style={[styles.orb, { backgroundColor: '#AE0001', transform: [{ translateY: a1 }] }]} />
          <Animated.View style={[styles.orb, { backgroundColor: '#1A472A', transform: [{ translateY: a2 }] }]} />
          <Animated.View style={[styles.orb, { backgroundColor: '#0E1A40', transform: [{ translateY: a3 }] }]} />
          <Animated.View style={[styles.orb, { backgroundColor: '#ECB939', transform: [{ translateY: a4 }] }]} />
        </View>

        <Animated.View style={[styles.sparkle, { transform: [{ rotate: rotation }] }]} />

        <Text style={styles.message}>{message}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 18,
  },
  orb: {
    width: 24,
    height: 24,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    marginHorizontal: 10,
  },
  sparkle: {
    width: 18,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 6,
    marginBottom: 14,
    transform: [{ rotate: '45deg' }],
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  message: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    opacity: 0.95,
  },
});
