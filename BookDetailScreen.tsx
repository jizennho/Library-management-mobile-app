import React, { useState, useEffect } from 'react';
import { ScrollView, Image, Text, View, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../UI';
import { db, DEFAULT_IMAGE } from '../services/database';

export default function BookDetailScreen({ route, navigation }: any) {
  const { bookId, isLibrarian, userEmail } = route.params;
  const [item, setItem] = useState<any>(null);
  const [cloudData, setCloudData] = useState({ meta: 'Fetching...', synopsis: '', coverUrl: '' });
  const [loading, setLoading] = useState(true);
  
  const fetchCloudInfo = async (title: string) => {
    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${title}&limit=1`);
      const json = await response.json();
      
      if (json.docs && json.docs[0]) {
        const bookData = json.docs[0];
        const cloudCover = bookData.cover_i ? `https://covers.openlibrary.org/b/id/${bookData.cover_i}-L.jpg` : null;
        
        if (cloudCover) {
          db.transaction(tx => {
            tx.executeSql(
              'UPDATE books SET imageUri = ? WHERE id = ? AND (imageUri IS NULL OR imageUri != ?)',
              [cloudCover, bookId, cloudCover]
            );
          });
        }         
        
        const workId = bookData.key; 
        const year = bookData.first_publish_year ? `First Published: ${bookData.first_publish_year}` : "Year Unknown";
        const subjects = bookData.subject ? `Tags: ${bookData.subject.slice(0, 3).join(', ')}` : "";

        const detailRes = await fetch(`https://openlibrary.org${workId}.json`);
        const detailJson = await detailRes.json();
        
        let synopsis = "No synopsis available for this title.";
        if (detailJson.description) {
          synopsis = typeof detailJson.description === 'string' 
            ? detailJson.description 
            : detailJson.description.value;
        }

        setCloudData({
          meta: `${year}\n${subjects}`,
          synopsis: synopsis.slice(0, 400) + "..." ,
          coverUrl: cloudCover || ''
        });
      } else {
        setCloudData({ meta: "No records found.", synopsis: "", coverUrl: '' });
      }
    } catch (e) {
      setCloudData({ meta: "Cloud offline.", synopsis: "Check connection.", coverUrl: '' });
    } finally {
      setLoading(false);
    }
  };

  const fetchBook = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM books WHERE id = ?', [bookId], (_, res) => {
        if (res.rows.length > 0) {
          const book = res.rows.item(0);
          setItem(book);
          fetchCloudInfo(book.title);
        }
      });
    });
  };

  useEffect(() => { fetchBook(); }, []);

  const handleAction = () => {
    if (item.borrowedBy && item.borrowedBy !== userEmail) {
      return Alert.alert("Unavailable", "Borrowed by another user.");
    }
    const isReturning = !!item.borrowedBy;
    const newBorrower = isReturning ? null : userEmail;
    const newDueDate = isReturning ? null : new Date(Date.now() + 12096e5).toISOString();

    db.transaction(tx => {
      tx.executeSql('UPDATE books SET borrowedBy = ?, dueDate = ? WHERE id = ?', [newBorrower, newDueDate, bookId], () => fetchBook());
    });
  };

  // NEW: Delete handling function
  const handleDelete = () => {
    Alert.alert(
      "Delete Book",
      `Are you sure you want to permanently delete "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql('DELETE FROM books WHERE id = ?', [bookId], () => {
                Alert.alert("Success", "Book removed from catalog.");
                navigation.goBack(); // Return to the list after deleting
              });
            });
          }
        }
      ]
    );
  };

  if (!item) return null;

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: cloudData.coverUrl || item.imageUri || DEFAULT_IMAGE }} 
        style={styles.largeCover} 
      />
      <Text style={styles.detailTitle}>{item.title}</Text>
      <Text style={styles.detailAuthor}>By {item.author}</Text>
      
      <View style={styles.cloudBox}>
        <Text style={styles.cloudLabel}>CLOUD DATA</Text>
        {loading ? (
          <ActivityIndicator color="#007AFF" />
        ) : (
          <View>
            <Text style={styles.cloudText}>{cloudData.meta}</Text>
            {cloudData.synopsis ? (
              <>
                <Text style={[styles.cloudLabel, { marginTop: 15 }]}>SYNOPSIS</Text>
                <Text style={styles.synopsisText}>{cloudData.synopsis}</Text>
              </>
            ) : null}
          </View>
        )}
      </View>

      <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={isLibrarian ? () => navigation.navigate('EditBook', {mode:'edit', book:item}) : handleAction}
      >
        <Text style={styles.buttonText}>
          {isLibrarian ? "Edit Details" : (item.borrowedBy === userEmail ? "Return" : "Borrow")}
        </Text>
      </TouchableOpacity>

      {/* NEW: Render Delete Button ONLY if user is a librarian */}
      {isLibrarian && (
        <TouchableOpacity style={styles.dangerButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete Book</Text>
        </TouchableOpacity>
      )}
      
      {/* Just adding a little bottom padding so it doesn't hug the bottom edge */}
      <View style={{ height: 40 }} /> 
    </ScrollView>
  );
}
