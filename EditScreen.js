import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {
  InputWithLabel,
  PickerWithLabel,
  AppButton,
} from './UI'

import { DatePickerDialog } from 'react-native-datepicker-dialog'

import moment from 'moment';

let config = require('./Config');

type Props = {};
export default class EditScreen extends Component<Props> {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Edit: ' + navigation.getParam('headerTitle')
    };
  };

  constructor(props) {
    super(props)

    this.state = {
      id: this.props.navigation.getParam('id'),
      name: '',
      city: '',
      date: '',
      DateHolder:null,
    };

    this._load = this._load.bind(this);
    this._update = this._update.bind(this);
   }

  componentDidMount() {
    this._load();
  }

  _load() {
    let url = config.settings.serverPath + '/api/places/' + this.state.id;

    fetch(url)
    .then((response) => {
      if(!response.ok) {
        Alert.alert('Error', response.status.toString());
        throw Error('Error ' + response.status);
      }

      return response.json()
    })
    .then((place) => {
      this.setState({
        name: place.name,
        city: place.city,
        date: place.date,
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  _update() {
    let url = config.settings.serverPath + '/api/places/' + this.state.id;

    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name:this.state.name,
        city:this.state.city,
        date:this.state.date,
        id:this.state.id,
      }),
    })
    .then((response) => {
      if(!response.ok) {
        Alert.alert('Error', response.status.toString());
        throw Error('Error ' + response.status);
      }

      return response.json()
    })
    .then((responseJson) => {
      if(responseJson.affected > 0) {
        Alert.alert('Record Updated', 'Record for `' + this.state.name + '` has been updated');
      }
      else {
        Alert.alert('Error updating record');
      }

      this.props.navigation.getParam('refresh')();
      this.props.navigation.goBack();
    })
    .catch((error) => {
      console.error(error);
    });
  }

  DatePickerMainFunctionCall = () => {

    let DateHolder = this.state.DateHolder;

    if(!DateHolder || DateHolder == null){

      DateHolder = new Date();
      this.setState({
        DateHolder: DateHolder
      });
    }

    //To open the dialog
    this.refs.DatePickerDialog.open({

      date: DateHolder,

    });

  }

  onDatePickedFunction = (date) => {
      this.setState({
        date: moment(date).valueOf(),
        DateText: moment(date).format('DD-MMM-YYYY'),
        
      });
    }

  render() {
    let place = this.state.place;

    return (
      <ScrollView style={styles.container}>
        <InputWithLabel style={styles.input}
          label={'Name'}
          value={this.state.name}
          onChangeText={(name) => {this.setState({name})}}
          orientation={'vertical'}
        />
        <InputWithLabel style={styles.input}
          label={'City'}
          value={this.state.city}
          onChangeText={(city) => {this.setState({city})}}
          orientation={'vertical'}
        />

        <Text style={{textAlign: 'left'}}>Date</Text>

        <TouchableOpacity onPress={this.DatePickerMainFunctionCall.bind(this)} >
 
         <View style={styles.datePickerBox}style={{width: 100, height: 50}}>
  
          <Text style={styles.datePickerText}>{this.state.DateText}</Text>

         </View>

        </TouchableOpacity>


        {/* Place the dialog component at end of your views and assign the references, event handlers to it.*/}
          <DatePickerDialog ref="DatePickerDialog" onDatePicked={this.onDatePickedFunction.bind(this)} />


        <AppButton style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={this._update}
        />
      </ScrollView>
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
