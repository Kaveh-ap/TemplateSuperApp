import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Card from './Card';

const Tasks = [
  { title: 'Task 1', description: 'This is Task 1' },
  { title: 'Task 2', description: 'This is Task 2' },
  { title: 'Task 3', description: 'This is Task 3' },
  { title: 'Task 4', description: 'This is Task 4' },
  { title: 'Task 5', description: 'This is Task 5' },
];
export default function DTasks() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {Tasks.map((task, index) => (
        <Card key={index} title={task.title} description={task.description} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
