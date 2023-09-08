import {EncryptionMode} from 'react-native-agora'
const config: configType = {
    uid: 0,
    appId: "",
    channelName: "",
    rtcToken: "",
    serverUrl: "",
    tokenExpiryTime: 600,
    token: "",
    encryptionMode: EncryptionMode.Aes128Gcm2,
    salt: "",
    cipherKey: "",
  };
  
  export type configType = {
    uid: number;
    appId: string;
    channelName: string;
    rtcToken: string | null;
    serverUrl: string;
    tokenExpiryTime: number;
    token: string;
    encryptionMode: EncryptionMode;
    salt: string;
    cipherKey: string;
  };
  
  export default config;