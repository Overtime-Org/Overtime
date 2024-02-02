import React, {useEffect, useState} from 'react';
import { Text, View, TouchableOpacity, useColorScheme, ActivityIndicator } from "react-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useWeb3Modal } from '@web3modal/wagmi-react-native'
import { useAccount } from 'wagmi'

function ConnectWallet({connectionprop}) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const { open } = useWeb3Modal()
  const { address, isDisconnected, isConnecting } = useAccount()
  
  useEffect(() => {
    if (!isConnecting && isDisconnected) {
      connectionprop(isDisconnected);
    }
    else if (!isConnecting && !isDisconnected) {
      connectionprop(isDisconnected);
    }
  }, [isConnecting])

  return (
    <View style={{ ...backgroundStyle, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <TouchableOpacity 
        style={{ width: 190, height: 40, backgroundColor: '#15D828', borderRadius: 10, alignItems: 'center', justifyContent: 'center', opacity: isConnecting ? 0.6 : 1 }}
        onPress={() => open()}
        disabled={isConnecting}>
        {isConnecting ?
          <ActivityIndicator size="small" color="white"/>
        : <Text style={{ color: 'white', fontSize: 17, fontFamily: 'Inter', fontWeight: '700' }}>CONNECT WALLET</Text>}
      </TouchableOpacity>
    </View>
  )
};

export default ConnectWallet;