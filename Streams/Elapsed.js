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

export default function Elapsed({started, inlistview}) {

  const[difftime, setDifftime] = useState((new Date().getTime()/1000) - started)

  var hour = Math.trunc(((difftime)/3600/24 - Math.trunc((difftime)/3600/24)) * 24);
  var minute = Math.trunc(((((difftime)/3600/24 - Math.trunc((difftime)/3600/24)) * 24) - hour) * 60)
  var sec = Math.trunc(((((((difftime)/3600/24 - Math.trunc((difftime)/3600/24)) * 24) - hour) * 60) - minute) * 60);
  var day = Math.trunc((difftime)/3600/24);
  var elapsed = day+" d "+hour+" h "+minute+" min "+sec+" s"

  useInterval(() => setDifftime((new Date().getTime()/1000) - started), 1000)

  return(
    <>
    {
      inlistview == true ?
        <Text style={{color: '#15D828', fontSize: 14, lineHeight: 18}}>
          {elapsed}
        </Text>
      :
        <Text style={{color: "#15D828" , marginLeft: 12, fontSize: 15}}>{elapsed}</Text>
    }
    </>
  )
};