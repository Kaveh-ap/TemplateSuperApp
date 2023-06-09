import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DTasks from './DTasks';

export default function Main() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Main Page</Text>
      <DTasks />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    margin: 20,
  },
});
