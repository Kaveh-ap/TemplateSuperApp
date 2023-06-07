import React from 'react';
import MStack from './MStack';

function getMTab(Tab: any) {
  return (
    <Tab.Screen
      name="MTab"
      component={MStack}
      options={{
        tabBarLabel: 'Mini App M',
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
