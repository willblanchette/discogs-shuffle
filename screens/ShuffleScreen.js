import { observer } from 'mobx-react';
import React from 'react';
import { Button, FlatList, Image, Text, TouchableHighlight, View } from 'react-native';

import { withStoreContext }  from '../StoreContext';

@observer
class ShuffleScreen extends React.Component {
  constructor(props) {
    super(props);

    props.navigation.addListener('didFocus',
      payload => {
        const releases = this.props.store.library.releases;
        const release = releases[Math.floor(Math.random() * releases.length)];
        this.props.navigation.navigate('Release', { release });
      }
    );
  }

  render () {
    return (
      <View>
      </View>
    );
  }
}

export default withStoreContext(ShuffleScreen);