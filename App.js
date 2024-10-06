import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ConnectWallet from './ConnectWallet';
import Streams from './Streams';
import SingleStream from './Streams/SingleStream';
import CreateStream from './CreateStream/CreateStream'
import Unwrap from './Streams/Incoming/Unwrap';
import '@walletconnect/react-native-compat'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { celo } from 'viem/chains'
import { createAppKit, defaultWagmiConfig, AppKit, useAppKit } from '@reown/appkit-wagmi-react-native';
import {PROJECT_NAME, PROJECT_DESCRIPTION} from '@env';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider, ApolloClient } from '@apollo/client';
import { HttpLink, InMemoryCache } from 'apollo-boost';

const queryClient = new QueryClient();

const projectId = process.env['PROJECT_ID'];

const metadata = {
	name: PROJECT_NAME,
	description: PROJECT_DESCRIPTION,
	url: 'https://ianmunge0.github.io/overtime-demo'
};

const chains = [celo]

const wagmiConfig = defaultWagmiConfig({chains, projectId, metadata});

createAppKit({
  projectId,
  wagmiConfig,
  tokens: {
    42220: {
      address: '0x765DE816845861e75A25fCA122bb6898B8B1282a'
    }
  }
});

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://celo-mainnet.subgraph.x.superfluid.dev/' }),
  cache: new InMemoryCache()
});

const Stack = createStackNavigator();

function App() {
  
  const [disconnected, isDisconnected] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [creatingstream, setCreatingstream] = useState(false)
  const [refreshoutgoing, setRefreshoutgoing] = useState(false)
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
  const { open } = useAppKit();

  return (
    <ApolloProvider client={client}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer
            theme={{
              colors: {
                background: isDarkMode ? Colors.darker : Colors.lighter
              }
            }}>
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
                    headerShadowVisible: false,
                    headerRight: () => 
                      <MaterialCommunityIcons 
                        name="account"
                        style={{paddingVertical: 10, paddingHorizontal: 15, color: isDarkMode ? Colors.white : Colors.black}}
                        onPress={() => open()}
                        size={24}/>
                  }}>
                  {() => {return <Streams connectionprop={connectionprop}/>}}
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
                  {(props) => {return <SingleStream {...props} connectionprop={connectionprop}/>}}
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
          <AppKit/>
        </QueryClientProvider>
      </WagmiProvider>
    </ApolloProvider>
  );
}

export default App;
