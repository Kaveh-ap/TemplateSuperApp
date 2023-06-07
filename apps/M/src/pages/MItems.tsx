import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Card from './Card';

const ITEMS = [
  { title: 'Item 1', description: 'This is item 1' },
  { title: 'Item 2', description: 'This is item 2' },
  { title: 'Item 3', description: 'This is item 3' },
  { title: 'Item 4', description: 'This is item 4' },
  { title: 'Item 5', description: 'This is item 5' },
];
export default function MItems() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {ITEMS.map((item, index) => (
        <Card key={index} title={item.title} description={item.description} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
