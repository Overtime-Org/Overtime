import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';

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

export default function AmountStreamedTemp({rate, updatedattimestamp, streameduntilupdatedat, inlistview}) {

  const[difftime, setDifftime] = useState((new Date().getTime()/1000) - updatedattimestamp)
  const[dp, setDp] = useState(0);

  useInterval(() => setDifftime((new Date().getTime()/1000) - updatedattimestamp), 225)

  let numstreamed = ((Number(rate) * difftime) / 1000000000000000000) + (Number(streameduntilupdatedat) / 1000000000000000000)
  let numstreamedstr = String(numstreamed)
  
  if (String(numstreamed).includes('.') == true) {
    if (String(numstreamed).split('.')[1].length > 18) {
      numstreamedstr =
        String(numstreamed).split('.')[0] +
        '.' +
        String(numstreamed).split('.')[1].substring(0, 18);
    }
    
    if (String(numstreamed).split('.')[1].length < dp){
      numstreamedstr = 
        String(numstreamed).split('.')[0] +
        '.' +
        String(numstreamed).split('.')[1].padEnd(dp, '0')
    }
    
    if (String(numstreamed).split('.')[1].length > dp && String(numstreamed).split('.')[1].length <= 18) {
      setDp(String(numstreamed).split('.')[1].length);
    }
  }

  return(
    <>
    {inlistview == true ?
      <Text style={{color: '#15D828', fontSize: 15}}>{numstreamed.toString().length > 5 ? numstreamed.toString().substring(0, 5)+"..." : numstreamed}</Text>
    :
      <Text style={{color: "#15D828" , fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>{numstreamedstr} cUSDx</Text>}
    </>
  )
};