import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TextInput,
  Text,
  useColorScheme,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAccount } from 'wagmi'
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from 'ethers'
import {celo} from 'viem/chains'
import { Framework } from '@superfluid-finance/sdk-core'

function FloatingLabelInput({label, value, onchangetext, margintop, keyboardtype}) {
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
        />
      </View>
    </View>
  );
}

export default function Unwrap() {
  const [amount, setAmount] = useState('');
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (disabled == true) {
      const amountstr = (amount * 1000000000000000000).toString()
      unwrap(amountstr)
    }
  }, [disabled])

  useEffect(() => {
    if (amount == '' && disabled == true) {
      setDisabled(false)
    }
  }, [amount])

  const { address, connector } = useAccount()
  const provider = address == undefined ? undefined : connector._provider;
  const web3Provider = useMemo(
    () =>
        provider ? new ethers.providers.Web3Provider(provider, celo.id) : undefined,
    [provider]
  )

  async function unwrap(amount) {
    try {
      if (provider != undefined){
        const sf = await Framework.create({
          chainId: celo.id,
          provider: web3Provider
        });
        const signer = web3Provider.getSigner();
        const cusdx = await sf.loadSuperToken("cUSDx");
        const fundowngrade = cusdx.downgrade({amount: amount})
        await fundowngrade.exec(signer).then(() => setAmount(''))
      }
    }
    catch (error) {setAmount('')}
  }

  const isDarkMode = useColorScheme() === 'dark';
  const amountChange = (newText) => setAmount(newText);

  return (
    <ScrollView style={{ flex: 1, flexDirection: 'column', padding: 30, backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }}>
      <FloatingLabelInput
        label="Amount"
        value={amount}
        onchangetext={amountChange}
        margintop={18}
        keyboardtype="numeric"
      />
      <TouchableOpacity
        style={{ marginTop: 75, alignSelf: 'center', width: 190, height: 40, backgroundColor: '#15D828', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
        disabled={disabled}
        onPress={() => {
          if (amount.length > 0 && isNaN(Number(amount)) == false) {
            setDisabled(true)
          }
        }}>
        <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>RETRIEVE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}