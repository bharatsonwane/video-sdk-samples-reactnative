import React, { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import AgoraUI from "../agora-manager/agoraUI";
import { TextInput, View, Alert } from "react-native";
import { RtcConnection } from "react-native-agora";
import config from "../agora-manager/config";

const AuthenticationWorkflow = () => {
  const agoraManager = AgoraManager();
  const [channelName, setChannelName] = useState("");

  // Function to set up the video SDK engine
  const setupVideoSDKEngine = async () => {
    await agoraManager.setupAgoraEngine();

    // Register event handler
    agoraManager.agoraEngineRef.current?.registerEventHandler({
      onTokenPrivilegeWillExpire: onTokenPrivilegeWillExpire,
      // Add more event handlers as needed
    });
  };

  // Event handler for token privilege expiration
  const onTokenPrivilegeWillExpire = (connection: RtcConnection, token: string) => {
    agoraManager.fetchRTCToken(channelName);
    agoraManager.agoraEngineRef.current?.renewToken(config.token);
  };

  // Function to handle joining the call
  const handleJoinCall = async () => {
    if (channelName.trim() === "") {
      Alert.alert("Please enter a valid channel name.");
      return;
    }
    try {
      await agoraManager.fetchRTCToken(channelName);
      await agoraManager.joinCall();
    } catch (error) {
      console.error("Error joining the call:", error);
      Alert.alert("An error occurred while joining the call.");
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

  // Initialize the video SDK engine when the component mounts
  useEffect(() => {
    setupVideoSDKEngine();
  }, []); // Run only on component mount

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
