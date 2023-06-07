import React from 'react';
import MStack from './MStack';

function getMTab(Tab: any) {
  return (
    <Tab.Screen
      name="MTab"
      component={MStack}
      options={{
        tabBarLabel: 'Feed',
        headerShown: false,
      }}
    />
  );
}

export default {
  getMTab,
};

// fast refresh
if (__DEV__) {
  require('@mobile/client/HotModuleReplacement');
}
