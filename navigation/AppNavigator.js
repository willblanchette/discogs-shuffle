import React from 'react';
import { Button, View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import LibraryScreen from '../screens/LibraryScreen';
import ReleaseScreen from '../screens/ReleaseScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ShuffleScreen from '../screens/ShuffleScreen';

const LibraryStack = createStackNavigator({
  Library: {
    screen: LibraryScreen,
    navigationOptions: navigation => ({
      title: 'Discogs Shuffle',
      headerTitleStyle: {
        color: '#fff',
      },
      headerStyle: {
        backgroundColor: '#4A99F0',
        elevation: null,
      },
      headerRight: (
        <View style={{marginRight: 20}}>
          <Button
            title='Shuffle'
            color='#4A99F0'
            onPress={() => navigation.navigation.navigate('Shuffle', {})}></Button>
        </View>
      ),
    })
  },
  Release: {
    screen: ReleaseScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: navigation.getParam('release').basic_information.title
      }
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {},
  },
  Shuffle: {
    screen: ShuffleScreen,
    navigationOptions: {},
  }
}, {})

export default createAppContainer(LibraryStack, {});