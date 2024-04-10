import React, {useEffect, useMemo, useState} from 'react';
import { Text, View, useColorScheme, Dimensions, TouchableOpacity, Linking } from "react-native";
import { useNavigation } from '@react-navigation/native'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Octicons } from '@expo/vector-icons';
import { useAccount } from 'wagmi'
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from 'ethers'
import {celo} from 'viem/chains'
import { Framework } from '@superfluid-finance/sdk-core'
import FlowingBalance from './FlowingBalance';
import Elapsed from './Elapsed';

const SingleStream = ({route, connectionprop, setdeleted_refresh}) => {
  const [deleting, isDeleting] = useState(false);
  const { address, connector } = useAccount()
  const provider = address == undefined ? undefined : connector._provider;
  const web3Provider = useMemo(
    () =>
        provider ? new ethers.providers.Web3Provider(provider, celo.id) : undefined,
    [provider]
  );
  
  useEffect(() => {
    if (address == undefined) {
      connectionprop(true)
    }
  }, [address]);
  useEffect(() => {
    isDeleting(false)
  }, []);
  useEffect(() => {
    if (deleting) {
      funcdeleteflow()
    }
  }, [deleting]);
  const navigation = useNavigation();

  async function funcdeleteflow(){
    try {
      if (provider != undefined){
        const sf = await Framework.create({
          chainId: celo.id,
          provider: web3Provider
        })
        const signer = web3Provider.getSigner();
        const cusdx = await sf.loadSuperToken("cUSDx");
        
        const deleteflow = cusdx.deleteFlow({
          sender: address,
          receiver: route.params.name
        })
        await deleteflow.exec(signer)
        .then(() => {
          isDeleting(false)
          setdeleted_refresh(true)
          navigation.goBack()
        })
      }
    }
    catch (error) {
      isDeleting(false)
    }
  }
  
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const width1st = () => {
    return (30 / 100) * Dimensions.get('window').width;
  };
  const width2nd = () => {
    return (70 / 100) * Dimensions.get('window').width;
  };

  const width0 = width1st();
  const width1 = width2nd();

  var ratecusdx = (Number(route.params.rate) / 1000000000000000000) * 3600

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let starteddate = new Date(route.params.started * 1000)
  var startdisplay = starteddate.getUTCDate()+"-"+months[starteddate.getUTCMonth()]+"-"+starteddate.getUTCFullYear()+" "+starteddate.toISOString().split('T')[1].split('.')[0]+" UTC"

  return (
    <View style={{ ...backgroundStyle, flex: 1 }}>
      <View style={{ alignItems: 'center', justifyContent: 'space-evenly', flex: 0.6, paddingRight: 5 }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>{route.params.type === 'outgoing' ? "Receiver:" : "Sender:"}</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>{route.params.name}</Text></View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Start:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>{startdisplay}</Text></View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Elapsed:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}><Elapsed started={route.params.started}/></View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Current Rate:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>{ratecusdx} cUSDx/hr</Text></View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end' }}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Streamed:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start' }}><FlowingBalance startingBalance={BigInt(route.params.streameduntilupdatedat)} startingBalanceDate={new Date(route.params.updatedattimestamp * 1000)} flowRate={BigInt(route.params.rate)}/></View>
        </View>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'flex-start', flex: 0.4 }}>
        <TouchableOpacity 
          style={{ width: 226, height: 58, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
          onPress={() => Linking.openURL("https://celoscan.io/tx/"+route.params.url)}>
          <Text style={{ color: "#15D828", fontSize: 19, fontFamily: 'Rubik', fontWeight: '500' }}>View on Explorer</Text>
          <Octicons name="link-external" size={19} style={{ marginLeft: 5, color: '#15D828' }} />
        </TouchableOpacity>
        {route.params.type === 'incoming' ?
        <></>
        : 
        <TouchableOpacity
          style={{ marginTop: 35, width: 190, height: 40, backgroundColor: '#FA0514', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
          disabled={deleting}
          onPress={deleting ? () => {} : () => {isDeleting(true)}}>
          <Text style={{ color: 'white', fontSize: 17, fontFamily: 'Inter', fontWeight: '700' }}>CANCEL STREAM</Text>
        </TouchableOpacity>}
      </View>
    </View>
  );
};
export default SingleStream;