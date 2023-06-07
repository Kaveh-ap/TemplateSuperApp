import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TaskDetails({
  route: {
    params: { title, description },
  },
}) {
  return (
    <View>
      <Text style={styles.header}>TaskDetails</Text>
      <View style={styles.task}>
        <Text>{title}</Text>
        <Text>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  task: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
  },
});
