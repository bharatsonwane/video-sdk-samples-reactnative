import React, { useState } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import AgoraUI from "../agora-manager/agoraUI";
import config from "../agora-manager/config";
import { View, TextInput } from "react-native";

const AuthenticationWorkflow = () => {
  const agoraManager = AgoraManager();
  const [channelName, setChannelName] = useState("");

  // Create an instance of the engine and join the channel
  const handleJoinCall = async () => {
    if (channelName !== "") {
      await agoraManager.fetchRTCToken(channelName); // Use the provided channelName
    }
    await agoraManager.joinCall();
  };

  // Leave the channel and release the engine instance.
  const handleLeaveCall = async () => {
    await agoraManager.leaveCall();
  };

  return (
    <AgoraUI
      joined={agoraManager.joined}
      handleJoinCall={handleJoinCall}
      handleLeaveCall={handleLeaveCall}
      remoteUids={agoraManager.remoteUids}
      setUserRole={agoraManager.setUserRole}
      additionalContent={
        <View>
        <TextInput
            placeholder="Type a channel name here"
            value={channelName}
            onChangeText={(text) => setChannelName(text)}
            style={{
                alignSelf: 'center',
                borderColor: 'black', // Set the border color to black
                borderWidth: 1, // Add a border width to make it visible
            }}
            />
        </View>
      }
    />
  );
};

export default AuthenticationWorkflow;
