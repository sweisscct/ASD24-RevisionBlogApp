import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POSTS_PER_PAGE = 3;

export default function App() {
  const [posts, setPosts] = useState([{title: "", date: "", text: ""}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      const storedPosts = await AsyncStorage.getItem('posts');
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      }
    };
    loadPosts();
  }, []);

  const savePosts = async (newPosts: {title: String, date: String, text: String}[]) => {
    await AsyncStorage.setItem('posts', JSON.stringify(newPosts));
  };

  const handleNewPost = () => {
    if (!newTitle || !newText) return;
    const newPost = {
      title: newTitle,
      date: new Date().toISOString().slice(0, 10),
      text: newText,
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    savePosts(updatedPosts);
    setNewTitle('');
    setNewText('');
    setCurrentPage(1);
  };

  const postStart = POSTS_PER_PAGE * (currentPage - 1);
  const postEnd = postStart + POSTS_PER_PAGE;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.siteName}>Name TBD</Text>
        <Text style={styles.welcome}>Welcome to my new blog!</Text>

        {posts.slice(postStart, postEnd).map((post, index) => (
          <View key={index} style={styles.blogPost}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postDate}>Date: {post.date}</Text>
            <Text>{post.text}</Text>
          </View>
        ))}

        <View style={styles.pagination}>
          <Button
            title="Previous"
            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setCurrentPage(i + 1)}>
              <Text style={styles.pageNum}>{i + 1}</Text>
            </TouchableOpacity>
          ))}
          <Button
            title="Next"
            onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </View>

        <View style={styles.form}>
          <Text style={styles.formLabel}>Title:</Text>
          <TextInput
            style={styles.input}
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="Post title"
          />
          <Text style={styles.formLabel}>Text:</Text>
          <TextInput
            style={styles.textarea}
            value={newText}
            onChangeText={setNewText}
            placeholder="Post text"
            multiline
            numberOfLines={4}
          />
          <Button title="New Post" onPress={handleNewPost} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  siteName: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  welcome: { fontSize: 20, marginBottom: 20 },
  blogPost: { marginBottom: 20, padding: 15, borderColor: '#ccc', borderWidth: 1, borderRadius: 10 },
  postTitle: { fontSize: 18, fontWeight: 'bold' },
  postDate: { fontSize: 14, color: '#666', marginBottom: 10 },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginVertical: 20 },
  pageNum: { marginHorizontal: 5, fontSize: 16, color: 'blue' },
  form: { marginTop: 30 },
  formLabel: { fontSize: 16, marginVertical: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  textarea: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, minHeight: 100, textAlignVertical: 'top' },
});
