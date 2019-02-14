import AutoHeightImage from 'react-native-auto-height-image';
import { observer } from 'mobx-react';
import React from 'react';
import { Container } from 'native-base';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { withStoreContext }  from '../StoreContext';
import { colors, formatIcons } from '../util/Constants';

@observer
class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.store.library.username,
    };
  };

  onPressSave() {
    this.props.store.library.setUsername(this.state.username);
  };

  render() {
    return (
      <Container style={[styles.container]}>
        <ScrollView>
            <TextInput
              placeholder='Discogs Username'
              placeholderTextColor='#ffffff19'
              onChangeText={username => this.setState({username})}
              autoCorrect={false}
              autoComplete={false}
              autoCapitalize='none'
              value={this.state.username}
              style={[styles.textInput]}></TextInput>
            <Button
              title='SAVE'
              onPress={this.onPressSave.bind(this)}></Button>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
  },
  textInput: {
    color: '#fff',
    backgroundColor: '#111',
    height: 50,
    paddingLeft: 20,
    fontSize: 18,
    flex: 1,
  },
});

export default withStoreContext(SettingsScreen);