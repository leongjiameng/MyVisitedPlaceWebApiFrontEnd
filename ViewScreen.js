import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {
  InputWithLabel
} from './UI';
import { FloatingAction } from 'react-native-floating-action';


const actions = [{
  text: 'Edit',
  color: '#c80000',
  icon: require('./images/baseline_edit_white_18dp.png'),
  name: 'edit',
  position: 2
},{
  text: 'Delete',
  color: '#c80000',
  icon: require('./images/baseline_delete_white_18dp.png'),
  name: 'delete',
  position: 1
}];


let config = require('./Config');

type Props = {};
export default class ViewScreen extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('headerTitle')
    };
  }

  constructor(props) {
    super(props)

    this.state = {
      id: this.props.navigation.getParam('id'),
      place: null,
    };

    this._load = this._load.bind(this);
    this._delete = this._delete.bind(this);
  
  }

  componentDidMount(){
    this._load();
  }

  _load(){
    let url=config.settings.serverPath+'/api/places/'+ this.state.id;
    
    fetch(url)
    .then ((response)=>{
      if(!response.ok){
        Alert.alert('Error',response.status.toString());
        throw Error('Error'+response.status);
      }

      return response.json();
    })
    .then((place)=>{
      this.setState({place});
    })
    .catch((error)=>{
      console.error(error);
    });
  }

  _delete() {
    Alert.alert('Confirm Deletion', 'Delete `'+ this.state.place.name +'`?', [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
         

          let url=config.settings.serverPath+'/api/place/'+this.state.id;

          fetch(url,{
            method:'DELETE',
            headers:{
              Accept:'application/json',
              'Content-Type':'application/json',
            },
            body:JSON.stringify({
              id: this.state.id,
            }),
          })
          .then((response)=>{
            if(!response.ok){
              Alert.alert('Error', response.status.toString());
              throw Error('Error ' + response.status);
            }

            return response.json()
          })
          .then((responseJson) => {
            if(responseJson.affected == 0) {
              Alert.alert('Error deleting record');
            }

            this.props.navigation.getParam('refresh')();
            this.props.navigation.goBack();
          })
          .catch((error) => {
            console.error(error);
         });
    
        },
      },
    ], { cancelable: false });
  }


  render() {
    let place = this.state.place;
    let theDate = new Date(place ?place.date:'');

    return (

      <View style={styles.container}>

        <ScrollView>
          <InputWithLabel style={styles.output}
            label={'Name'}
            value={place ? place.name : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel style={styles.output}
            label={'City'}
            value={place ? place.city : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel style={styles.output}
            label={'Date'}
            value={theDate.toDateString()}
            orientation={'vertical'}
            editable={false}
          />

        </ScrollView>
        <FloatingAction
          actions={actions}
          color={'pink'}
          floatingIcon={(
            <Image
              source={require('./images/baseline_edit_white_18dp.png')}
            />
          )}
          onPressItem={(name) => {
              switch(name) {
                case 'edit':
                  this.props.navigation.navigate('Edit', {
                    id: place ? place.id : 0,
                    headerTitle: place ? place.name : '',
                    refresh: this._load,
                    homeRefresh: this.props.navigation.getParam('refresh'),
                  });
                  break;

                case 'delete':
                  this._delete();
                  break;
              }
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
    padding: 20,
    backgroundColor: '#fff',
  },
  output: {
    fontSize: 24,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
});
