import React, { useEffect, useState } from 'react';
import { Text, View, useColorScheme, Dimensions, TouchableOpacity, Linking } from "react-native";
import { useNavigation } from '@react-navigation/native'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Octicons } from '@expo/vector-icons';
import '@walletconnect/react-native-compat'
import { useAccount, useWriteContract } from 'wagmi'
import {celo} from 'viem/chains'
import FlowingBalance from './FlowingBalance';
import Elapsed from './Elapsed';
import AmountStreamedTemp from './AmountStreamedTemp';
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

const SingleStream = ({route, connectionprop}) => {
  const [deleting, isDeleting] = useState(false);
  const [stylestate, setStylestate] = useState('outline');
  const [currentraterender, setCurrentraterender] = useState(BigInt(0));

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

  const navigation = useNavigation();

  useEffect(() => {
    if (isSuccess == true) {
      isDeleting(false);
      navigation.goBack();
    }
  }, [isSuccess])

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
                  <Text style={{color: isDarkMode ? Colors.white : "#686C80", fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>
                    {String(
                      route.params.type === 'outgoing' ?
                        ((BigNumber(queryflow.data.account.outflows[0].currentFlowRate).dividedBy(BigNumber('1000000000000000000'))).times(BigNumber('3600')))
                      : ((BigNumber(queryflow.data.account.inflows[0].currentFlowRate).dividedBy(BigNumber('1000000000000000000'))).times(BigNumber('3600')))
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
