import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ErrorBoundary from './ErrorBoundary';
import RootNavigator from './navigation/RootNavigator';

class App extends React.Component<any> {
  render() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <RootNavigator />
        </ErrorBoundary>
      </GestureHandlerRootView>
    );
  }
}

export default App;

// fast refresh
if (__DEV__) {
  require('@mobile/client/HotModuleReplacement');
}
