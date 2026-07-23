import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../UI';

export default function CustomDrawerContent(props: any) {
  const { userEmail } = props;
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Icon name="person-circle" size={80} color="#007AFF" />
        <Text style={styles.profileEmail}>{userEmail || 'Library User'}</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity style={styles.logoutButton} onPress={() => props.navigation.replace('Login')}>
        <Icon name="log-out-outline" size={20} color="red" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}
