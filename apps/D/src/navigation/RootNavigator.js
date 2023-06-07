import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import MainTab from './MainTab';

export default class RootNavigator extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <NavigationContainer>
                <MainTab />
            </NavigationContainer>
        );
    }
}
