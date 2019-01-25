import { observer } from 'mobx-react';
import { Container, Header, Icon, Input, Item, Picker,  Text } from 'native-base';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';

import LibraryStore from '../store/Library';

const blacklistedFormats = ['All Media'];
const sortNames = ['Artist', 'Title'];
const sortMethods = {
  Title: (a, b) => a.basic_information.title.localeCompare(b.basic_information.title),
  Artist: (a, b) => a.basic_information.artists[0].name.localeCompare(b.basic_information.artists[0].name),
}

@observer
export default class LibraryScreen extends Component {
  static navigationOptions = {
    title: 'Library',
  };

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

  onPressItem = item => {
    this.props.navigation.navigate('Release', { item });
  };

  filterReleases() {


    const filteredReleases = LibraryStore.releases.filter(release => {
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

    if (LibraryStore.releases) {
      releases = this.filterReleases();

      LibraryStore.releases.forEach(r => {
        r.basic_information.formats.forEach(f => {
          if (!formats.includes(f.name) && !blacklistedFormats.includes(f.name)) {
            formats.push(f.name);
          }
        });
      });
    }

    return (
      <Container style={[styles.container]}>
        <Header searchBar>
          <Item>
            <Icon active name="search"></Icon>
            <Input placeholder="Search" onChangeText={terms => this.setState({terms})}></Input>
            <Picker
              mode="dropdown"
              selectedValue={this.state.format}
              onValueChange={this.onFormatChange.bind(this)}
            >
              <Picker.Item label="All" value={undefined}></Picker.Item>
              {formats.map(format => <Picker.Item label={format} value={format} key={format}></Picker.Item>)}
            </Picker>
            <Picker
              mode="dropdown"
              selectedValue={this.state.sort}
              onValueChange={this.onSortChange.bind(this)}
            >
              {sortNames.map(sort => <Picker.Item label={sort} value={sort} key={sort}></Picker.Item>)}
            </Picker>
          </Item>
        </Header>
        {!LibraryStore.releases
          ? <ActivityIndicator size="large"></ActivityIndicator>
          : <FlatList
              refreshing={LibraryStore.fetching}
              onRefresh={() => LibraryStore.fetch(true)}
              data={releases}
              keyExtractor={(item, index)=> `${index}-${item.id}`}
              renderItem={({item}) => (
                <TouchableHighlight onPress={this.onPressItem.bind(this, item)}>
                  <View >
                    <Text style={{
                      borderBottomWidth: 1,
                      padding: 10,
                    }}>
                      {item.basic_information.artists[0].name},
                      {item.basic_information.title}
                      {' (' + item.basic_information.formats.map(f => f.name).join(', ') + ')'}
                    </Text>
                  </View>
                </TouchableHighlight>)}
              >
              </FlatList>
        }
      </Container>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  }
})