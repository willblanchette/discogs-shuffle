import React from 'react';
import { View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements';
import { Foundation } from '@expo/vector-icons';

import LibraryScreen from '../screens/LibraryScreen';
import ReleaseScreen from '../screens/ReleaseScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ShuffleScreen from '../screens/ShuffleScreen';
import { colors } from '../util/Constants';

const LibraryStack = createStackNavigator({
  Library: {
    screen: LibraryScreen,
    navigationOptions: navigation => ({
      headerTitle: (
        <Foundation name='shuffle' size={30} color='#fff' style={{marginLeft: 20}}></Foundation>
      ),
      headerTitleStyle: {
        color: '#fff',
      },
      headerStyle: {
        backgroundColor: colors.primary,
        elevation: null,
      },
      headerRight: (
        <View style={{marginRight: 20}}>
          <Button
            title='SHUFFLE'
            type='outline'
            titleStyle={{color: '#ffffff90'}}
            buttonStyle={{borderColor: '#ffffff50'}}
            onPress={() => navigation.navigation.navigate('Shuffle', {})}></Button>
        </View>
      ),
    })
  },
  Release: {
    screen: ReleaseScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: navigation.getParam('release').basic_information.title,
        headerTitleStyle: {
          color: '#fff',
        },
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: null,
        },
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