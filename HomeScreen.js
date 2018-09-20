import React, { Component, PureComponent } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  FlatList,
  AppState,
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';

const actions = [{
  text: 'Add',
  icon: require('./images/baseline_add_white_18dp.png'),
  name: 'add',
  position: 1
}];


let config = require('./Config');

type Props = {};
export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Visited Places List',
  };

  constructor(props) {
    super(props)

    this.state = {
      places: [],
      isFetching: false,
    };

    this._load = this._load.bind(this);
  }
    componentDidMount() {
      this._load();
    }

    _load() {
      let url = config.settings.serverPath + '/api/places';
  
      this.setState({isFetching: true});
  
      fetch(url)
      .then((response) => {
        if(!response.ok) {
          Alert.alert('Error', response.status.toString());
          throw Error('Error ' + response.status);
        }
  
        return response.json()
      })
      .then((places) => {
        this.setState({places});
        this.setState({isFetching: false});
      })
      .catch((error) => {
        console.log(error)
      });
    }


  
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={ this.state.places }
          extraData={this.state}
          refreshing={this.state.isFetching}
          onRefresh={this._load}
          showsVerticalScrollIndicator={ true }
          renderItem={({item}) =>
            <TouchableHighlight
              underlayColor={'#cccccc'}
              onPress={ () => {
                this.props.navigation.navigate('View', {
                  id: item.id,
                  headerTitle: item.name,
                  refresh: this._load,
                })
              }}
            >
              <View style={styles.item}>
                <Text style={styles.itemTitle}>{ item.name }</Text>
                <Text style={styles.itemSubtitle}>{ item.city }</Text>
              </View>
            </TouchableHighlight>
          }
          keyExtractor={(item) => {item.id.toString()}}
        />
        <FloatingAction
          actions={actions}
          overrideWithAction={true}
          color={'yellow'}
          onPressItem={
            () => {
              this.props.navigation.navigate('Create', {
                refresh: this._load,
              })
            }
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  item: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',

  },
  itemSubtitle: {
    fontSize: 18,
  }
});
