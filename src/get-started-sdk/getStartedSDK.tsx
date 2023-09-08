import React, {useEffect, useState} from "react";
import AgoraManager from "../agora-manager/agoraManager";
import AgoraUI from "../agora-manager/agoraUI";
const GetStartedSDK = () => {
  const agoraManager = AgoraManager();
  const [initialized, setInitialized] = useState(false);


  useEffect(() => {
    setupVideoSDKEngine(); // Initialize Agora SDK engine
  }, []);

  // Initialize Agora SDK engine for video
  const setupVideoSDKEngine = async () => {
    if(!initialized)
    {
      await agoraManager.setupVideoSDKEngine();
      setInitialized(true);
    }
    };

  const handleJoinCall = async () => {
    await agoraManager.joinCall();
  };

  const handleLeaveCall = async () => {
    await agoraManager.leaveCall();
  };
  return (
      <AgoraUI
        joined={agoraManager.joined}
        handleJoinCall={handleJoinCall}
        handleLeaveCall={handleLeaveCall}
        remoteUid={agoraManager.remoteUid}
      />
  );
};

export default GetStartedSDK;