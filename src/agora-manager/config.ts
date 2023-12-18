import {EncryptionMode} from 'react-native-agora'
import { getResourcePath } from '../../utils';
const config: configType = {
    uid: 0,
    appId: "0cc8ea75bf504ed08d3e8f5ef3c371bf",
    channelName: "demo",
    token: "007eJxTYLifHsanl8q+kGFf4anrLuIa/HULwtZN6w/59Way4+YkjbMKDAbJyRapieamSWmmBiapKQYWKcapFmmmqWnGycbmhklpZ07XpTYEMjIkPXNgYIRCEJ+FISU1N5+BAQAfsx+/",
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
    encryptionBase64: "34QjNhcEkE/b2fiwT8q/0Se10VVnESdQQcuQLxRV1BY=",
    encryptionKey: "3e9ab0cbe8b1f6ac4a1e9e370169cd7ff8484e6536c26b710c234cfff8896099"
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
    encryptionKey: string
  };
  
  export default config;