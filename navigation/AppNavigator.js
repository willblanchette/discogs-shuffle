import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import LibraryScreen from '../screens/LibraryScreen';
import ReleaseScreen from '../screens/ReleaseScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ShuffleScreen from '../screens/ShuffleScreen';

const LibraryStack = createStackNavigator({
  Library: {
    screen: LibraryScreen,
    navigationOptions: {
      title: 'Discogs Shuffle',
    }
  },
  Release: {
    screen: ReleaseScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: navigation.getParam('release').basic_information.title
      }
    }
  }
}, {})

export default createAppContainer(createBottomTabNavigator({
  Library: {
    screen: LibraryStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (<Ionicons name='ios-images' size={25} color={tintColor} />)
    }
  },
  Shuffle: {
    screen: ShuffleScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (<Ionicons name='ios-shuffle' size={25} color={tintColor} />)
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (<Ionicons name='ios-settings' size={25} color={tintColor} />)
    }
  }
}, {}));