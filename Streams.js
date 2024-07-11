import React, {useEffect} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Incoming from './Streams/Incoming/Incoming';
import Outgoing from './Streams/Outgoing';
import { useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAccount } from 'wagmi'

const Tab = createMaterialTopTabNavigator();

export default function Streams({connectionprop, refreshoutgoing, setrefreshoutgoing, deleted_refresh, setdeleted_refresh}) {
  const isDarkMode = useColorScheme() === 'dark';
  const { address } = useAccount()

  useEffect(() => {
    if (address == undefined) {
      connectionprop(true);
    }
  }, [address])

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {backgroundColor: '#15D828'},
        tabBarActiveTintColor: '#15D828',
        tabBarInactiveTintColor: '#656070',
        tabBarLabelStyle: {textTransform: 'capitalize', fontWeight: '500'},
        tabBarStyle: {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter}
      }}>
      <Tab.Screen name="Incoming">
        {() => {return <Incoming/>}}
      </Tab.Screen>
      <Tab.Screen name="Outgoing">
        {() => {return <Outgoing refreshoutgoing={refreshoutgoing} setrefreshoutgoing={setrefreshoutgoing} deleted_refresh={deleted_refresh} setdeleted_refresh={setdeleted_refresh}/>}}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
