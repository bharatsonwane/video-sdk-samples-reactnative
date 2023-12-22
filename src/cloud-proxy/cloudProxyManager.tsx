import { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import { CloudProxyType, ProxyType } from "react-native-agora";

const CloudProxyManager = () => {
  const agoraManager = AgoraManager();
  const { agoraEngineRef, joined, remoteUIDs } = agoraManager;
  const [channelName, setChannelName] = useState("");


  useEffect(() => {
    return () => {
        // Release the engine when component unmount.
        agoraManager.destroyEngine();
    };
  }, []);

  const enableCloudProxy = async () => {
    agoraEngineRef.current?.setCloudProxy(CloudProxyType.UdpProxy);
    agoraEngineRef.current?.registerEventHandler({
      onConnectionStateChanged(connection, state, reason) {
        if (reason === 0) {
        console.log('The SDK is connecting to the Agora edge server');
        }
      },
      onProxyConnected(
        channel: string,
        uid: number,
        proxyType: ProxyType,
        localProxyIp: string,
        elapsed: number)
      {
        console.log("Proxy server connected.");
      }
    });
  };
  const joinChannel = async () => {
    try {
      await agoraManager.setupAgoraEngine();
      await enableCloudProxy();
      await agoraManager.fetchRTCToken(channelName);
      await agoraManager.joinChannel();
    } catch (error) {
      console.error("Error joining channel:", error);
    }
  };

  const leaveChannel = async () => {
    try {
      await agoraManager.leaveChannel();
      agoraManager.destroyEngine();
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };

  return {
    agoraEngineRef,
    join: joinChannel,
    leave: leaveChannel,
    joined,
    fetchRTCToken: agoraManager.fetchRTCToken,
    remoteUIDs,
    setUserRole: agoraManager.setUserRole,
    setChannelName,
  };
};

export default CloudProxyManager;
