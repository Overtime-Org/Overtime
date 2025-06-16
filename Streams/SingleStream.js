import React, { useEffect, useState } from 'react';
import { Text, View, useColorScheme, Dimensions, TouchableOpacity, Linking, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Octicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import '@walletconnect/react-native-compat'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import SuperToken from './../abis/supertoken.abi.json';
import {celo} from 'viem/chains'
import FlowingBalance from './FlowingBalance';
import Elapsed from './Elapsed';
import AmountStreamedTemp from './AmountStreamedTemp';
import ModificationDetails from './Outgoing/ModificationDetails';
import CFAv1Forwarder from '../abis/cfav1forwarder.abi.json';
import { gql, useQuery } from '@apollo/client';
import BigNumber from 'bignumber.js';

const FLOW_QUERY_OUTGOING = gql`
  query ($id: ID!, $flowid: ID!) {
    account(id: $id) {
      outflows(where: {id: $flowid}) {
        currentFlowRate
        updatedAtTimestamp
        streamedUntilUpdatedAt
      }
    }
  }
`;

const FLOW_QUERY_INCOMING = gql`
  query ($id: ID!, $flowid: ID!) {
    account(id: $id) {
      inflows(where: {id: $flowid}) {
        currentFlowRate
        updatedAtTimestamp
        streamedUntilUpdatedAt
      }
    }
  }
`;

function useRender() {
  const [render, setRender] = useState(false);
  return () => setRender(render => !render)
}

function ModifyStream({label, value, onchangetext, setismodifyingfalse, setnewrateempty, setvalidfalse, setshowdetails, keyboardtype, valid}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isDarkMode = useColorScheme() === 'dark';

  const fli = {
    paddingTop: 18,
    borderBottomColor: isFocused ? "#15D828" : (isDarkMode ? Colors.light : Colors.dark),
    borderBottomWidth: 1,
    flexDirection: 'row',
    width: '50%'
  }

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
    <View style={{marginBottom: 30}}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{width: '20%'}}
          onPress={() => {
            setvalidfalse(false)
            setnewrateempty('')
            setismodifyingfalse(false)
          }}>
          <AntDesign
            name="close"
            size={25}
            color={isDarkMode ? Colors.light : Colors.black}
            style={{position: 'absolute', bottom: 0, alignSelf: 'center'}}/>
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
        <View style={{width: '10%'}}><Text style={{position: 'absolute', bottom: 0, fontSize: 20, alignSelf: 'center', color: isDarkMode ? Colors.light : Colors.black}}>/</Text></View>
        <View style={{width: '20%'}}><Text style={{position: 'absolute', bottom: 0, fontSize: 20, color: isDarkMode ? Colors.light : Colors.black}}>hour</Text></View>
      </View>
      {
        valid == true ?
          <TouchableOpacity
            style={{marginTop: 15, alignSelf: 'center'}}
            onPress={() => setshowdetails(true)}>
            <Text style={{fontSize: 15, fontWeight: '600', textDecorationLine: 'underline', color: '#15D828'}}>Modification Details</Text>
          </TouchableOpacity>
        :
          <></>
      }
    </View>
  );
}

