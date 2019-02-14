import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { Button } from 'react-native-elements';
import { Foundation, Ionicons } from '@expo/vector-icons';

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
        <Foundation name='shuffle' size={30} color='#fff' style={[styles.titleIcon]}></Foundation>
      ),
      headerTitleStyle: styles.title,
      headerStyle: {
        backgroundColor: colors.primary,
        elevation: null,
      },
      headerRight: (
        <View style={[styles.headerButtonsWrapper]}>
          <Button
            title='SHUFFLE'
            type='outline'
            titleStyle={[styles.headerButtonTitle]}
            buttonStyle={[styles.headerButton]}
            onPress={() => navigation.navigation.navigate('Shuffle', {})}
            iconRight={true}
            icon={
              <Ionicons name='md-shuffle' size={18} color='#ffffff90' style={[styles.headerButtonIcon]} ></Ionicons>
            }
            style={[styles.headerButton]}></Button>
          <Button
            type='outline'
            title='SETTINGS'
            titleStyle={[styles.headerButtonTitle]}
            buttonStyle={[styles.headerButton]}
            onPress={() => navigation.navigation.navigate('Settings', {})}
            iconRight={true}
            icon={
              <Ionicons name='ios-settings' size={18} color='#ffffff90' style={[styles.headerButtonIcon]} ></Ionicons>
            }
            style={[styles.headerButton]}></Button>
        </View>
      ),
    })
  },
  Release: {
    screen: ReleaseScreen,
    navigationOptions: ({ navigation }) => {
      return {
        title: navigation.getParam('release').basic_information.title,
        headerTitleStyle: styles.title,
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
    navigationOptions: ({ navigation }) => {
      return {
        title: 'Settings',
        headerTitleStyle: styles.title,
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: colors.primary,
          elevation: null,
        },
      }
    }
  },
  Shuffle: {
    screen: ShuffleScreen,
    navigationOptions: {},
  }
}, {});

const styles = StyleSheet.create({
  title: {
      color: '#fff',
  },
  titleIcon: {
    marginLeft: 20,
  },
  headerButtonTitle: {
    color: '#ffffff90',
  },
  headerButtonsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    borderColor: '#ffffff50',
    marginRight: 10,
  },
  headerButtonIcon: {
    marginLeft: 10,
  },
});

export default createAppContainer(LibraryStack, {});