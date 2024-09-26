import React, {useEffect} from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useWeb3Modal } from '@web3modal/wagmi-react-native'
import { useAccount } from 'wagmi'

function ConnectWallet({connectionprop}) {
  const { open } = useWeb3Modal()
  const { isDisconnected, isConnecting } = useAccount()
  
  useEffect(() => {
    if (!isConnecting && isDisconnected) {
      connectionprop(isDisconnected);
    }
    else if (!isConnecting && !isDisconnected) {
      connectionprop(isDisconnected);
    }
  }, [isConnecting])

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <TouchableOpacity 
        style={{ width: 190, height: 40, backgroundColor: '#15D828', borderRadius: 10, alignItems: 'center', justifyContent: 'center', opacity: isConnecting ? 0.6 : 1 }}
        onPress={() => open()}
        disabled={isConnecting || !isDisconnected}>
        {isConnecting ?
          <ActivityIndicator size="small" color="white"/>
        : <Text style={{ color: 'white', fontSize: 17, fontFamily: 'Inter', fontWeight: '700' }}>CONNECT WALLET</Text>}
      </TouchableOpacity>
    </View>
  )
};

export default ConnectWallet;