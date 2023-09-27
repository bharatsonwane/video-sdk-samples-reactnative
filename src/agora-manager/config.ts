import {EncryptionMode} from 'react-native-agora'
const config: configType = {
    uid: 0,
    appId: "",
    channelName: "demo",
    token: "",
    serverUrl: "",
    tokenExpiryTime: 600,
    encryptionMode: EncryptionMode.Aes128Gcm2,
    salt: "",
    cipherKey: "",
    product: ""
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
    product: string
  };
  
  export default config;