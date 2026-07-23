import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../UI';
import { initDatabase } from '../services/database';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  
  useEffect(() => { 
    initDatabase(); 
  }, []);

  const handleLogin = () => {
    if (!email.includes('@')) return Alert.alert("Error", "Enter valid email");
    const isLibrarian = email.toLowerCase().endsWith('@protonmail.com');
    navigation.replace('DrawerRoot', { isLibrarian, userEmail: email.toLowerCase() });
  };

  return (
    <View style={styles.centerContainer}>
      <Icon name="library" size={80} color="#007AFF" />
      <Text style={styles.mainTitle}>Library Pro</Text>
      <TextInput style={styles.input} placeholder="Email Address" onChangeText={setEmail} autoCapitalize="none" />
      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
