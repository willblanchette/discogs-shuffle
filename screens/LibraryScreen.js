import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

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
      <View style={[styles.container]}>
        {!LibraryStore.releases
          ? <ActivityIndicator size="large"></ActivityIndicator>
          : <FlatList
              data={LibraryStore.releases}
              keyExtractor={(item, index)=> `${index}-${item.id}`}
              renderItem={({item}) => (
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
        }
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  }
})