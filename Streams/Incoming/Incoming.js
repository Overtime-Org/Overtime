import React, {useMemo, useState, useEffect} from 'react';
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAccount } from 'wagmi'
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from 'ethers';
import {celo} from 'viem/chains';
import { Framework } from '@superfluid-finance/sdk-core';

export default function Incoming() {
  const [incoming, setIncoming] = useState([]);
  const [rerender, setRerender] = useState(false);
  useEffect(() => {
    if (rerender == false) {
      flowsinfo();
    }
  }, []);
  const navigation = useNavigation();

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const { address, connector } = useAccount()
  const provider = address == undefined ? undefined : connector._provider;
  const web3Provider = useMemo(
    () =>
        provider ? new ethers.providers.Web3Provider(provider, celo.id) : undefined,
    [provider]
  );

  async function flowsinfo(){
    try {
      if (provider != undefined){
        const sf = await Framework.create({
          chainId: Number(celo.id),
          provider: web3Provider
        });
        await sf.loadSuperToken("cUSDx");
        
        let pageresults = await sf.query.listStreams(
          {receiver: address, token: "0x3AcB9A08697b6Db4cD977e8Ab42b6f24722e6D6e"},
          {skip: 0, take: 30},
          {orderBy: "createdAtTimestamp", orderDirection: "desc"}
        );
        
        for (let i = 0; i < pageresults.items.length; i++) {
          let elapsed = (new Date().getTime()/1000) - pageresults.items[i].createdAtTimestamp
          let difftime = (new Date().getTime()/1000) - pageresults.items[i].updatedAtTimestamp
          let numstreamed = ((Number(pageresults.items[i].currentFlowRate) * difftime) / 1000000000000000000) + (Number(pageresults.items[i].streamedUntilUpdatedAt) / 1000000000000000000)
          
          if (Number(pageresults.items[i].currentFlowRate) > 0){
            incoming.push({
              name: pageresults.items[i].sender,
              streamed: numstreamed,
              elapsed: elapsed/3600,
              started: pageresults.items[i].createdAtTimestamp,
              rate: pageresults.items[i].currentFlowRate,
              url: pageresults.items[i].flowUpdatedEvents[0].transactionHash,
              streameduntilupdatedat: pageresults.items[i].streamedUntilUpdatedAt,
              updatedattimestamp: pageresults.items[i].updatedAtTimestamp
            });
          }
          
          if (i + 1 == pageresults.items.length){
            if (pageresults.nextPaging != undefined) {
              funcnextpage(sf, pageresults.nextPaging)
            }
            else{
              setRerender(true);
            }
          }
        }
      }
      
    }
    catch (error) {}
  }

  async function funcnextpage(sf, nextpage) {
    let pageresults = await sf.query.listStreams(
      {receiver: address, token: "0x3AcB9A08697b6Db4cD977e8Ab42b6f24722e6D6e"},
      nextpage,
      {orderBy: "createdAtTimestamp", orderDirection: "desc"}
    );
    
    for (let i = 0; i < pageresults.items.length; i++) {
      let elapsed = (new Date().getTime()/1000) - pageresults.items[i].createdAtTimestamp
      let difftime = (new Date().getTime()/1000) - pageresults.items[i].updatedAtTimestamp
      let numstreamed = ((Number(pageresults.items[i].currentFlowRate) * difftime) / 1000000000000000000) + (Number(pageresults.items[i].streamedUntilUpdatedAt) / 1000000000000000000)
      
      if (Number(pageresults.items[i].currentFlowRate) > 0){
        incoming.push({
          name: pageresults.items[i].sender,
          streamed: numstreamed,
          elapsed: elapsed/3600,
          started: pageresults.items[i].createdAtTimestamp,
          rate: pageresults.items[i].currentFlowRate,
          url: pageresults.items[i].flowUpdatedEvents[0].transactionHash,
          streameduntilupdatedat: pageresults.items[i].streamedUntilUpdatedAt,
          updatedattimestamp: pageresults.items[i].updatedAtTimestamp
        });
      }
      
      if (i + 1 == pageresults.items.length) {
        if (pageresults.nextPaging != undefined) {
          funcnextpage(sf, pageresults.nextPaging)
        }
        else{
          setRerender(true);
        }
      }
    }
    
  }

  return (
    <>
    <FlatList
      data={incoming}
      renderItem={({item}) => {
        let namedisplay = item.name.startsWith("0x") ? item.name.substring(0, 6)+"..."+item.name.substring(38) : item.name
        return(
          <TouchableOpacity
            style={{
                paddingVertical: 18,
                flexDirection: 'row',
                flex: 3,
                alignItems: 'center'
              }}
            onPress={() => {
              navigation.navigate('SingleStream', {type: 'incoming', name: item.name, elapsed: item.elapsed, streamed: item.streamed, rate: item.rate, started: item.started, url: item.url, streameduntilupdatedat: item.streameduntilupdatedat, updatedattimestamp: item.updatedattimestamp})
            }}>
            <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{width: 48, height: 48, backgroundColor: '#E7E7E7', borderRadius: 32, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#989CB0', fontSize: 24, fontFamily: 'Rubik', fontWeight: '600'}}>{item.name.charAt(0)}</Text>
              </View>
            </View>
            <View style={{flex: 1.3, flexDirection: 'column'}}>
              <Text style={{color: isDarkMode ? Colors.white : "#686C80", fontSize: 18, fontFamily: 'Rubik', fontWeight: '400', lineHeight: 26}}>{namedisplay}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: '#15D828', fontSize: 14, fontFamily: 'Rubik', fontWeight: '300', lineHeight: 18}}>{item.elapsed.toString().length > 5 ? item.elapsed.toString().substring(0, 5)+"..." : item.elapsed} hr(s)</Text>
              </View>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#15D828', fontSize: 15, fontFamily: 'Rubik', fontWeight: '500'}}>{item.streamed.toString().length > 5 ? item.streamed.toString().substring(0, 5)+"..." : item.streamed}</Text>
              <Text style={{color: isDarkMode ? Colors.white : "#686C80", fontSize: 15, fontFamily: 'Rubik', fontWeight: '500'}}>cUSDx</Text>
            </View>
          </TouchableOpacity>
        )
      }}
      ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ececec'}}></View>}
      ListFooterComponent={() => <View style={{ height: 75}}/>}
      style={backgroundStyle}/>
      <TouchableOpacity 
        style={{
          bottom: 44,
          right: 32,
          padding: 10,
          borderRadius: 15,
          position: 'absolute',
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: '#15D828',
          elevation: 10
        }}
        onPress={() => navigation.navigate('Unwrap')}>
        <Text style={{color: 'white', fontSize: 17}}>Retrieve</Text>
      </TouchableOpacity>
    </>
  );
};