

import AgoraManager from "../agora-manager/agoraManager";
import { useEffect } from "react";

const GetStartedManager = () => {
  const agoraManager = AgoraManager();


  useEffect(() => {
    return () => {
        // Release the engine when component unmount.
        agoraManager.destroyEngine();
    };
  }, []);

  // Create an instance of the engine and join the channel
  const joinChannel = async () => {
    await agoraManager.setupAgoraEngine();
    await agoraManager.joinChannel();
  };

  // Leave the channel and release the engine instance.
  const leaveChannel = async () => {
    await agoraManager.leaveChannel();
    agoraManager.destroyEngine();

  };

  return (
    {
        leaveChannel,
        joinChannel,
        joined: agoraManager.joined,
        remoteUIDs: agoraManager.remoteUIDs,
        setUserRole: agoraManager.setUserRole
    }
  );
};

export default GetStartedManager;

