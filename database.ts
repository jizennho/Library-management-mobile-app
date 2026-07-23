import SQLite from 'react-native-sqlite-storage';

export const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop';

export const db = SQLite.openDatabase(
  { name: 'LibraryDB.db', location: 'default' },
  () => { console.log("Database Connected"); },
  (err: any) => { console.log("DB Error: ", err); }
);

export const initDatabase = () => {
  db.transaction((tx: any) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        imageUri TEXT,
        borrowedBy TEXT,
        dueDate TEXT
      )`,
      [],
      () => {
        tx.executeSql('SELECT COUNT(*) as count FROM books', [], (_: any, results: any) => {
          if (results.rows.item(0).count === 0) {
            const initialBooks = [
              ['The Great Gatsby', 'F. Scott Fitzgerald', 'https://covers.openlibrary.org/b/id/12838965-M.jpg'],
              ['1984', 'George Orwell', 'https://covers.openlibrary.org/b/id/12838933-M.jpg'],
              ['To Kill a Mockingbird', 'Harper Lee', 'https://covers.openlibrary.org/b/id/8226093-M.jpg'],
              ['The Hobbit', 'J.R.R. Tolkien', 'https://covers.openlibrary.org/b/id/11145100-M.jpg'],
              ['Pride and Prejudice', 'Jane Austen', 'https://covers.openlibrary.org/b/id/12730018-M.jpg']
            ];
            initialBooks.forEach(b => {
              tx.executeSql('INSERT INTO books (title, author, imageUri) VALUES (?, ?, ?)', b);
            });
          }
        });
      }
    );
  });
};
