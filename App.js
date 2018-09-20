import {
  createStackNavigator,
} from 'react-navigation';
import HomeScreen from './HomeScreen';
import ViewScreen from './ViewScreen';
import CreateScreen from './CreateScreen';
import EditScreen from './EditScreen';

export default createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  View: {
    screen: ViewScreen
  },
  Create: {
    screen: CreateScreen
  },
  Edit: {
    screen: EditScreen
  },
}, {
  initialRouteName: 'Home',
  navigationOptions: {
    headerStyle: {
      backgroundColor: 'blue',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});
