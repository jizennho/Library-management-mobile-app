import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, Image, View, Text } from 'react-native';
import { styles } from '../UI';
import { db, DEFAULT_IMAGE } from '../services/database';

export default function HomeScreen({ route, navigation }: any) {
  const [books, setBooks] = useState<any[]>([]);
  const { isLibrarian, userEmail } = route.params;

  const loadBooks = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM books', [], (_, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i) temp.push(results.rows.item(i));
        setBooks(temp);
      });
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBooks);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bookCard} 
            onPress={() => navigation.navigate('BookDetail', { bookId: item.id, isLibrarian, userEmail })}
          >
            <Image source={{ uri: item.imageUri || DEFAULT_IMAGE }} style={styles.thumbnail} />
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthorText}>By {item.author}</Text>
              <Text style={item.borrowedBy ? {color: 'red', fontSize: 12} : {color: 'green', fontSize: 12}}>
                {item.borrowedBy ? `Borrowed by ${item.borrowedBy === userEmail ? 'You' : 'Others'}` : 'Available'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
