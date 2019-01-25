import React from 'react';
import { Image, Text, View } from 'react-native';
import { WebBrowser } from 'expo';

export default class ReleaseScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const item = this.props.navigation.getParam('item');

    return (
      <View>
        <Text>{item.basic_information.title}</Text>
      </View>
    );
  }
}
