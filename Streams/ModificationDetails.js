import React from 'react';
import {
  View,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Modal,
  Text,
  Image
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AntDesign } from '@expo/vector-icons';
import '@walletconnect/react-native-compat';
import BigNumber from "bignumber.js";

const ModificationDetails = ({modalVisible, setModalVisiblefalse, newrate}) => {

  const isDarkMode = useColorScheme() === 'dark';
  const modal_swholescreenstyle = {flex: 1, alignItems: 'center', justifyContent: 'center'}
  const modal_sinnerstyle = {
    padding: 10,
    backgroundColor: isDarkMode ? Colors.dark : Colors.lighter,
    width: '80%',
    height: '50%',
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisiblefalse(false);
      }}>
      <View style={modal_swholescreenstyle}>
        <View style={modal_sinnerstyle}>
          <ScrollView>
            <TouchableOpacity
              style={{alignSelf: 'flex-end'}}
              onPress={() => setModalVisiblefalse(false)}>
              <AntDesign name="close" size={25} color={isDarkMode ? Colors.light : Colors.black}/>
            </TouchableOpacity>
            <View style={{marginHorizontal: 25, marginTop: 5, flexDirection: 'row'}}>
              <View style={{width: '50%', alignItems: 'flex-start', justifyContent: 'center'}}>
                <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>
                  Total required: 
                </Text>
              </View>
            </View>
            <View style={{marginHorizontal: 25, flexDirection: 'row'}}>
              <View style={{width: '100%', alignItems: 'flex-start', justifyContent: 'center'}}>
                <Text
                  style={{
                    fontSize: 23,
                    fontWeight: 'bold',
                    color: isDarkMode ? Colors.white : Colors.black
                  }}>
                  {String(BigNumber(newrate).times(28))}
                </Text>
                <Text style={{marginLeft: 3, color: isDarkMode ? Colors.white : Colors.black}}>
                  cUSDx
                </Text>
              </View>
            </View>
            <View style={{marginHorizontal: 25, marginTop: 10, flexDirection: 'row'}}>
              <View style={{width: '50%', alignItems: 'flex-start', justifyContent: 'center'}}>
                <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>
                  Breakdown: 
                </Text>
              </View>
            </View>
            <View style={{marginHorizontal: 25, marginTop: 5, flexDirection: 'row'}}>
              <View style={{width: '10%', alignItems: 'center', justifyContent: 'center'}}>
                <Image
                  source={isDarkMode ? require("./../assets/circle-solid-white.png") : require("./../assets/circle-solid.png")}
                  style={{
                    resizeMode: 'center',
                    width: 8,
                    height: 8
                  }}/>
              </View>
              <View style={{width: '90%', alignItems: 'flex-start', justifyContent: 'center'}}>
                <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>
                  Buffer resets to {String(BigNumber(newrate).times(4))} cUSDx 
                </Text>
              </View>
            </View>
            <View style={{marginHorizontal: 25, marginTop: 5, flexDirection: 'row'}}>
              <View style={{width: '10%', alignItems: 'center', justifyContent: 'center'}}>
                <Image
                  source={isDarkMode ? require("./../assets/circle-solid-white.png") : require("./../assets/circle-solid.png")}
                  style={{
                    resizeMode: 'center',
                    width: 8,
                    height: 8
                  }}/>
              </View>
              <View style={{width: '90%', alignItems: 'flex-start', justifyContent: 'center'}}>
                <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>
                  The stream should last for at least 24 hours after modifying: {String(BigNumber(newrate).times(24))} cUSDx
                </Text>
              </View>
            </View>
            <View style={{marginHorizontal: 25, marginTop: 5, flexDirection: 'row'}}>
              <View style={{width: '10%', alignItems: 'center', justifyContent: 'center'}}>
                <Image
                  source={isDarkMode ? require("./../assets/circle-solid-white.png") : require("./../assets/circle-solid.png")}
                  style={{
                    resizeMode: 'center',
                    width: 8,
                    height: 8
                  }}/>
              </View>
              <View style={{width: '90%', alignItems: 'flex-start', justifyContent: 'center'}}>
                <Text style={{color: isDarkMode ? Colors.white : Colors.black}}>
                  {String(BigNumber(newrate).times(4))} + {String(BigNumber(newrate).times(24))} = {String(BigNumber(newrate).times(28))}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ModificationDetails;