import AutoHeightImage from 'react-native-auto-height-image';
import { observer } from 'mobx-react';
import React from 'react';
import { Container } from 'native-base';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { withStoreContext }  from '../StoreContext';
import { colors, formatIcons } from '../util/Constants';

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

    const formats = release.basic_information.formats
      .map(f => f.name)
      .map(f => f.toLowerCase(),)
      .filter(f => !!formatIcons[f]);

    return (
      <Container style={[styles.container]}>
        <ScrollView>
          <View style={[styles.imageWrapper]}>
            <AutoHeightImage
              width={Dimensions.get('window').width}
              source={{uri: release.basic_information.cover_image}} />

            <View style={[styles.imageFooter]}>
              <View style={[styles.metaWrapper]}>
                <Text style={[styles.metaText, {fontWeight: 'bold'}]} numberOfLines={1}>
                  {release.basic_information.artists[0].name}
                </Text>
                <Text style={[styles.metaText, {color: '#ccc'}]} numberOfLines={1}>
                  {release.basic_information.title}
                </Text>
                <Text style={[styles.metaText, {color: '#ccc'}]}>{history.length} Plays</Text>
              </View>
              <View style={[styles.formatIcons]}>
                {formats.map((f, index) => (
                  <View key={`${f}:${index}`}>
                    <Image
                      style={[styles.formatIcon]}
                      source={formatIcons[f]} />
                  </View>
                ))}
              </View>
            </View>
          </View>
          <Button
            title='ADD PLAY'
            onPress={() => this.props.store.history.play(release)}
            buttonStyle={styles.playButton}
            containerStyle={styles.playButtonContainer}
            iconRight={true}
            icon={
              <Ionicons name='ios-play' size={26} color='#fff' style={styles.playButtonIcon}></Ionicons>
            }></Button>
          <FlatList
            styles={[styles.historyItems]}
            data={history}
            keyExtractor={(item, index)=> `${index}`}
            renderItem={({item, index}) => (
              <TouchableHighlight>
                <View style={[styles.historyItem]}>
                  <Text style={[styles.historyItemText]}>
                    {item.date.format('MMM D YYYY h:mmA')}
                  </Text>
                  <Button
                    type='clear'
                    buttonStyle={[styles.historyItemButton]}
                    onPress={this.onPressDeleteHistoryItem.bind(this, item)}
                    icon={
                      <MaterialIcons name='delete-forever' size={26} color='#999' style={styles.historyItemButtonIcon}></MaterialIcons>
                    }></Button>
                </View>
              </TouchableHighlight>)}
            ></FlatList>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
  },
  imageWrapper: {
  },
  metaWrapper: {
    flex: 1,
  },
  imageFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111111dd',
    padding: 20,
    flex: 1,
    flexDirection: 'row',
  },
  metaText: {
    fontSize: 16,
    color: '#fff',
  },
  formatIcons: {
    flexDirection: 'column',
    marginLeft: 20,
    flex: 0,
  },
  formatIcon: {
    marginBottom: 5,
    width: 20,
    height: 20,
  },
  playButton: {
    backgroundColor: colors.primary,
  },
  playButtonContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  playButtonIcon: {
    marginLeft: 10,
  },
  historyItems: {
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    alignItems: 'center',
    paddingBottom: 10,
  },
  historyItemText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  historyItemButton: {
    flex: 0,
  },
  historyItemButtonIcon: {
  },
});

export default withStoreContext(ReleaseScreen);