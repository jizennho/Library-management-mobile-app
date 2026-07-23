import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../UI';
import { db } from '../services/database';

export default function BookLendScreen({ route, navigation }: any) {
  const [myLends, setMyLends] = useState<any[]>([]);
  const { userEmail, isLibrarian } = route.params;

  const calculateDaysLeft = (dueDate: string) => {
    if (!dueDate) return "";
    const diff = new Date(dueDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : "Overdue!";
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM books WHERE borrowedBy = ?', [userEmail], (_, res) => {
          let temp = [];
          for (let i = 0; i < res.rows.length; ++i) temp.push(res.rows.item(i));
          setMyLends(temp);
        });
      });
    });
    return unsubscribe;
  }, [navigation, userEmail]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>My Active Loans</Text>
      <FlatList
        data={myLends}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.lendCard}
            onPress={() => navigation.navigate('BookDetail', { bookId: item.id, isLibrarian, userEmail })}
          >
            <View style={{flex: 1}}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthorText}>By {item.author}</Text>
              <Text style={styles.dueText}>Due: {calculateDaysLeft(item.dueDate)}</Text>
            </View>
            <Icon name="timer-outline" size={24} color="#FF9500" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>You haven't borrowed any books.</Text>}
      />
    </View>
  );
}
