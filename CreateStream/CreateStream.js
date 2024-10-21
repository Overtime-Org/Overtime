import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AntDesign } from '@expo/vector-icons';
import '@walletconnect/react-native-compat'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import {celo} from 'viem/chains'
import Wrap from './Wrap'
import SuperToken from '../abis/supertoken.abi.json';
import CFAv1Forwarder from '../abis/cfav1forwarder.abi.json';

function FloatingLabelInput({label, value, onchangetext, margintop, keyboardtype, numUI}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isDarkMode = useColorScheme() === 'dark';

  const fli = { paddingTop: 18, marginTop: margintop, borderBottomColor: isFocused ? "#15D828" : (isDarkMode ? Colors.light : Colors.dark), borderBottomWidth: 1, flexDirection: 'row', width: numUI == 1 ? '60%' : '100%' }

  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: isFocused || value != '' ? 0 : 18,
    fontSize: isFocused || value != '' ? 14 : 20,
    color: isFocused ? "#15D828" : (isDarkMode ? Colors.light : "#989CB0")
  };
  const textinputstyle = { 
    height: 26,
    fontSize: 20,
    color: isDarkMode ? Colors.white : Colors.black,
    width: '100%'
  }
  
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={fli}>
        <Text style={labelStyle}>
          {label}
        </Text>
        <TextInput
          onChangeText={onchangetext}
          style={textinputstyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          keyboardType={keyboardtype}
        />
      </View>
      {numUI == 1 ? <View style={{width: '10%'}}><Text style={{position: 'absolute', bottom: 0, fontSize: 20, alignSelf: 'center', color: isDarkMode ? Colors.light : Colors.black}}>/</Text></View> : <></>}
      {numUI == 1 ? <View style={{width: '30%'}}><Text style={{position: 'absolute', bottom: 0, fontSize: 20, color: isDarkMode ? Colors.light : Colors.black}}>hour</Text></View> : <></>}
    </View>
  );
}

