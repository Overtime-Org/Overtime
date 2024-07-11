import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ConnectWallet from './ConnectWallet';
import Streams from './Streams';
import SingleStream from './Streams/SingleStream';
import CreateStream from './CreateStream'
import Unwrap from './Streams/Incoming/Unwrap';
import '@walletconnect/react-native-compat'
import { WagmiConfig } from 'wagmi'
import { celo } from 'viem/chains'
import { createWeb3Modal, defaultWagmiConfig, Web3Modal, useWeb3Modal } from '@web3modal/wagmi-react-native'
import {PROJECT_NAME, PROJECT_DESCRIPTION} from '@env';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StatusBar } from 'expo-status-bar';

const projectId = process.env['PROJECT_ID'];

const metadata = {
	name: PROJECT_NAME,
	description: PROJECT_DESCRIPTION,
	url: 'https://ianmunge0.github.io/overtime-demo'
};

const chains = [celo]

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  tokens: {
    42220: {
      address: '0x765DE816845861e75A25fCA122bb6898B8B1282a'
    }
  }
})

const Stack = createStackNavigator();

function App() {
  
  const [disconnected, isDisconnected] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [creatingstream, setCreatingstream] = useState(false)
  const [refreshoutgoing, setRefreshoutgoing] = useState(false)
  const [deleted_refresh, setDeleted_refresh] = useState(false)
  const connectionprop = (isDisconnected_) => {
    isDisconnected(isDisconnected_);
  }

  useEffect(() => {
    if (refreshoutgoing == false && creatingstream == true) {
      setCreatingstream(false);
    }
  }, [refreshoutgoing])

  useEffect(() => {
    if (creatingstream == false && disabled == true) {
      setDisabled(false);
    }
  }, [creatingstream])

  const isDarkMode = useColorScheme() === 'dark';
  const { open } = useWeb3Modal()

  return (
    <WagmiConfig config={wagmiConfig}>
      <NavigationContainer>
        <StatusBar style='auto'/>
        <Stack.Navigator>
          {disconnected ? 
            <Stack.Screen name="ConnectWallet" options={{ headerShown: false }}>
              {() => {return <ConnectWallet connectionprop={connectionprop}/>}}
            </Stack.Screen>
          : <>
            <Stack.Screen
              name="Streams"
              options={{
                headerStyle: {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter},
                headerTitle: "Overtime",
                headerTitleStyle: {color: isDarkMode ? Colors.white : Colors.black},
                headerRight: () => 
                  <MaterialCommunityIcons 
                    name="account"
                    style={{paddingVertical: 10, paddingHorizontal: 15, color: isDarkMode ? Colors.white : Colors.black}}
                    onPress={() => open()}
                    size={24}/>}}>
              {() => {return <Streams connectionprop={connectionprop} refreshoutgoing={refreshoutgoing} setrefreshoutgoing={setRefreshoutgoing} deleted_refresh={deleted_refresh} setdeleted_refresh={setDeleted_refresh}/>}}
            </Stack.Screen>
            <Stack.Screen
              name="SingleStream"
              options={{
                headerStyle: {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter},
                headerBackImage: () => <Ionicons name="arrow-back" style={{color: isDarkMode ? Colors.white : Colors.black}} size={24} />,
                headerTitle: "",
                headerRight: () => 
                  <MaterialCommunityIcons
                    name="account"
                    style={{paddingVertical: 10, paddingHorizontal: 15, color: isDarkMode ? Colors.white : Colors.black}}
                    onPress={() => open()}
                    size={24}/>}}>
              {(props) => {return <SingleStream {...props} connectionprop={connectionprop} setdeleted_refresh={setDeleted_refresh}/>}}
            </Stack.Screen>
            <Stack.Screen
              name="CreateStream"
              options={{
                headerStyle: {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter},
                headerBackImage: () => <Ionicons name="arrow-back" style={{color: isDarkMode ? Colors.white : Colors.black}} size={24} />,
                headerTitle: "",
                headerRight: () =>
                  <MaterialCommunityIcons
                    name="account"
                    style={{paddingVertical: 10, paddingHorizontal: 15, color: isDarkMode ? Colors.white : Colors.black}}
                    onPress={() => open()}
                    size={24}/>}}>
              {() => {return <CreateStream connectionprop={connectionprop} setdisabled={setDisabled} disabled={disabled} setrefreshoutgoing={setRefreshoutgoing} setcreatingstream={setCreatingstream} creatingstream={creatingstream}/>}}
            </Stack.Screen>
            <Stack.Screen
              name="Unwrap"
              options={{
                headerStyle: {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter},
                headerBackImage: () => <Ionicons name="arrow-back" style={{color: isDarkMode ? Colors.white : Colors.black}} size={24} />,
                headerTitle: "",
                headerRight: () =>
                  <MaterialCommunityIcons
                    name="account"
                    style={{paddingVertical: 10, paddingHorizontal: 15, color: isDarkMode ? Colors.white : Colors.black}}
                    onPress={() => open()}
                    size={24}/>}}>
              {() => {return <Unwrap />}}
            </Stack.Screen>
            </>}
          </Stack.Navigator>
      </NavigationContainer>
      <Web3Modal/>
    </WagmiConfig>
  );
}

export default App;
