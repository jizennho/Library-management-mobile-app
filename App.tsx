import React from 'react';

// Navigation Imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

// Components & Screens
import CustomDrawerContent from './components/CustomDrawer';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import BookLendScreen from './screens/BookLendScreen';
import EditBookScreen from './screens/EditBookScreen';
import BookDetailScreen from './screens/BookDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabNavigator({ route }: any) {
  const { isLibrarian, userEmail } = route.params;
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#007AFF', headerShown: false }}>
      <Tab.Screen 
        name="Catalog" 
        component={HomeScreen} 
        initialParams={{ isLibrarian, userEmail }} 
        options={{ tabBarIcon: ({color}) => <Icon name="list" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="Lend" 
        component={BookLendScreen} 
        initialParams={{ isLibrarian, userEmail }} 
        options={{ tabBarIcon: ({color}) => <Icon name="time" size={24} color={color} /> }} 
      />
    </Tab.Navigator>
  );
}

function DrawerNavigator({ route }: any) {
  const { isLibrarian, userEmail } = route.params;
  return (
    <Drawer.Navigator 
      drawerContent={(p) => <CustomDrawerContent {...p} userEmail={userEmail} />} 
      screenOptions={{ headerTintColor: '#007AFF' }}
    >
      <Drawer.Screen 
        name="MainLibrary" 
        component={TabNavigator} 
        initialParams={{ isLibrarian, userEmail }} 
        options={{ title: 'Dashboard' }} 
      />
      {isLibrarian && (
        <Drawer.Screen 
          name="AddBook" 
          component={EditBookScreen} 
          options={{ title: 'Add New Book', drawerIcon: ({color}) => <Icon name="add-circle" size={22} color={color} /> }} 
        />
      )}
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTintColor: '#007AFF' }}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DrawerRoot" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Details' }} />
        <Stack.Screen name="EditBook" component={EditBookScreen} options={{ title: 'Edit Catalog' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
