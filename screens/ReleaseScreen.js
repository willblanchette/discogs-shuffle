import AutoHeightImage from 'react-native-auto-height-image';
import { observer } from 'mobx-react';
import React from 'react';
import { Button, Dimensions, FlatList, ScrollView, Text, TouchableHighlight, View } from 'react-native';

import { withStoreContext }  from '../StoreContext';

@observer
class ReleaseScreen extends React.Component {
  onPressDeleteHistoryItem = item => {
    this.props.store.history.delete(
      this.props.navigation.getParam('release'),
      item
    );
  };

  render() {
    const release = this.props.navigation.getParam('release');
    let history = this.props.store.history.history[release.id] || [];

    history = history
      .slice() // Handle mobx list binding weirdness
      .sort((a, b) => {
        return b.date.diff(a.date);
      });

    return (
      <ScrollView>
        <Text>{release.basic_information.artists[0].name}</Text>
        <Text>{release.basic_information.title}</Text>
        <Text>{' (' + release.basic_information.formats.map(f => f.name).join(', ') + ')'}</Text>
        <Text>{history.length} Plays</Text>
        <AutoHeightImage
          width={Dimensions.get('window').width}
          source={{uri: release.basic_information.cover_image}} />
        <Button title='Play' onPress={() => this.props.store.history.play(release)}></Button>
        <Text>{history.length} Plays</Text>
        <FlatList
          data={history}
          keyExtractor={(item, index)=> `${index}`}
          renderItem={({item, index}) => (
            <TouchableHighlight>
              <View>
                <Text style={{
                  borderBottomWidth: 1,
                  padding: 10,
                }}>
                  {item.date.format('MM DD YYYY H:mm:ss')}
                </Text>
                <Button onPress={this.onPressDeleteHistoryItem.bind(this, item)} title='X'></Button>
              </View>
            </TouchableHighlight>)}
          >
          </FlatList>
      </ScrollView>
    );
  }
}

export default withStoreContext(ReleaseScreen);