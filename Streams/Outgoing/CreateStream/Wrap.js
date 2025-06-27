import React, { useState, useEffect } from 'react';
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
import '@walletconnect/react-native-compat'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import {celo} from 'viem/chains'
import StableTokenV2 from '../../../abis/stabletokenv2.abi.json';
import SuperToken from '../../../abis/supertoken.abi.json';

const Wrap = ({modalVisible, setModalVisible}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [wrapamount, setWrapamount] = useState('');
  const [disableadd, setDisableadd] = useState(false);
  const [skipapprove, setSkipapprove] = useState(false);

  const { address } = useAccount()

  const wrap0write = useWriteContract();
  const wrap1write = useWriteContract();

  var queryresult = useReadContract({
    address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    abi: StableTokenV2,
    functionName: 'allowance',
    args: [
      address == undefined ? "" : address.toLowerCase(),
      '0x3acb9a08697b6db4cd977e8ab42b6f24722e6d6e'
    ],
    chainId: celo.id
  });

  useEffect(() => {
    if (disableadd == true) {
      const wrapamountstr = (wrapamount * 1000000000000000000).toString();
      wrap0(wrapamountstr);
    }
  }, [disableadd])

  async function wrap0(amount) {
    try {
      if ((wrapamount * 1000000000000000000) <= queryresult.data) {
        setSkipapprove(true);
      }
      else{
        wrap0write.writeContract({
          address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
          abi: StableTokenV2,
          functionName: 'approve',
          chainId: celo.id,
          args: ['0x3acb9a08697b6db4cd977e8ab42b6f24722e6d6e', amount]
        })
      }
    }
    catch (error) {}
  }

  async function wrap1() {
    try {
      wrap1write.writeContract({
        address: '0x3acb9a08697b6db4cd977e8ab42b6f24722e6d6e',
        abi: SuperToken,
        functionName: 'upgrade',
        chainId: celo.id,
        args: [(wrapamount * 1000000000000000000).toString()]
      })
    }
    catch (error) {}
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
  const fli = { paddingTop: 18, marginTop: 10, borderBottomColor: isFocused ? "#15D828" : (isDarkMode ? Colors.light : "#989CB0"), borderBottomWidth: 1, width: '100%' }
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
        setModalVisible(false);
      }}>
      <View style={modal_swholescreenstyle}>
        <View style={modal_sinnerstyle}>
          <ScrollView>
            <TouchableOpacity
              style={{alignSelf: 'flex-end'}}
              onPress={() => {
                setModalVisible(false)
              }}>
              <AntDesign name="close" size={25} color={isDarkMode ? Colors.light : Colors.black}/>
            </TouchableOpacity>
            {wrap1write.isSuccess == true ? 
              (<Text style={{marginTop: 10, color: isDarkMode ? Colors.white : Colors.black}}>{wrapamount} cUSDx added successfully</Text>)
            :
              (wrap0write.isSuccess == true || skipapprove ?
                <>
                  <Text style={{marginTop: 10, color: isDarkMode ? Colors.white : Colors.black}}>Finish adding {wrapamount} cUSDx</Text>
                  <TouchableOpacity
                    style={{ marginTop: '10%', alignSelf: 'center', width: 95, height: 40, backgroundColor: '#15D828', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => wrap1()}>
                    <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>FINISH</Text>
                  </TouchableOpacity>
                </>
              :
                <>
                  <Text style={{marginTop: 10, color: isDarkMode ? Colors.white : Colors.black}}>Allow Overtime to spend an amount of cUSD on cUSDx</Text>
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

                  <TouchableOpacity
                    style={{ marginTop: '10%', alignSelf: 'center', width: 95, height: 40, backgroundColor: '#15D828', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                    disabled={disableadd}
                    onPress={() => {
                      if (wrapamount.length > 0 && isNaN(Number(wrapamount)) == false) {
                        queryresult.refetch().then(() => setDisableadd(true))
                      }
                    }}>
                    <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>ALLOW</Text>
                  </TouchableOpacity>
                </>)
            }
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default Wrap;