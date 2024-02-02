import React, {useEffect} from 'react';
import { Text, View, useColorScheme, Dimensions, TouchableOpacity } from "react-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Octicons } from '@expo/vector-icons';
import { useAccount } from 'wagmi'

const SingleStream = ({route, connectionprop}) => {

  const { address } = useAccount()
  useEffect(() => {
    if (address == undefined) {
      connectionprop(true)
    }
  }, [address])

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

  return (
    <View style={{ ...backgroundStyle, flex: 1 }}>
      <View style={{ alignItems: 'center', justifyContent: 'space-evenly', flex: 0.6 }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>{route.params.type === 'outgoing' ? "Receiver:" : "Sender:"}</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>{route.params.name}</Text></View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Start:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>30/2/2022 06:00 PM</Text></View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Stop:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>30/2/2022 09:00 PM</Text></View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Elapsed:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}><Text style={{color: "#15D828" , fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>{route.params.elapsed} hr(s) {/*30 min 00 s*/}</Text></View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Rate:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>500 cUSDx/hr</Text></View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Streamed:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}><Text style={{color: "#15D828", fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>{route.params.streamed} cUSDx</Text></View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Expected:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>1500 cUSD</Text></View>
        </View>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'flex-start', flex: 0.4 }}>
        <TouchableOpacity style={{ width: 226, height: 58, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <Text style={{ color: "#15D828", fontSize: 19, fontFamily: 'Rubik', fontWeight: '500' }}>View on Explorer</Text>
          <Octicons name="link-external" size={19} style={{ marginLeft: 5, color: '#15D828' }} />
        </TouchableOpacity>
        {route.params.type === 'incoming' ?
        <></>
        : 
        <TouchableOpacity style={{ marginTop: 35, width: 190, height: 40, backgroundColor: '#FA0514', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontSize: 17, fontFamily: 'Inter', fontWeight: '700' }}>CANCEL STREAM</Text>
        </TouchableOpacity>}
      </View>
    </View>
  );
};
export default SingleStream;