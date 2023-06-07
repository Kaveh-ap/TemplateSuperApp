import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DTasksPage from '../Pages/DTasks';
import MainPage from '../Pages/Main';
import TaskDetails from '../Pages/TaskDetails';

const Stack = createStackNavigator();

export default function MainStack() {
    return (
        <Stack.Navigator initialRouteName="Main" screenOptions={{ presentation: 'card', headerShown: false }}>
            <Stack.Screen name="Main" component={MainPage} />
            <Stack.Screen name="DTasks" component={DTasksPage} />
            <Stack.Screen name="TaskDetails" component={TaskDetails} />
        </Stack.Navigator>
    );
}
