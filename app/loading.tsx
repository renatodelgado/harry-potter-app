import { ActivityIndicator, Image, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('../assets/images/harrypotterapp.jpg')}
        style={{ width: 120, height: 120, marginBottom: 32 }}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={{ color: '#ffffff', marginTop: 24, fontSize: 16 }}>
        Carregando...
      </Text>
    </View>
  );
}