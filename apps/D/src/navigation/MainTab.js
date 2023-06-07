import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MPages from 'm/navPages';
import React from 'react';
import MainStack from './MainStack';

const Tab = createBottomTabNavigator();

export default function MainTab() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="MainTab"
                component={MainStack}
                options={{
                    tabBarLabel: 'Home',
                }}
            />
            {MPages.getMTab(Tab)}
        </Tab.Navigator>
    );
}
