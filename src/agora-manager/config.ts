import {EncryptionMode} from 'react-native-agora'
import { getResourcePath } from '../../utils';
const config: configType = {
    uid: 0,
    appId: "0cc8ea75bf504ed08d3e8f5ef3c371bf",
    channelName: "demo",
    token: "007eJxTYBB3kGZ0YMndqDZr0cFoV98lM1/kBD5guKRXc1xzf2v2wj4FBoPkZIvURHPTpDRTA5PUFAOLFONUizTT1DTjZGNzw6S0hEt9qQ2BjAz9WbaMjAwQCOKzMKSk5uYzMAAAxuceZA==",
    serverUrl: "",
    tokenExpiryTime: 60,
    encryptionMode: EncryptionMode.Aes128Gcm2,
    salt: "",
    cipherKey: "",
    product: "",
    audioFilePath: getResourcePath('effect.mp3'),
    soundEffectId: 1,
    soundEffectFilePath: getResourcePath('applause-01.mp3'),
    logFilePath: "",
    mediaLocation: "https://www.appsloveworld.com/wp-content/uploads/2018/10/640.mp4",
    encryptionKey: "",
    imagePath: 'agora.png'
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
    product: string | null;
    audioFilePath: string;
    soundEffectId: number;
    soundEffectFilePath: string,
    logFilePath: string,
    mediaLocation: string,
    encryptionKey: string,
    imagePath: string
  };
  
  export default config;