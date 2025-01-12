import React from 'react';
import {
  View,
  useColorScheme,
  TouchableOpacity,
  Modal,
  Text,
  FlatList
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Timeranges = ({showlist, setshowlistfalse, settimerange}) => {

  const isDarkMode = useColorScheme() === 'dark';
  const modal_swholescreenstyle = {flex: 1, alignItems: 'center', justifyContent: 'center'}
  const modal_sinnerstyle = {
    padding: 10,
    backgroundColor: isDarkMode ? Colors.dark : Colors.lighter,
    width: '80%',
    height: '40%',
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

  let timeranges = ['month (30 days)', 'day', 'hour'];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showlist}
      onRequestClose={() => {
        setshowlistfalse(false);
      }}>
      <View style={modal_swholescreenstyle}>
        <View style={modal_sinnerstyle}>
          <FlatList
            data={timeranges}
            renderItem={({index}) => {
              return(
                <TouchableOpacity
                  style={{paddingHorizontal: 5, paddingVertical: 10, justifyContent: 'flex-start'}}
                  onPress={() => {
                    settimerange(index);
                    setshowlistfalse(false)
                  }}>
                  <Text style={{color: isDarkMode ? Colors.white : Colors.black, fontSize: 20}}>{timeranges[index]}</Text>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default Timeranges;