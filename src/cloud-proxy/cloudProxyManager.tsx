import { useState } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import config from "../agora-manager/config";
import { ChannelProfileType } from "react-native-agora";

const CloudProxyManager = () => {
  const agoraManager = AgoraManager();
  const { agoraEngineRef, joined, remoteUIDs } = agoraManager;
  const [channelName, setChannelName] = useState("");

  const joinChannel = async () => {
    try {
      await setupAgoraEngine();
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

  const setupAgoraEngine = async () => {
    try {
      await agoraManager.setupAgoraEngine();
    
    } catch (error) {
      console.error("Error setting up Agora Engine:", error);
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
