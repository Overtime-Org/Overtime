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
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import {celo} from 'viem/chains'
import SuperToken from '../../abis/supertoken.abi.json';

function FloatingLabelInput({label, value, onchangetext, margintop, keyboardtype, readonly}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isDarkMode = useColorScheme() === 'dark';

  const fli = { paddingTop: 18, marginTop: margintop, borderBottomColor: isFocused ? "#15D828" : (isDarkMode ? Colors.light : Colors.dark), borderBottomWidth: 1, flexDirection: 'row', width: '100%' }

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
          readOnly={readonly}
        />
      </View>
    </View>
  );
}

export default function Unwrap() {
  const [amount, setAmount] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [readonly, setReadonly] = useState(false);
  
  useEffect(() => {
    if (readonly == true) {
      if (amount.length > 0 && isNaN(Number(amount)) == false) {
        const amountbigint = amount * 1000000000000000000;
        unwrap(amountbigint)
      }
      else{
        setDisabled(false);
        setReadonly(false);
      }
    }
  }, [readonly])

  useEffect(() => {
    if (disabled == true) {
      setReadonly(true);
    }
  }, [disabled])

  useEffect(() => {
    if (amount.length == 0 && readonly == true && disabled == true) {
      setReadonly(false);
      setDisabled(false);
    }
  }, [amount]);

  const { address, connector } = useAccount()
  const provider = address == undefined ? undefined : connector._provider;
  
  var queryresult = useContractRead({
    address: '0x3acb9a08697b6db4cd977e8ab42b6f24722e6d6e',
    abi: SuperToken,
    functionName: 'balanceOf',
    args: [address == undefined ? "" : address.toLowerCase()],
    chainId: celo.id
  });
  
  const { data, isSuccess, write } = useContractWrite({
    address: '0x3acb9a08697b6db4cd977e8ab42b6f24722e6d6e',
    abi: SuperToken,
    functionName: 'downgrade',
    chainId: celo.id
  });

  useEffect(() => {
    if (isSuccess == true) {
      setAmount('');
    }
  }, [data])

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

  useInterval(() => {
    queryresult.refetch()
  }, 3000)

  async function unwrap(amount) {
    try {
      if (provider != undefined){
        write({args: [amount]});
      }
    }
    catch (error) {setAmount('')}
  }

  const isDarkMode = useColorScheme() === 'dark';
  const amountChange = (newText) => setAmount(newText);

  return (
    <ScrollView style={{ flex: 1, flexDirection: 'column', padding: 30 }}>
      <FloatingLabelInput
        label="Amount"
        value={amount}
        onchangetext={amountChange}
        margintop={18}
        keyboardtype="numeric"
        readonly={readonly}
      />
      <Text style={{color: isDarkMode ? Colors.white : Colors.black, marginTop: 20}}>{queryresult.isFetched ? Number(queryresult.data) / 1000000000 / 1000000000 : "--"} cUSDx</Text>
      <TouchableOpacity
        style={{ marginTop: 40, alignSelf: 'center', width: 190, height: 40, backgroundColor: '#15D828', borderRadius: 10, alignItems: 'center', justifyContent: 'center', opacity: disabled == true ? 0.6 : 1 }}
        disabled={disabled}
        onPress={() => {
          setDisabled(true);
        }}>
        {disabled == true ? <ActivityIndicator size="small" color="white"/> : <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>RETRIEVE</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}