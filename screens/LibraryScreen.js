import { observer } from 'mobx-react';
import React, { Component } from 'react';
import Async from 'react-async';
import { FlatList, Text, TouchableHighlight, View } from 'react-native';

import LibraryStore from '../store/Library';

@observer
export default class LibraryScreen extends Component {
  static navigationOptions = {
    title: 'Library',
  };

  onPressItem = item => {
    this.props.navigation.navigate('Release', { item });
  };

  render() {
    return (
      !LibraryStore.library
        ? <Text>Loading...</Text>
        : <FlatList
            data={LibraryStore.library.releases}
            keyExtractor={item => item.id}
            renderItem={item => (
              <TouchableHighlight onPress={this.onPressItem.bind(this, item)}>
                <View >
                  <Text style={{
                    borderBottomWidth: 1,
                    padding: 10,
                  }}>
                    {item.basic_information.title}
                  </Text>
                </View>
              </TouchableHighlight>)}
            >
            </FlatList>
    );
  }
}