export default function CreateStream({connectionprop, setdisabled, disabled, setrefreshoutgoing, setcreatingstream, creatingstream}) {
  const [receiver, setReceiver] = useState('');
  const [rate, setRate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [buffer, setBuffer] = useState(0);
  const [details, setDetails] = useState(false)

  const { address, isDisconnected } = useAccount()

  function useInterval(callback, delay) {
    const savedCallback = useRef();
   
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
   
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  var queryresult = useReadContract({
    address: '0x3acb9a08697b6db4cd977e8ab42b6f24722e6d6e',
    abi: SuperToken,
    functionName: 'balanceOf',
    args: [address == undefined ? "" : address.toLowerCase()],
    chainId: celo.id
  });

  const { isSuccess, writeContract } = useWriteContract();

  async function hourrate(rate){
    var rateweips = (rate * 1000000000000000000) / 3600
    return Math.ceil(rateweips).toString()
  }

  async function createflow(receiver, rate) {
    try {
      if (isDisconnected == false) {
        const ratestr = await hourrate(rate);
        writeContract({
          address: '0xcfA132E353cB4E398080B9700609bb008eceB125',
          abi: CFAv1Forwarder,
          functionName: 'createFlow',
          chainId: celo.id,
          args: [
            '0x3acb9a08697b6db4cd977e8ab42b6f24722e6d6e',
            address == undefined ? "" : address.toLowerCase(),
            receiver,
            ratestr,
            address == undefined ? "" : address.toLowerCase()
          ]
        });
      }
    }
    catch (error) {}
  }

  useEffect(() => {
    if (address == undefined) {
      connectionprop(true)
    }
  }, [address])

  useEffect(() => {
    if (disabled == true) {
      setcreatingstream(true)
    }
  }, [disabled])

  useEffect(() => {
    if (creatingstream == true) {
      createflow(receiver, rate)
    }
  }, [creatingstream])

  useEffect(() => {
    if (receiver == '' && buffer == 0 && creatingstream == true) {
      setRate('');
    }
  }, [receiver])

  useEffect(() => {
    if (receiver == '' && rate == '' && buffer == 0 && creatingstream == true) {
      setcreatingstream(false)
    }
  }, [rate])

  useEffect(() => {
    if (buffer == 0 && creatingstream == true) {
      setReceiver('');
    }
  }, [buffer])

  useEffect(() => {
    setBuffer(0);
  }, [isSuccess]);

  useInterval(() => {
    queryresult.refetch();
  }, 3000)

  const receiverChange = (newText) => setReceiver(newText);
  const rateChange = (newText) => {
    setRate(newText)
    if (newText.length > 0 && isNaN(Number(newText)) == false) {
      setBuffer(newText * 4) 
    }
    else if (newText.length == 0 || isNaN(Number(newText)) == true) {
      setBuffer(0)
    }
  };

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ScrollView style={{ flex: 1, flexDirection: 'column', padding: 30 }}>
      <FloatingLabelInput
        label="Address"
        value={receiver}
        onchangetext={receiverChange}
        margintop={18}
        keyboardtype="default"
        numUI={0}
      />
      <FloatingLabelInput
        label="Rate"
        value={rate}
        onchangetext={rateChange}
        margintop={50}
        keyboardtype="numeric"
        numUI={1}
      />
      <Wrap modalVisible={modalVisible} setModalVisible={setModalVisible}/>
      {details == true ?
        <View style={{flexDirection: 'row', marginTop: 35, width: '100%', paddingHorizontal: 10, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
          <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>Upfront Buffer: {buffer} cUSDx</Text>
        </View>
      :
        <></>
      }
      {details == true ?
        <View style={{flexDirection: 'row', marginTop: 15, width: '100%', paddingHorizontal: 10, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
          <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>Minimum after Buffer: {Number(rate) * 24} cUSDx</Text>
        </View>
      :
        <></>
      }
      <View style={{flexDirection: 'row', marginTop: details == true ? 15 : 35, width: '100%'}}>
        <View style={{width: '60%', marginLeft: 10, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
          <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>Total Required: {rate.length > 0 && isNaN(Number(rate)) == false ? buffer + Number(rate) * 24 : 0} cUSDx</Text>
        </View>
        <View style={{width: '40%', alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity
            style={{borderRadius: 20, padding: 5}}
            onPress={() => setDetails(!details)}>
            <Text style={{fontWeight: '700', textDecorationLine: 'underline', color: '#15D828', marginLeft: 3, marginRight: 11}}>{details == false ? 'Details' : 'Hide'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flexDirection: 'row', marginTop: 15, width: '100%'}}>
        <View style={{width: '60%', marginLeft: 10, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
          <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>{queryresult.isFetched ? Number(queryresult.data) / 1000000000 / 1000000000 : "--"} cUSDx</Text>
        </View>
        <View style={{width: '40%', alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity
            style={{borderColor: '#15D828', flexDirection: 'row', borderRadius: 20, borderWidth: 2, padding: 5}}
            onPress={() => setModalVisible(true)}>
            <AntDesign name="plus" size={20} color="#15D828" style={{fontWeight: '700'}} />
            <Text style={{fontWeight: '700', color: '#15D828', marginLeft: 3, marginRight: 11}}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={{ marginTop: 40, alignSelf: 'center', width: 190, height: 40, backgroundColor: '#15D828', borderRadius: 10, alignItems: 'center', justifyContent: 'center', opacity: disabled == true ? 0.6 : 1 }}
        disabled={disabled}
        onPress={() => {
          let regex = new RegExp(/^0x[a-fA-F0-9]{40}$/);
          if (regex.test(receiver) == true && rate.length > 0 && isNaN(Number(rate)) == false) {
            if (buffer + Number(rate) * 24 < Number(queryresult.data) / 1000000000 / 1000000000) {
              setdisabled(true)
            }
          }
        }}>
        {disabled == true ? <ActivityIndicator size="small" color="white"/> : <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>STREAM</Text>}
      </TouchableOpacity>
      {/* {isSuccess == true ? 
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <AntDesign name="check" size={20} color="#15D828" style={{fontWeight: '700'}} />
          <Text style={{color: isDarkMode ? Colors.white : Colors.black}}> Stream started</Text>
        </View>
      : <></>} */}
    </ScrollView>
  );
}
