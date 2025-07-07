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
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import '@walletconnect/react-native-compat'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import {celo} from 'viem/chains'
import Wrap from './Wrap';
import Timeranges from './Timeranges';
import QR from './QR';
import SuperToken from '../../../abis/supertoken.abi.json';
import CFAv1Forwarder from '../../../abis/cfav1forwarder.abi.json';
import BigNumber from "bignumber.js";
import { useCameraPermissions } from 'expo-camera';

function Receiver({
  label,
  value,
  onchangetext,
  resetreceiver,
  setresetreceiver,
  funcpermission,
  permissioninfo,
  invalid,
  margintop,
  keyboardtype
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isDarkMode = useColorScheme() === 'dark';

  const fli = { 
    paddingTop: 18,
    borderBottomColor: isFocused ? "#15D828" : "#989CB0",
    borderBottomWidth: 1,
    flexDirection: 'row',
    width: value.match(RegExp(/^0x[a-fA-F0-9]{40}$/)) == null ? '80%' : '65%'
  }

  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: isFocused || value != '' ? 0 : 18,
    fontSize: isFocused || value != '' ? 14 : 20,
    color: isFocused ? "#15D828" : "#989CB0"
  };
  const textinputstyle = { 
    height: 26,
    fontSize: 20,
    color: isDarkMode ? Colors.white : Colors.black,
    width: '100%'
  }

  return (
    <View style={{flexDirection: 'row', marginTop: margintop}}>
      {
        resetreceiver == false ?
          (
            <View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{width: '20%', alignItems: 'center'}}
                  onPress={() => funcpermission()}>
                  <MaterialCommunityIcons
                    name='qrcode-scan'
                    size={30}
                    style={{position: 'absolute', bottom: 0, color: isDarkMode ? Colors.white : Colors.black}}/>
                </TouchableOpacity>
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
                {
                  value.match(RegExp(/^0x[a-fA-F0-9]{40}$/)) == null ? 
                    <></>
                  :
                    <TouchableOpacity
                      style={{width: '15%', alignItems: 'center'}}
                      onPress={() => setresetreceiver(true)}>
                      <MaterialCommunityIcons
                        name='check'
                        size={30}
                        style={{position: 'absolute', bottom: 0, color: '#15D828'}}/>
                    </TouchableOpacity>
                }
              </View>
              {
                permissioninfo == true ?
                  <Text style={{alignSelf: 'center', color: isDarkMode ? Colors.white : Colors.black}}>
                    Grant camera permission in Settings
                  </Text>
                :
                  <></>
              }
              { invalid == true ? <Text style={{alignSelf: 'center', color: '#FA0514'}}>Invalid address</Text> : <></> }
            </View>
          )
        :
          (
            <>
              <View style={{width: '80%'}}>
                <Text style={{fontSize: 20, color: isDarkMode ? Colors.white : Colors.black}}>
                  {value}
                </Text>
              </View>
              <TouchableOpacity
                style={{width: '20%', alignItems: 'center', justifyContent: 'center'}}
                onPress={() => setresetreceiver(false)}>
                <MaterialIcons name='cancel' size={30} color='#FA0514'/>
              </TouchableOpacity>
            </>
          )
      }
    </View>
  );
}

