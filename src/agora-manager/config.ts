import {EncryptionMode} from 'react-native-agora'
import { getResourcePath } from '../../utils';
const config: configType = {
    uid: 123,
    appId: "f3b9026ccc2047a4b33fded8beb2845d",
    channelName: "demo",
    token: "",
    serverUrl: "",
    tokenExpiryTime: 60,
    encryptionMode: EncryptionMode.Aes128Gcm2,
    salt: "",
    cipherKey: "",
    product: "",
    audioFilePath: getResourcePath('effect.mp3'),
    soundEffectId: 1,
    soundEffectFilePath: getResourcePath('effect.mp3'),
    logFilePath: "",
    mediaLocation: "https://www.appsloveworld.com/wp-content/uploads/2018/10/640.mp4",
    encryptionBase64: "",
    encryptionKey: "",
    imagePath: getResourcePath('agora.png')
  };
  
  export type configType = {
    uid: number;
    appId: string;
    channelName: string;
    serverUrl: string;
    tokenExpiryTime: number;
    token: string;
    encryptionMode: EncryptionMode;
    salt: string;
    cipherKey: string;
    product: string;
    audioFilePath: string;
    soundEffectId: number;
    soundEffectFilePath: string,
    logFilePath: string,
    mediaLocation: string,
    encryptionBase64: string,
    encryptionKey: string,
    imagePath: string
  };
  
  export default config;