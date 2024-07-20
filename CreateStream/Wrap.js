import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TextInput,
  Text,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Modal
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AntDesign } from '@expo/vector-icons';
import { useAccount } from 'wagmi'
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from 'ethers'
import {celo} from 'viem/chains'
import { Framework } from '@superfluid-finance/sdk-core'

const Wrap = ({modalVisible, setModalVisible}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [wrapamount, setWrapamount] = useState('');
  const [disableadd, setDisableadd] = useState(false);
  const [step, setStep] = useState(0);
  const [amountwei, setAmountwei] = useState('');
  useEffect(() => {
    if (disableadd == true) {
      const wrapamountstr = (wrapamount * 1000000000000000000).toString()
      wrap0(wrapamountstr)
    }
  }, [disableadd])
  useEffect(() => {
    if (wrapamount == '' && disableadd == true) {
      setDisableadd(false)
    }
  }, [wrapamount])
  useEffect(() => {
    if (amountwei.length > 0) {
      setStep(step + 1)
    }
  }, [amountwei])

  const { address, connector } = useAccount()
  const provider = address == undefined ? undefined : connector._provider;
  const web3Provider = useMemo(
    () =>
        provider ? new ethers.providers.Web3Provider(provider, celo.id) : undefined,
    [provider]
  )

  async function wrap0(amount) {
    try {
      if (provider != undefined){
        const sf = await Framework.create({
          chainId: celo.id,
          provider: web3Provider
        });
        const signer = web3Provider.getSigner();
        const cusd = (await sf.loadSuperToken("cUSDx")).underlyingToken;
        const funapprove = cusd.approve({
          receiver: "0x3AcB9A08697b6Db4cD977e8Ab42b6f24722e6D6e",
          amount: amount
        });
        await funapprove.exec(signer)
        .then(() => {
          setWrapamount('')
          setAmountwei(amount)
        })
        
      }
    }
    catch (error) {
      setWrapamount('')
    }
  }

  async function wrap1() {
    try {
      if (provider != undefined){
        if (amountwei.length > 0) {
          const sf = await Framework.create({
            chainId: celo.id,
            provider: web3Provider
          });
          const signer = web3Provider.getSigner();
          const cusdx = await sf.loadSuperToken("cUSDx");
          const funupgrade = cusdx.upgrade({amount: amountwei});
          await funupgrade.exec(signer)
          .then(() => {
            setStep(step + 1)
          })
        }
      }
    }
    catch (error) {
      setAmountwei('')
      setStep(0)
    }
  }

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const wrapamountChange = (newText) => setWrapamount(newText);

  const isDarkMode = useColorScheme() === 'dark';
  const modal_swholescreenstyle = {flex: 1, alignItems: 'center', justifyContent: 'center'}
  const modal_sinnerstyle = {
    padding: 10,
    backgroundColor: isDarkMode ? Colors.dark : Colors.lighter,
    width: '80%',
    height: '60%',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
  const fli = { paddingTop: 18, marginTop: 10, borderBottomColor: isFocused ? "#15D828" : (isDarkMode ? Colors.light : Colors.dark), borderBottomWidth: 1, width: '100%' }
  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: isFocused || wrapamount != '' ? 0 : 18,
    fontSize: isFocused || wrapamount != '' ? 14 : 20,
    color: isFocused ? "#15D828" : (isDarkMode ? Colors.light : "#989CB0")
  }
  const textinputstyle = { 
    height: 26,
    fontSize: 20,
    color: isDarkMode ? Colors.white : Colors.black,
    width: '100%'
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        if (step == 2) {
          setAmountwei('')
          setStep(0)
        }
        setModalVisible(false);
      }}>
      <View style={modal_swholescreenstyle}>
        <View style={modal_sinnerstyle}>
          <ScrollView>
            <TouchableOpacity
              style={{alignSelf: 'flex-end'}}
              onPress={() => {
                if (step == 2) {
                  setAmountwei('')
                  setStep(0)
                }
                setModalVisible(false)
              }}>
              <AntDesign name="close" size={25} color={isDarkMode ? Colors.light : Colors.black}/>
            </TouchableOpacity>

            {step == 0 ? <Text style={{marginTop: 10, color: isDarkMode ? Colors.white : Colors.black}}>Allow Overtime to spend an amount of cUSD on cUSDx</Text> : <></>}
            {step == 0 ?
              <View style={fli}>
                <Text style={labelStyle}>
                  Amount
                </Text>
                <TextInput
                  onChangeText={wrapamountChange}
                  style={textinputstyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={wrapamount}
                  keyboardType={'numeric'}
                />
              </View>
            : <></>}

            {step == 0 ?
              <TouchableOpacity
                style={{ marginTop: '10%', alignSelf: 'center', width: 95, height: 40, backgroundColor: '#15D828', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                disabled={disableadd}
                onPress={() => {
                  if (wrapamount.length > 0 && isNaN(Number(wrapamount)) == false) {
                    setDisableadd(true)
                  }
                }}>
                <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>ALLOW</Text>
              </TouchableOpacity>
            : <></>}
            
            {step == 1 ? <Text style={{marginTop: 10, color: isDarkMode ? Colors.white : Colors.black}}>Finish adding {(Number(amountwei) / 1000000000) / 1000000000} cUSDx</Text> : <></>}
            {step == 1 ?
              <TouchableOpacity
                style={{ marginTop: '10%', alignSelf: 'center', width: 95, height: 40, backgroundColor: '#15D828', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => wrap1()}>
                <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>FINISH</Text>
              </TouchableOpacity>
            : <></>}

            {step == 2 ? <Text style={{marginTop: 10, color: isDarkMode ? Colors.white : Colors.black}}>{(Number(amountwei) / 1000000000) / 1000000000} cUSDx added successfully</Text> : <></>}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default Wrap;