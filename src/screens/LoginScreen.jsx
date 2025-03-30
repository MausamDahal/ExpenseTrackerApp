import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { auth, signInWithEmailAndPassword } from '../../usefirebase';
import useStore from '../store/useStore';
import { useTheme } from '../theme/ThemeContext'; // Import useTheme hook

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme(); // Access the current theme
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useStore((state) => state.setUser);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Welcome Back</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Please sign in to continue
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={theme.textMuted}
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={theme.textMuted}
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
        secureTextEntry
      />

      <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.link, { color: theme.accent }]}>
          Don’t have an account? <Text style={{ fontWeight: 'bold' }}>Register</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  link: { marginTop: 10, textAlign: 'center', fontSize: 14 },
});
