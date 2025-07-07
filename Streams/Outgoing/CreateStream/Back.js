import { TouchableOpacity, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function Back() {
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" style={{ marginLeft: 11, color: isDarkMode ? Colors.white : Colors.black }} size={24} />
    </TouchableOpacity>
  )
}