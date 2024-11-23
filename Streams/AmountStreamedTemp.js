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

  useInterval(() => setDifftime((new Date().getTime()/1000) - updatedattimestamp), 250)

  let numstreamed = ((Number(rate) * difftime) / 1000000000000000000) + (Number(streameduntilupdatedat) / 1000000000000000000)

  return(
    <>
    {inlistview == true ?
      <Text style={{color: '#15D828', fontSize: 15}}>{numstreamed.toString().length > 5 ? numstreamed.toString().substring(0, 5)+"..." : numstreamed}</Text>
    :
      <Text style={{color: "#15D828" , fontFamily: 'Rubik', marginLeft: 12, fontSize: 15}}>{numstreamed} cUSDx</Text>}
    </>
  )
};