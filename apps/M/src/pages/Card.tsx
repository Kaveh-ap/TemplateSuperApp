import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Card({ title, description }) {
  const navigation = useNavigation();

  const onNavigate = () => {
    navigation.navigate('ItemDetails', { title, description });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onNavigate}>
      <Text style={styles.title}>{title}</Text>
      <Text>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    elevation: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
  },
});
