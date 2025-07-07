import { useEffect } from "react";
import { BackHandler } from "react-native";
import { CameraView } from "expo-camera";

export default function QR({funcscanneddata, setqrviewfalse}) {
  useEffect(() => {
    const backAction = () => {
      setqrviewfalse(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  async function scancomplete(scanneddata) {
    await funcscanneddata(scanneddata).then(() => setqrviewfalse(false));
  }

  return(
    <CameraView
      style={{flex: 1}}
      barcodeScannerSettings={{barcodeTypes: ['qr']}}
      videoQuality="2160p"
      onBarcodeScanned={(scanningResult) => {
        scancomplete(scanningResult.data);
      }}>
    </CameraView>
  )
}