import { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import { AudioAinsMode } from "react-native-agora";

const AINoiseSuppressionManager = () => {
  const agoraManager = AgoraManager();
  const { agoraEngineRef, joined, remoteUIDs } = agoraManager;
  const [channelName, setChannelName] = useState("");


  useEffect(() => {
    return () => {
        // Release the engine when component unmount.
        agoraManager.destroyEngine();
    };
  }, []);

  const joinChannel = async () => {
    try {
      // Configure an agora engine instance.
      await agoraManager.setupAgoraEngine();
      // Fetch a fresh token from the server
      await agoraManager.fetchRTCToken(channelName);
      // Enable AI Noise suppression.
      agoraEngineRef.current?.setAINSMode(true, AudioAinsMode.AinsModeAggressive);
      // Join the channel.
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

export default AINoiseSuppressionManager;
