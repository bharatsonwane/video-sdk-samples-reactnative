import React, { useState } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import AgoraUI from "../agora-manager/agoraUI";
import { TextInput, View, alert } from "react-native"; // Removed Button import

const AuthenticationWorkflow = () => {
  const agoraManager = AgoraManager();
  const [channelName, setChannelName] = useState("");

  // Function to handle joining the call
  const handleJoinCall = async () => {
    if (channelName.trim() === "") {
      alert("Please enter a valid channel name.");
      return;
    }
    try {
      await agoraManager.fetchRTCToken(channelName);
      await agoraManager.joinCall();
    } catch (error) {
      console.error("Error joining the call:", error);
      alert("An error occurred while joining the call.");
    }
  };

  // Function to handle leaving the call
  const handleLeaveCall = async () => {
    try {
      await agoraManager.leaveCall();
    } catch (error) {
      console.error("Error leaving the call:", error);
    }
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
