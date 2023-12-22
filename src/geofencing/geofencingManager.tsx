import { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import { AreaCode } from "react-native-agora";

const GeofencingManager = () => {
    const agoraManager = AgoraManager();
    const { agoraEngineRef, joined, remoteUIDs, setAgoraRegion } = agoraManager;
    const [channelName, setChannelName] = useState("");


    useEffect(() => {
      return () => {
          // Release the engine when component unmount.
          agoraManager.destroyEngine();
      };
    }, []);
  
    const joinChannel = async () => {
      try {
        setAgoraRegion(AreaCode.AreaCodeAs);
        await agoraManager.setupAgoraEngine();
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
  
  export default GeofencingManager;
  
