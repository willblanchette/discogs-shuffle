import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import LibraryScreen from '../screens/LibraryScreen';
import ReleaseScreen from '../screens/ReleaseScreen';

export default createAppContainer(createStackNavigator({
  Library: {
    screen: LibraryScreen
  },
  Release: {
    screen: ReleaseScreen
  }
}));