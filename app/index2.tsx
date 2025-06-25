import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Button, TouchableOpacity, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "@/global.css"

const POSTS_PER_PAGE = 3;

export default function App() {
  const systemColorScheme = useColorScheme();
  const [overrideDarkMode, setOverrideDarkMode] = useState(true);
  const isDark = overrideDarkMode !== null ? overrideDarkMode : systemColorScheme === 'dark';

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

  const toggleTheme = () => {
    setOverrideDarkMode((prev) => (prev  ? systemColorScheme !== 'dark' : !prev));
  };

  const postStart = POSTS_PER_PAGE * (currentPage - 1);
  const postEnd = postStart + POSTS_PER_PAGE;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  return (
    <SafeAreaView className={`flex-1 p-5 ${isDark ? 'bg-black' : 'bg-white'}`}>      
      <ScrollView>
        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>Name TBD</Text>
          <Button title={isDark ? 'Light Mode' : 'Dark Mode'} onPress={toggleTheme} />
        </View>

        <Text className={`text-xl mb-5 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Welcome to my new blog!</Text>

        {posts.slice(postStart, postEnd).map((post, index) => (
          <View key={index} className={`mb-5 p-4 border rounded-xl ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{post.title}</Text>
            <Text className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Date: {post.date}</Text>
            <Text className={`${isDark ? 'text-gray-300' : 'text-black'}`}>{post.text}</Text>
          </View>
        ))}

        <View className="flex-row items-center justify-center space-x-3 my-5">
          <Button
            title="Previous"
            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setCurrentPage(i + 1)}>
              <Text className="text-blue-500 mx-2 text-base">{i + 1}</Text>
            </TouchableOpacity>
          ))}
          <Button
            title="Next"
            onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </View>

        <View className="mt-10">
          <Text className={`text-base font-medium mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Title:</Text>
          <TextInput
            className={`border p-3 rounded-md mb-4 ${isDark ? 'border-gray-600 text-white' : 'border-gray-300 text-black'}`}
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="Post title"
            placeholderTextColor={isDark ? '#888' : undefined}
          />
          <Text className={`text-base font-medium mb-1 ${isDark ? 'text-white' : 'text-black'}`}>Text:</Text>
          <TextInput
            className={`border p-3 rounded-md min-h-[100px] text-base ${isDark ? 'border-gray-600 text-white' : 'border-gray-300 text-black'}`}
            value={newText}
            onChangeText={setNewText}
            placeholder="Post text"
            placeholderTextColor={isDark ? '#888' : undefined}
            multiline
            numberOfLines={4}
          />
          <View className="mt-4">
            <Button title="New Post" onPress={handleNewPost} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
