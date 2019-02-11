import { observer } from 'mobx-react';
import { Container, Header, Icon, Input, Item, Picker,  Text } from 'native-base';
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import  { withStoreContext } from '../StoreContext';


const blacklistedFormats = ['All Media'];
const sortNames = ['Artist', 'Title'];
const formatIcons = {
  cassette: require('../assets/images/icons/cassette.png'),
  cd: require('../assets/images/icons/cd.png'),
  vinyl: require('../assets/images/icons/vinyl.png'),
}
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
        <Header searchBar style={[styles.header]}>
          <Item style={[styles.headerItem]}>
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
        <Container style={[styles.list]}>
          {!this.props.store.library.releases
            ? <ActivityIndicator size="large"></ActivityIndicator>
            : <FlatList
                refreshing={this.props.store.library.fetching}
                onRefresh={() => this.props.store.library.fetch(true)}
                data={releases}
                keyExtractor={(item, index)=> `${index}-${item.id}`}
                renderItem={({item}) => {
                  const formats = item.basic_information.formats
                    .map(f => f.name)
                    .map(f => f.toLowerCase(),)
                    .filter(f => !!formatIcons[f]);

                  return (<TouchableHighlight underlayColor='#ffffff10' onPress={this.onPressItem.bind(this, item)}>
                    <View style={[styles.listItem]} >
                      <AutoHeightImage
                        width={50}
                        style={[styles.listItemImage]}
                        source={{uri: item.basic_information.cover_image}} />
                      <View style={[styles.listItemMeta]}>
                        <Text style={[styles.listItemText, {fontWeight: 'bold'}]}>
                          {item.basic_information.artists[0].name}
                        </Text>
                        <Text style={[styles.listItemText, {color: '#ccc'}]}>
                          {item.basic_information.title}
                        </Text>
                      </View>
                      <View style={[styles.formatIcons]}>
                        {formats.map(f => (
                          <View key={f} style={[styles.formatIcon]}>
                            <AutoHeightImage
                              width={30}
                              source={formatIcons[f]} />
                          </View>
                        ))}
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
    backgroundColor: '#111',
    padding: 0,
  },
  headerItem: {
    padding: 10,
  },
  list: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  listItem: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomColor: '#ffffff19',
    borderBottomWidth: 2,
    flexDirection: 'row'
  },
  listItemText: {
    color: '#fff',
  },
  listItemImage: {
    marginRight: 20,
    borderColor: '#fff',
    borderWidth: 1,
    minHeight: 50,
  },
  listItemMeta: {
    flex: 1,
    flexDirection: 'column',
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