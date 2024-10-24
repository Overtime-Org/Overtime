import React, {useEffect, useState} from 'react';
import { Text, View, useColorScheme, Dimensions, TouchableOpacity, Linking } from "react-native";
import { useNavigation } from '@react-navigation/native'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Octicons } from '@expo/vector-icons';
import '@walletconnect/react-native-compat'
import { useAccount, useWriteContract } from 'wagmi'
import {celo} from 'viem/chains'
import FlowingBalance from './FlowingBalance';
import Elapsed from './Elapsed';
import BalanceTemp from './BalanceTemp';
import CFAv1Forwarder from '../abis/cfav1forwarder.abi.json';

const SingleStream = ({route, connectionprop}) => {
  const [deleting, isDeleting] = useState(false);
  const [stylestate, setStylestate] = useState('outline');

  const { address, isDisconnected } = useAccount();
  
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

  const deleteflowwrite = useWriteContract();

  const navigation = useNavigation();

  async function funcdeleteflow(){
    try {
      if (isDisconnected == false){
        deleteflowwrite.writeContract({
          address: '0xcfA132E353cB4E398080B9700609bb008eceB125',
          abi: CFAv1Forwarder,
          functionName: 'deleteFlow',
          chainId: celo.id,
          args: [
            '0x3acb9a08697b6db4cd977e8ab42b6f24722e6d6e',
            address == undefined ? "" : address.toLowerCase(),
            route.params.name,
            address == undefined ? "" : address.toLowerCase()
          ]
        });
      }
    }
    catch (error) {
      isDeleting(false)
    }
  }

  async function deleteflowsuccess() {
    isDeleting(false);
    navigation.goBack();
  }
  
  const isDarkMode = useColorScheme() === 'dark';
  const width1st = () => {
    return (30 / 100) * Dimensions.get('window').width;
  };
  const width2nd = () => {
    return (70 / 100) * Dimensions.get('window').width;
  };
  const width0 = width1st();
  const width1 = width2nd();
  
  const buttonstyle = stylestate == 'outline' ? { marginTop: 35, width: 190, height: 40, borderColor: '#FA0514', borderWidth: 2, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }
    : { marginTop: 35, width: 190, height: 40, backgroundColor: '#FA0514', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }
  const cancelstream = stylestate == 'outline' ? { color: '#FA0514', fontSize: 17, fontFamily: 'Inter', fontWeight: '700' }
    : { color: isDarkMode ? Colors.darker : 'white', fontSize: 17, fontFamily: 'Inter', fontWeight: '700' }


  var ratecusdx = (Number(route.params.rate) / 1000000000000000000) * 3600

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let starteddate = new Date(route.params.started * 1000)
  var startdisplay = starteddate.getUTCDate()+"-"+months[starteddate.getUTCMonth()]+"-"+starteddate.getUTCFullYear()+" "+starteddate.toISOString().split('T')[1].split('.')[0]+" UTC"

  {deleteflowwrite.isSuccess == true ?
    () => deleteflowsuccess()
  : () => {}}

  return (
    <View style={{ flex: 1 }}>
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
          
          {route.params.type === 'incoming' ?
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center' }}><FlowingBalance startingBalance={BigInt(route.params.streameduntilupdatedat)} startingBalanceDate={new Date(route.params.updatedattimestamp * 1000)} flowRate={BigInt(route.params.rate)}/></View>
          :
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center' }}><BalanceTemp rate={route.params.rate} updatedattimestamp={route.params.updatedattimestamp} streameduntilupdatedat={route.params.streameduntilupdatedat}/></View>}
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
          style={buttonstyle}
          disabled={deleting}
          onPressIn={() => setStylestate('fill')}
          onPressOut={() => setStylestate('outline')}
          onPress={deleting ? () => {} : () => {isDeleting(true)}}>
          <Text style={cancelstream}>CANCEL STREAM</Text>
        </TouchableOpacity>}
      </View>
    </View>
  );
};
export default SingleStream;
