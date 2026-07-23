import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../UI';
import { db, DEFAULT_IMAGE } from '../services/database';

export default function EditBookScreen({ route, navigation }: any) {
  const { mode, book } = route.params || { mode: 'create' };
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [imageUri, setImageUri] = useState(book?.imageUri || '');

  const handleSave = () => {
    if (!title || !author) return Alert.alert("Error", "Title and Author are required.");
    db.transaction(tx => {
      if (mode === 'create') {
        tx.executeSql('INSERT INTO books (title, author, imageUri) VALUES (?, ?, ?)', [title, author, imageUri || DEFAULT_IMAGE]);
      } else {
        tx.executeSql('UPDATE books SET title = ?, author = ?, imageUri = ? WHERE id = ?', [title, author, imageUri || DEFAULT_IMAGE, book.id]);
      }
      navigation.goBack();
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Book Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Author</Text>
      <TextInput style={styles.input} value={author} onChangeText={setAuthor} />
      <Text style={styles.label}>Image URL</Text>
      <TextInput style={styles.input} value={imageUri} onChangeText={setImageUri} />
      <Image source={{ uri: imageUri || DEFAULT_IMAGE }} style={styles.preview} />
      <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
