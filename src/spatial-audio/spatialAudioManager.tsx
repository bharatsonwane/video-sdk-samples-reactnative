import { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import { RemoteVoicePositionInfo } from 'react-native-agora';
import { Float } from "react-native/Libraries/Types/CodegenTypes";

const useSpatialAudioManager = () => {
  const agoraManager = AgoraManager();
  const { agoraEngineRef, joined, remoteUIDs } = agoraManager;
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    return () => {
      // Release the engine instances when the component unmounts.
      agoraEngineRef.current?.getLocalSpatialAudioEngine().clearRemotePositions();
      agoraEngineRef.current?.getLocalSpatialAudioEngine().release();
      agoraManager.destroyEngine();
    };
  }, []);

  const joinChannel = async () => {
    try {
      await agoraManager.setupAgoraEngine();
      configureSpatialAudioEngine();
      await agoraManager.fetchRTCToken(channelName);
      await agoraManager.joinChannel();
    } catch (error) {
      console.error("Error joining channel:", error);
    }
  };

  const configureSpatialAudioEngine = () => {
    const localSpatialAudioEngine = agoraEngineRef.current?.getLocalSpatialAudioEngine();
    
    localSpatialAudioEngine?.initialize();
    localSpatialAudioEngine?.muteLocalAudioStream(true);
    localSpatialAudioEngine?.muteAllRemoteAudioStreams(true);
    localSpatialAudioEngine?.setAudioRecvRange(50);
    localSpatialAudioEngine?.setDistanceUnit(1);

    // Update self position
    const pos = [0, 0, 0];
    const forward = [1, 0, 0];
    const right = [0, 1, 0];
    const up = [0, 0, 1];
    localSpatialAudioEngine?.updateSelfPosition(pos, forward, right, up);
  };

  const leaveChannel = async () => {
    try {
      await agoraManager.leaveChannel();
      agoraManager.destroyEngine();
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };

  const updateRemoteSpatialAudioPosition = ( sourceDistance: Float) => {
    const { remoteUIDs } = agoraManager;
    if(remoteUIDs.length !== 0)
    {
        const positionInfo = new RemoteVoicePositionInfo();
        positionInfo.position = [sourceDistance, 0.0, 0.0];
        positionInfo.forward = [sourceDistance, 0.0, 0.0];
    
        agoraEngineRef.current
          ?.getLocalSpatialAudioEngine()
          .updateRemotePosition(remoteUIDs[0], positionInfo);
    
        console.log('Remote user spatial position updated:', sourceDistance);
    }
    else {
        console.log("No remote user in the channel");
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
    updateRemoteSpatialAudioPosition
  };
};

export default useSpatialAudioManager;