function Rate({label1, value1, onchangetext1, margintop1, keyboardtype1, timerange1, setshowlisttrue1}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isDarkMode = useColorScheme() === 'dark';

  const fli = { paddingTop: 18, borderBottomColor: isFocused ? "#15D828" : "#989CB0", borderBottomWidth: 1, flexDirection: 'row', width: '60%' }

  const labelStyle = {
    position: 'absolute',
    left: 0,
    top: isFocused || value1 != '' ? 0 : 18,
    fontSize: isFocused || value1 != '' ? 14 : 20,
    color: isFocused ? "#15D828" : "#989CB0"
  };
  const textinputstyle = { 
    height: 26,
    fontSize: 20,
    color: isDarkMode ? Colors.white : Colors.black,
    width: '100%'
  }

  let timeranges = ['month', 'day', 'hour'];
  
  return (
    <View style={{flexDirection: 'row', marginTop: margintop1}}>
      <View style={fli}>
        <Text style={labelStyle}>
          {label1}
        </Text>
        <TextInput
          onChangeText={onchangetext1}
          style={textinputstyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value1}
          keyboardType={keyboardtype1}
        />
      </View>
      <View style={{width: '10%'}}><Text style={{position: 'absolute', bottom: 0, fontSize: 20, alignSelf: 'center', color: isDarkMode ? Colors.white : Colors.black}}>/</Text></View>
      <TouchableOpacity style={{width: '30%'}} onPress={() => setshowlisttrue1(true)}>
        <View
          style={{position: 'absolute', bottom: 0, flexDirection: 'row'}}>
          <View style={{width: '79.16%'}}>
            <View style={{position: 'absolute', bottom: 0}}>
              <Text style={{fontSize: 20, color: isDarkMode ? Colors.white : Colors.black}}>
                {timeranges[timerange1]}
              </Text>
            </View>
          </View>
          <View style={{width: '20.84%'}}>
            <View style={{position: 'absolute', bottom: 0}}>
              <MaterialCommunityIcons name='chevron-down' size={20} style={{color: isDarkMode ? Colors.white : Colors.black}}/>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function CreateStream({
  connectionprop,
  setdisabled,
  disabled,
  setrefreshoutgoing,
  setcreatingstream,
  creatingstream,
  qrview,
  setqrview
}) {
  const [receiver, setReceiver] = useState('');
  const [rate, setRate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [buffer, setBuffer] = useState(BigNumber(0));
  const [minafterbuffe1r, setMinafterbuffe1r] = useState(BigNumber(0));
  const [details, setDetails] = useState(false)
  const [showlist, setShowlist] = useState(false);
  const [timerange, setTimerange] = useState(0);
  const [resetreceiver, setResetreceiver] = useState(false);
  const [permissioninfo, setPermissioninfo] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const { address, isDisconnected } = useAccount();
  const [permission, requestPermission] = useCameraPermissions();

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

  async function toratestr(rate, timerange){
    var rateweips;
    switch (timerange) {
      case 0:
        rateweips = (BigNumber(rate).times(BigNumber('1000000000000000000'))).dividedBy(2592000);
        break;
        
      case 1:
        rateweips = (BigNumber(rate).times(BigNumber('1000000000000000000'))).dividedBy(86400);
        break;

      case 2:
        rateweips = (BigNumber(rate).times(BigNumber('1000000000000000000'))).dividedBy(3600);
        break;
    }
    return rateweips.toFormat(0, BigNumber.ROUND_CEIL, {groupSeparator: ''});
  }

  async function createflow(receiver, rate, timerange) {
    try {
      if (isDisconnected == false) {
        const ratestr = await toratestr(rate, timerange);
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
  }, [address]);

  useEffect(() => {
    switch (timerange) {
      case 0:
        if (rate.length > 0 && BigNumber(rate).isNaN() == false && BigNumber(rate).isFinite() == true) {
          setBuffer(BigNumber(rate).dividedBy(180));
          setMinafterbuffe1r(BigNumber(rate).dividedBy(30));
        }
        else if (rate.length == 0 || BigNumber(rate).isNaN() == true || BigNumber(rate).isFinite() == false) {
          setBuffer(BigNumber(0));
          setMinafterbuffe1r(BigNumber(0));
        }
        break;
    
      case 1:
        if (rate.length > 0 && BigNumber(rate).isNaN() == false && BigNumber(rate).isFinite() == true) {
          setBuffer(BigNumber(rate).dividedBy(6));
          setMinafterbuffe1r(BigNumber(rate));
        }
        else if (rate.length == 0 || BigNumber(rate).isNaN() == true || BigNumber(rate).isFinite() == false) {
          setBuffer(BigNumber(0));
          setMinafterbuffe1r(BigNumber(0));
        }
        break;

      case 2:
        if (rate.length > 0 && BigNumber(rate).isNaN() == false && BigNumber(rate).isFinite() == true) {
          setBuffer(BigNumber(rate).times(4));
          setMinafterbuffe1r(BigNumber(rate).times(24));
        }
        else if (rate.length == 0 || BigNumber(rate).isNaN() == true || BigNumber(rate).isFinite() == false) {
          setBuffer(BigNumber(0));
          setMinafterbuffe1r(BigNumber(0));
        }
        break;
    }
  }, [timerange]);

  useEffect(() => {
    if (permissioninfo == true) {
      setTimeout(() => {setPermissioninfo(false)}, 4000);
    }
  }, [permissioninfo]);

  useEffect(() => {
    if (invalid == true) {
      setTimeout(() => {setInvalid(false)}, 3000);
    }
  }, [invalid]);

  useEffect(() => {
    if (disabled == true) {
      setcreatingstream(true)
    }
  }, [disabled])

  useEffect(() => {
    if (creatingstream == true) {
      createflow(receiver, rate, timerange)
    }
  }, [creatingstream])

  useEffect(() => {
    if (resetreceiver == false && receiver == '' && buffer.eq(BigNumber(0)) && creatingstream == true) {
      setRate('');
    }
  }, [receiver])

  useEffect(() => {
    if (resetreceiver == false && receiver == '' && rate == '' && buffer.eq(BigNumber(0)) && creatingstream == true) {
      setcreatingstream(false)
    }
  }, [rate])

  useEffect(() => {
    if(resetreceiver == false && buffer.eq(BigNumber(0)) && creatingstream == true){
      setReceiver('');
    }
  }, [resetreceiver]);

  useEffect(() => {
    if (buffer.eq(BigNumber(0)) && creatingstream == true){
      if (resetreceiver == true) {
        setResetreceiver(false);
      }
      else if (resetreceiver == false) {
        setReceiver('');
      }
    }
  }, [buffer]);

  useEffect(() => {
    setBuffer(BigNumber(0))
  }, [isSuccess]);

  useInterval(() => {
    queryresult.refetch();
  }, 3000)

  const receiverChange = (newText) => setReceiver(newText);
  const rateChange = (newText) => {
    switch (timerange) {
      case 0:
        setRate(newText);
        if (newText.length > 0 && BigNumber(newText).isNaN() == false && BigNumber(newText).isFinite() == true) {
          setBuffer(BigNumber(newText).dividedBy(180));
          setMinafterbuffe1r(BigNumber(newText).dividedBy(30));
        }
        else if (newText.length == 0 || BigNumber(newText).isNaN() == true || BigNumber(newText).isFinite() == false) {
          setBuffer(BigNumber(0));
          setMinafterbuffe1r(BigNumber(0));
        }
        break;
    
      case 1:
        setRate(newText);
        if (newText.length > 0 && BigNumber(newText).isNaN() == false && BigNumber(newText).isFinite() == true) {
          setBuffer(BigNumber(newText).dividedBy(6));
          setMinafterbuffe1r(BigNumber(newText));
        }
        else if (newText.length == 0 || BigNumber(newText).isNaN() == true || BigNumber(newText).isFinite() == false) {
          setBuffer(BigNumber(0));
          setMinafterbuffe1r(BigNumber(0));
        }
        break;

      case 2:
        setRate(newText);
        if (newText.length > 0 && BigNumber(newText).isNaN() == false && BigNumber(newText).isFinite() == true) {
          setBuffer(BigNumber(newText).times(4));
          setMinafterbuffe1r(BigNumber(newText).times(24));
        }
        else if (newText.length == 0 || BigNumber(newText).isNaN() == true || BigNumber(newText).isFinite() == false) {
          setBuffer(BigNumber(0));
          setMinafterbuffe1r(BigNumber(0));
        }
        break;
    }    
  };  

  async function funcscanneddata(scanneddata) {
    if (scanneddata.match(RegExp(/^0x[a-fA-F0-9]{40}$/)) == null) {
      if (scanneddata.search('0x') >= 0) {
        if (scanneddata.substring(scanneddata.search('0x')).length >= 42) {
          if (scanneddata.substring(scanneddata.search('0x'), scanneddata.search('0x')+42).match(RegExp(/^0x[a-fA-F0-9]{40}$/)) == null) {
            setInvalid(true)
          }
          else {
            setReceiver(scanneddata.substring(scanneddata.search('0x'), scanneddata.search('0x')+42));
            setResetreceiver(true);
          }
        }
        else {
          setInvalid(true);
        }
      }
      else {
        setInvalid(true);
      }
    }
    else {
      setReceiver(scanneddata);
      setResetreceiver(true);
    }
  }
  
  async function funcpermission() {
    switch (permission.granted) {
      case true:
        setqrview(true);
        break;
    
      case false:
        let permissionresponse = await requestPermission();
        if (permissionresponse.status == "granted") {
          setqrview(true);
        }
        else {
          setPermissioninfo(true);
        }
        break;
    }
  }

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
    {
      qrview == false ?
        <ScrollView style={{ flex: 1, flexDirection: 'column', padding: 30 }}>
          <Receiver
            label="Address"
            value={receiver}
            onchangetext={receiverChange}
            resetreceiver={resetreceiver}
            setresetreceiver={setResetreceiver}
            funcpermission={funcpermission}
            permissioninfo={permissioninfo}
            invalid={invalid}
            margintop={18}
            keyboardtype="default"
          />
          <Rate
            label1="Rate"
            value1={rate}
            onchangetext1={rateChange}
            margintop1={50}
            keyboardtype1="numeric"
            timerange1={timerange}
            setshowlisttrue1={setShowlist}
          />
          <Wrap modalVisible={modalVisible} setModalVisible={setModalVisible}/>
          <Timeranges showlist={showlist} setshowlistfalse={setShowlist} settimerange={setTimerange}/>
          {details == true ?
            <View style={{flexDirection: 'row', marginTop: 35, width: '100%', paddingHorizontal: 10, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
              <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>Upfront Buffer: {String(buffer)} cUSDx</Text>
            </View>
          :
            <></>
          }
          {details == true ?
            <View style={{flexDirection: 'row', marginTop: 15, width: '100%', paddingHorizontal: 10, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
              <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>Minimum after Buffer: {String(minafterbuffe1r)} cUSDx</Text>
            </View>
          :
            <></>
          }
          <View style={{flexDirection: 'row', marginTop: details == true ? 15 : 35, width: '100%'}}>
            <View style={{width: '60%', marginLeft: 10, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
              <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>Total Required: {rate.length > 0 && BigNumber(rate).isNaN() == false ? String(buffer.plus(minafterbuffe1r)) : 0} cUSDx</Text>
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
              <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>{queryresult.isFetched ? String(BigNumber(queryresult.data).dividedBy(BigNumber('1000000000000000000'))) : "--"} cUSDx</Text>
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
              if (regex.test(receiver) == true && rate.length > 0 && BigNumber(rate).isNaN() == false && BigNumber(rate).isFinite() == true) {
                if (
                  (BigNumber(queryresult.data).dividedBy(BigNumber('1000000000000000000'))).gt(BigNumber('0.0000000000001008')) &&
                  buffer.plus(minafterbuffe1r).lt(BigNumber(queryresult.data).dividedBy(BigNumber('1000000000000000000')))
                ) {
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
      :
        <QR funcscanneddata={funcscanneddata} setqrviewfalse={setqrview} />
    }
    </>
  );
}
