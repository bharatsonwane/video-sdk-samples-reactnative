import {EncryptionMode} from 'react-native-agora'
import { getImagePath, getResourcePath } from '../../utils';
const config: configType = {
    uid: 0,
    appId: "0cc8ea75bf504ed08d3e8f5ef3c371bf",
    channelName: "demo",
    token: "007eJxTYHhfUBxhMo1tRtRrk4Wb4w/3v9XeX8S17v6bR20vrn3hKUlTYDBITrZITTQ3TUozNTBJTTGwSDFOtUgzTU0zTjY2N0xKq3SYmdoQyMjwj6OPmZEBAkF8FoaU1Nx8BgYAFnwiQQ==",
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
    imagePath: getImagePath('background.jpeg'),
    destChannelName : '',
    destChannelToken : '',
    destUid : 100,
    secondChannelToken: "007eJxTYJjzuLdvQUqTVvbRhZ/KbjeKZJ/T1bGdsG6jiIJuxIUOrTQFBoPkZIvURHPTpDRTA5PUFAOLFONUizTT1DTjZGNzw6S0kAPTUxsCGRlUfoYzMEIhiM/CkJKam8/AAABz5h/t",
    secondChannelUid: 100,
    secondChannelName: "demo"
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
    imagePath: string,
    destChannelName: string,
    destChannelToken: string,
    destUid: 100,
    secondChannelToken: string,
    secondChannelUid: number,
    secondChannelName: string
  };
  
  export default config;