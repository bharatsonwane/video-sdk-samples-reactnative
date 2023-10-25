import React from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { TextInput, View } from "react-native";
import AuthenticationWorkflowManager from "./authenticationWorkflowManager";


const AuthenticationWorkflow = () => {
  const authenticationWorkflowManager = AuthenticationWorkflowManager();

  return (
    <AgoraUI
      joined={authenticationWorkflowManager.joined}
      handleJoinCall={authenticationWorkflowManager.joinChannel}
      handleLeaveCall={authenticationWorkflowManager.leaveChannel}
      remoteUids={authenticationWorkflowManager.remoteUIDs}
      setUserRole={authenticationWorkflowManager.setUserRole}
      additionalContent={
        <View>
          <TextInput
            placeholder="Type a channel name here"
            onChangeText={(text) => authenticationWorkflowManager.setChannelName(text)}
            style={{
              alignSelf: "center",
              borderColor: "black",
              borderWidth: 1,
              marginBottom: 10,
              padding: 5,
            }}
          />
        </View>
      }
    />
  );
};

export default AuthenticationWorkflow;
