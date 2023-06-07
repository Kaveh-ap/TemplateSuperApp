import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MItems from './MItems';

export default function MFeed() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}> Feed</Text>
      <MItems />
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
