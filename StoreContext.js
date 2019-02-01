import React from 'react';

import HistoryStore from './store/History';
import LibraryStore from './store/Library';

const StoreContext = React.createContext({});

export default class StoreContextProvider extends React.Component {
  render () {
    return (
      <StoreContext.Provider
        value={{
          ...this.state,
          library: LibraryStore,
          history: HistoryStore
        }}
      >
        {this.props.children}
      </StoreContext.Provider>
    )
  }
}

// create the consumer as higher order component
export const withStoreContext = ChildComponent => props => (
  <StoreContext.Consumer>
    {
      context => <ChildComponent {...props} store={context}  />
    }
  </StoreContext.Consumer>
);