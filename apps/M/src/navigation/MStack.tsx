import { createStackNavigator } from '@react-navigation/stack';
import ItemDetails from '../pages/ItemDetails';
import MFeedPage from '../pages/MFeed';
import MItemsPage from '../pages/MItems';

const Stack = createStackNavigator();

export default function MStack() {
  return (
    <Stack.Navigator initialRouteName="M" screenOptions={{ presentation: 'card', headerShown: false }}>
      <Stack.Screen name="MFeed" component={MFeedPage} />
      <Stack.Screen name="MItems" component={MItemsPage} />
      <Stack.Screen name="ItemDetails" component={ItemDetails} />
    </Stack.Navigator>
  );
}
