import React, { useState, useEffect } from 'react';
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

function FloatingLabelInput({label, value, onchangetext, margintop}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isDarkMode = useColorScheme() === 'dark';

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
    borderBottomWidth: 1,
    borderBottomColor: isFocused ? "#15D828" : (isDarkMode ? Colors.light : Colors.dark)
  }
  
  return (
    <View style={{ paddingTop: 18, marginTop: margintop }}>
      <Text style={labelStyle}>
        {label}
      </Text>
      <TextInput
        onChangeText={onchangetext}
        style={textinputstyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
      />
    </View>
  );
}


export default function CreateStream({connectionprop}) {
  const [receiver, setReceiver] = useState('');
  const [rate, setRate] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  const { address } = useAccount()
  useEffect(() => {
    if (address == undefined) {
      connectionprop(true)
    }
  }, [address])

  const receiverChange = (newText) => setReceiver(newText);
  const rateChange = (newText) => setRate(newText);
  const dayChange = (newText) => setDay(newText);
  const monthChange = (newText) => setMonth(newText);
  const yearChange = (newText) => setYear(newText);
  const hourChange = (newText) => setHour(newText);
  const minuteChange = (newText) => setMinute(newText);

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ScrollView style={{ flex: 1, flexDirection: 'column', padding: 30, backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }}>
      <FloatingLabelInput
        label="Address"
        value={receiver}
        onchangetext={receiverChange}
        margintop={18}
      />
      <FloatingLabelInput
        label="Rate (cUSDx/hr)"
        value={rate}
        onchangetext={rateChange}
        margintop={50}
      />
      <Text style={{fontSize: 14, color: isDarkMode ? Colors.light : Colors.dark, marginTop: 50}}>Stop Time:</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{width: '15%', paddingRight: 2}}>
          <FloatingLabelInput
            label="DD"
            value={day}
            onchangetext={dayChange}
          />
        </View>
        <Text style={{fontSize: 20, alignSelf: 'flex-end', color: isDarkMode ? Colors.white : Colors.black}}>/</Text>
        <View style={{width: '15%', paddingHorizontal: 2}}>
          <FloatingLabelInput
            label="MM"
            value={month}
            onchangetext={monthChange}
          />
        </View>
        <Text style={{fontSize: 20, alignSelf: 'flex-end', color: isDarkMode ? Colors.white : Colors.black}}>/</Text>
        <View style={{width: '25%', paddingLeft: 2, paddingRight: 8}}>
          <FloatingLabelInput
            label="YYYY"
            value={year}
            onchangetext={yearChange}
          />
        </View>
        <View style={{width: '15%', paddingLeft: 4, paddingRight: 2}}>
          <FloatingLabelInput
            label="hh"
            value={hour}
            onchangetext={hourChange}
          />
        </View>
        <Text style={{fontSize: 20, alignSelf: 'flex-end', color: isDarkMode ? Colors.white : Colors.black}}>:</Text>
        <View style={{width: '15%', paddingHorizontal: 2}}>
          <FloatingLabelInput
            label="mm"
            value={minute}
            onchangetext={minuteChange}
          />
        </View>
      </View>
      <TouchableOpacity style={{ marginTop: 75, alignSelf: 'center', width: 190, height: 40, backgroundColor: '#15D828', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white', fontSize: 17, fontFamily: 'Inter', fontWeight: '700' }}>STREAM</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}