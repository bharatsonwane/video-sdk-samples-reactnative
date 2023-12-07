import React from "react";
import AgoraUI from "../agora-manager/agoraUI";
import GetStartedManager from "./getStartedManager";

const GetStartedSDK = () => {
  const getStartedManager = GetStartedManager();
  return (
    <AgoraUI
      joined={getStartedManager.joined}
      handleJoinCall={getStartedManager.joinChannel}
      handleLeaveCall={getStartedManager.leaveChannel}
      remoteUids={getStartedManager.remoteUIDs}
      setUserRole={getStartedManager.setUserRole}
    />
  );
};

export default GetStartedSDK;