const SingleStream = ({route, connectionprop}) => {
  const [deleting, isDeleting] = useState(false);
  const [stylestate, setStylestate] = useState('outline');
  const [currentraterender, setCurrentraterender] = useState(BigInt(0));
  const [modifying, isModifying] = useState(false);
  const [newrate, setNewrate] = useState('')
  const [valid, setValid] = useState(false)
  const [showdetails, setShowdetails] = useState(false)

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

  const {isSuccess, writeContract} = useWriteContract();
  const updateflowwrite = useWriteContract();
  var querybalance = useReadContract({
    address: '0x3acb9a08697b6db4cd977e8ab42b6f24722e6d6e',
    abi: SuperToken,
    functionName: 'balanceOf',
    args: [address == undefined ? "" : address.toLowerCase()],
    chainId: celo.id
  });

  const navigation = useNavigation();

  useEffect(() => {
    if (isSuccess == true) {
      isDeleting(false);
      navigation.goBack();
    }
  }, [isSuccess])
  
  const isDarkMode = useColorScheme() === 'dark';
  const width1st = () => {
    return (30 / 100) * Dimensions.get('window').width;
  };
  const width2nd = () => {
    return (70 / 100) * Dimensions.get('window').width;
  };
  const width3rd = () => {
    return route.params.type === 'outgoing' ? 0.5 * Dimensions.get('window').width : Dimensions.get('window').width
  };
  const width4th = () => {
    return 0.45 * Dimensions.get('window').width;
  };
  const width5th = () => {
    return 0.95 * Dimensions.get('window').width;
  };
  const height1st = () => {
    return route.params.type === 'outgoing' && modifying == true ? 
        (42 / 100) * Dimensions.get('window').height
      :
        (52 / 100) * Dimensions.get('window').height
      
  };
  const height2nd = () => {
    return route.params.type === 'outgoing' && modifying == true ? 
        (42 / 100) * Dimensions.get('window').height
      :
        (32 / 100) * Dimensions.get('window').height;
  };
  const width0 = width1st();
  const width1 = width2nd();
  const width2 = width3rd();
  const width3 = width4th();
  const width4 = width5th();
  const height0 = height1st();
  const height1 = height2nd();
  
  const buttonstyle = stylestate == 'outline' ? { marginTop: 50, width: width4, height: 40, borderColor: '#FA0514', borderWidth: 2, borderRadius: 15, alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }
    : { marginTop: 50, width: width4, height: 40, backgroundColor: '#FA0514', borderRadius: 15, alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }
  const cancelstream = stylestate == 'outline' ? { color: '#FA0514', fontSize: 17, fontFamily: 'Inter', fontWeight: '700' }
    : { color: isDarkMode ? Colors.darker : 'white', fontSize: 17, fontFamily: 'Inter', fontWeight: '700' }


  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let starteddate = new Date(route.params.started * 1000)
  var startdisplay = starteddate.getUTCDate()+"-"+months[starteddate.getUTCMonth()]+"-"+starteddate.getUTCFullYear()+" "+starteddate.toISOString().split('T')[1].split('.')[0]+" UTC"

  const rerender = useRender();
  //--------
  const queryflow = useQuery(
    route.params.type === 'outgoing' ? FLOW_QUERY_OUTGOING : FLOW_QUERY_INCOMING,
    { 
      variables: { id: address == undefined ? "" : address.toLowerCase(), flowid: route.params.flowid },
      pollInterval: 500
    }
  );
  if (queryflow.error) {return;}
  if (queryflow.loading) {return;}
  if (queryflow.data.account != null) {
    if (route.params.type === 'incoming') {
      if (queryflow.data.account.inflows[0].currentFlowRate != currentraterender) {
        setCurrentraterender(queryflow.data.account.inflows[0].currentFlowRate);
        rerender;
      }
    }
  }
  //--------

  const newratechange = (newText) => {
    setNewrate(newText);
    
    if (
      newText.length > 0 &&
      BigNumber(newText).isNaN() == false &&
      BigNumber(newText).isFinite() == true &&
      BigNumber(newText).gt(BigNumber(0))
    ) {
      setValid(true)
    }
    else if (
      newText.length == 0 ||
      BigNumber(newText).isNaN() == true ||
      BigNumber(newText).isFinite() == false ||
      BigNumber(newText).lte(BigNumber(0))
    ) {
      setValid(false)
    }
    
  };

  async function funcdeleteflow(){
    try {
      if (isDisconnected == false){
        writeContract({
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

  async function updateflow(newrateweips) {
    try {
      if (isDisconnected == false){
        updateflowwrite.writeContract({
          address: '0xcfA132E353cB4E398080B9700609bb008eceB125',
          abi: CFAv1Forwarder,
          functionName: 'updateFlow',
          chainId: celo.id,
          args: [
            '0x3acb9a08697b6db4cd977e8ab42b6f24722e6d6e',
            address == undefined ? "" : address.toLowerCase(),
            route.params.name,
            newrateweips,
            address == undefined ? "" : address.toLowerCase()
          ]
        })
      }
    }
    catch (error) {}
  }

  if (updateflowwrite.isSuccess) {
    //updateflowwrite.data
  }

  return (
    <ScrollView>
      <View style={{ alignItems: 'center', justifyContent: 'space-evenly', height: height0, paddingRight: 5 }}>
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
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}>
            <Elapsed started={route.params.started} inlistview={false}/>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end', justifyContent: 'center'}}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Current Rate:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center'}}>
            {
              queryflow.data.account == null ?
                (<></>)
              : 
                (
                  <Text style={{color: isDarkMode ? Colors.white : "#686C80", marginLeft: 12, fontSize: 15}}>
                    {String(
                      route.params.type === 'outgoing' ?
                        (
                          (BigNumber(queryflow.data.account.outflows[0].currentFlowRate).dividedBy(BigNumber('1000000000000000000'))).times(BigNumber('3600')).toFixed(
                            (BigNumber(queryflow.data.account.outflows[0].currentFlowRate).dividedBy(BigNumber('1000000000000000000'))).times(BigNumber('3600')).decimalPlaces() < 18 ?
                              (BigNumber(queryflow.data.account.outflows[0].currentFlowRate).dividedBy(BigNumber('1000000000000000000'))).times(BigNumber('3600')).decimalPlaces()
                            : 18,
                            BigNumber.ROUND_FLOOR
                          )
                        )
                      :
                        (
                          (BigNumber(queryflow.data.account.inflows[0].currentFlowRate).dividedBy(BigNumber('1000000000000000000'))).times(BigNumber('3600')).toFixed(
                            (BigNumber(queryflow.data.account.inflows[0].currentFlowRate).dividedBy(BigNumber('1000000000000000000'))).times(BigNumber('3600')).decimalPlaces() < 18 ?
                              (BigNumber(queryflow.data.account.inflows[0].currentFlowRate).dividedBy(BigNumber('1000000000000000000'))).times(BigNumber('3600')).decimalPlaces()
                            : 18,
                            BigNumber.ROUND_FLOOR
                          )
                        )
                    )} cUSDx/hr
                  </Text>
                )
            }
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{ width: width0, alignItems: 'flex-end' }}><Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', fontSize: 15}}>Streamed:</Text></View>
          <View style={{ width: width1, alignItems: 'flex-start', justifyContent: 'center' }}>
          {
            queryflow.data.account != null ?
              (
                route.params.type === 'incoming' ?
                  <>
                    {/* <FlowingBalance
                      startingBalance={BigInt(route.params.streameduntilupdatedat)}
                      startingBalanceDate={new Date(route.params.updatedattimestamp * 1000)}
                      flowRate={BigInt(route.params.rate)}/> */}
                    <AmountStreamedTemp
                      rate={queryflow.data.account.inflows[0].currentFlowRate}
                      updatedattimestamp={queryflow.data.account.inflows[0].updatedAtTimestamp}
                      streameduntilupdatedat={queryflow.data.account.inflows[0].streamedUntilUpdatedAt}
                      inlistview={false}/>
                  </>
                :
                  <AmountStreamedTemp
                    rate={queryflow.data.account.outflows[0].currentFlowRate}
                    updatedattimestamp={queryflow.data.account.outflows[0].updatedAtTimestamp}
                    streameduntilupdatedat={queryflow.data.account.outflows[0].streamedUntilUpdatedAt}
                    inlistview={false}/>
              )
            :
              (<></>)
          }
          </View>
        </View>
      </View>
      {
        showdetails == true ?
          <ModificationDetails
            modalVisible={showdetails}
            setModalVisiblefalse={setShowdetails}
            newrate={newrate}/>
        : <></>
      }
      {
        route.params.type === 'outgoing' && modifying == true ?
          <ModifyStream
            label="New Rate"
            value={newrate}
            onchangetext={newratechange}
            setismodifyingfalse={isModifying}
            setnewrateempty={setNewrate}
            setvalidfalse={setValid}
            setshowdetails={setShowdetails}
            keyboardtype="numeric"
            valid={valid}/>
        :
          <></>
      }
      <View style={{ height: height1 }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: width2, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity 
              style={{
                width: width3,
                borderRadius: 15,
                borderWidth: 2,
                borderColor: isDarkMode ? Colors.light : Colors.darker,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                padding: 5
              }}
              onPress={() => Linking.openURL("https://celoscan.io/tx/"+route.params.url)}>
              <Text style={{ color: isDarkMode ? Colors.light : Colors.darker, fontSize: 19, fontWeight: '500' }}>View on Explorer</Text>
              <Octicons name="link-external" size={19} style={{ marginLeft: 5, color: isDarkMode ? Colors.light : Colors.darker }} />
            </TouchableOpacity>
          </View>
          {
            route.params.type === 'outgoing' ?
              (
                <View style={{width: width2, alignItems: 'center', justifyContent: 'center'}}>
                  <TouchableOpacity 
                    style={{
                      width: width3,
                      borderRadius: 15,
                      borderWidth: 2,
                      borderColor: valid == true ? "#15D828" : (isDarkMode ? Colors.light : Colors.darker),
                      opacity: modifying == true ? (valid == true ? 1 : 0.25) : 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      padding: 5
                    }}
                    onPress={() => {
                      if (modifying == false) {
                        isModifying(true)
                      }
                      else if (valid == true) {
                        querybalance.refetch()
                        .then(() => {
                          if (BigNumber(newrate).times(28).lt(BigNumber(querybalance.data).dividedBy(BigNumber('1000000000000000000')))) {
                            var newrateweips = (BigNumber(newrate).times(BigNumber('1000000000000000000'))).dividedBy(3600)
                            updateflow(newrateweips.toFormat(0, BigNumber.ROUND_CEIL, {groupSeparator: ''}));
                          }
                        })
                      }
                    }}
                    disabled={updateflowwrite.isPending}>
                    {
                      updateflowwrite.isPending ?
                        (<ActivityIndicator size={'small'} color={"#15D828"}/>)
                      :
                        (
                          modifying == true ?
                            <Text style={{ color: valid == true ? "#15D828" : (isDarkMode ? Colors.light : Colors.darker), fontSize: 19, fontWeight: '500' }}>Finish</Text>
                          :
                            <>
                              <MaterialIcons name='edit' size={22} color={isDarkMode ? Colors.light : Colors.darker}/>
                              <Text style={{ marginLeft: 5, color: isDarkMode ? Colors.light : Colors.darker, fontSize: 19, fontWeight: '500' }}>Modify</Text>
                            </>
                        )
                    }
                  </TouchableOpacity>
                </View>
              )
            :
              (<></>)
          }
        </View>

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
    </ScrollView>
  );
};
export default SingleStream;
