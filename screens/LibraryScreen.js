import { observer } from 'mobx-react';
import { Container } from 'native-base';
import React, { Component } from 'react';
import { ActivityIndicator, Button, FlatList, Image, Picker, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import  { withStoreContext } from '../StoreContext';
import { blacklistedFormats, formatIcons, colors } from '../util/Constants';

const sortNames = ['Artist', 'Title'];
const sortMethods = {
  Title: (a, b) => a.basic_information.title.localeCompare(b.basic_information.title),
  Artist: (a, b) => a.basic_information.artists[0].name.localeCompare(b.basic_information.artists[0].name),
};

@observer
class LibraryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      terms: '',
      format: undefined,
      sort: sortNames[0],
    };
  };

  componentWillReact() {
    this.filterReleases();
  }

  onPressItem = release => {
    setTimeout(() => {
      this.props.navigation.navigate('Release', { release });
    }, 10);
  };

  onPressClearSearch = () => {
    this.setState({terms: ''});
  };

  filterReleases() {
    const filteredReleases = this.props.store.library.releases.filter(release => {
      return (
        (this.search(release.basic_information.title) || release.basic_information.artists.find(a => this.search(a.name)))
        && (!this.state.format || release.basic_information.formats.find(f => f.name === this.state.format))
      );
    })
    .sort(sortMethods[this.state.sort]);

    return filteredReleases;
  };

  onFormatChange(format) {
    this.setState({
      format
    });
  };

  onSortChange(sort) {
    this.setState({
      sort
    });
  };

  search(value) {
    let terms = this.state.terms ? this.state.terms.trim().toLowerCase() : ' ';
    terms = ' ' + terms.split(' ').filter(t => t.length >0).join(' ');

    return (' ' + value.toString().toLowerCase()).indexOf(terms) > -1;
  }

  render() {
    let releases;
    let formats = [];

    if (this.props.store.library.releases) {
      releases = this.filterReleases();

      this.props.store.library.releases.forEach(r => {
        r.basic_information.formats.forEach(f => {
          if (!formats.includes(f.name) && !blacklistedFormats.includes(f.name)) {
            formats.push(f.name);
          }
        });
      });
    }

    return (
      <Container>
        <View style={[styles.header]}>
          <View style={[styles.headerTextInputWrapper]}>
            <TextInput
              placeholder='Search'
              placeholderTextColor='#ffffff19'
              onChangeText={terms => this.setState({terms})}
              autoCorrect={false}
              autoComplete={false}
              autoCapitalize='none'
              value={this.state.terms}
              style={[styles.headerTextInput]}></TextInput>
            {this.state.terms.length > 0 &&
              <TouchableHighlight
                onPress={this.onPressClearSearch.bind(this)}
                style={[styles.headerClearSearchButton]}
              >
                <Ionicons name='ios-close' size={35} color='#333' />
              </TouchableHighlight>
            }
          </View>
          <View style={[styles.headerPickerWrapper]}>
            <Picker
              mode="dropdown"
              style={[styles.headerPicker]}
              textStyle={styles.headerPickerItem}
              selectedValue={this.state.format}
              onValueChange={this.onFormatChange.bind(this)}
            >
              <Picker.Item label="All" value={undefined}></Picker.Item>
              {formats.map(format => <Picker.Item label={format} value={format} key={format}></Picker.Item>)}
            </Picker>
          </View>
          <View style={[styles.headerPickerWrapper]}>
            <Picker
              mode="dropdown"
              style={[styles.headerPicker]}
              textStyle={styles.headerPickerItem}
              selectedValue={this.state.sort}
              onValueChange={this.onSortChange.bind(this)}
            >
              {sortNames.map(sort => <Picker.Item label={sort} value={sort} key={sort}></Picker.Item>)}
            </Picker>
          </View>
        </View>
        <Container style={[styles.list]}>
          {!this.props.store.library.releases
            ? <ActivityIndicator color={colors.primary} size="large"></ActivityIndicator>
            : <FlatList
                refreshing={this.props.store.library.fetching}
                onRefresh={() => this.props.store.library.fetch(true)}
                data={releases}
                keyExtractor={(item, index)=> `${index}-${item.id}`}
                maxToRenderPerBatch={25}
                updateCellsBatchingPeriod={10}
                initialNumToRender={200}
                removeClippedSubviews={true}
                windowSize={50}
                getItemLayout={(data, index) => ({length: 92, offset: 92 * index, index})}
                renderItem={({item}) => {
                  const formats = item.basic_information.formats
                    .map(f => f.name)
                    .map(f => f.toLowerCase(),)
                    .filter(f => !!formatIcons[f]);

                  return (<TouchableHighlight underlayColor='#333' onPress={this.onPressItem.bind(this, item)}>
                    <View style={[styles.listItem]}>
                      <View style={[styles.listItemInner]}>
                        <Image
                          style={[styles.listItemImage]}
                          source={{uri: item.basic_information.cover_image}} />
                        <View style={[styles.listItemMeta]}>
                          <Text style={[styles.listItemText, {fontWeight: 'bold'}]} numberOfLines={1}>
                            {item.basic_information.artists[0].name}
                          </Text>
                          <Text style={[styles.listItemText, {color: '#ccc'}]} numberOfLines={1}>
                            {item.basic_information.title}
                          </Text>
                        </View>
                        <View style={[styles.formatIcons]}>
                          {formats.map((f, index) => (
                            <View key={`${f}:${index}`} style={[styles.formatIcon]}>
                              <Image
                                style={styles.listItemFormatIcon}
                                source={formatIcons[f]} />
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  </TouchableHighlight>)
                }}/>
          }
        </Container>
      </Container>
    );
  }
};

const styles = StyleSheet.create({
  header: {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: '#00000000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTextInputWrapper: {
    flex: 2,
    display: 'flex',
    flexDirection: 'row',
  },
  headerTextInput: {
    color: '#fff',
    backgroundColor: '#111',
    height: 50,
    paddingLeft: 20,
    fontSize: 18,
    flex: 1,
  },
  headerPickerWrapper: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#333',
    position: 'relative',
  },
  headerClearSearchButton: {
    flex: 0,
    backgroundColor: '#111',
    height: 50,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerPicker: {
    color: '#fff',
    backgroundColor: '#111',
    height: 50,
  },
  headerPickerItem: {
    fontSize: 20,
  },
  list: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  listItem: {
    paddingLeft: 20,
    paddingRight: 20,
    height: 92,
    flex: 1,
  },
  listItemInner: {
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    flexDirection: 'row',
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  listItemText: {
    color: '#fff',
  },
  listItemImage: {
    width: 50,
    height: 50,
    marginRight: 20,
    borderColor: '#fff',
    borderWidth: 1,
  },
  listItemFormatIcon: {
    width: 20,
    height: 20,
  },
  listItemMeta: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 4,
  },
  listFormatIcon: {
    borderColor: '#fff',
    borderWidth: 1,
  },
  formatIcons: {
    flexDirection: 'column',
    marginLeft: 20,
  },
  formatIcon: {
    marginBottom: 5,
  },
});

export default withStoreContext(LibraryScreen);