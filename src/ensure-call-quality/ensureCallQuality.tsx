import React, { useState  } from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { View, Text, Button, TextInput } from "react-native";
import CallQualityManager from "./callQualityManager";

const EnsureCallQuality = () => {
  const callQualityManager = CallQualityManager();
  const [isEchoTestRunning, setEchoTestState] = useState(false); // A variable to track the echo test state.
  const [isHighVideoQuality, setVideoQualityState] = useState(false);

  const startAndStopEchoTest = async () => {
    setEchoTestState(!isEchoTestRunning);
    if(isEchoTestRunning)
    {
      callQualityManager.startEchoTest;
    }
    else
    {
      callQualityManager.stopEchoTest();
    }
  };

  const setRemoteStreamQuality = async () =>
  {
    setVideoQualityState(!isHighVideoQuality)
    {
      if(isHighVideoQuality)
      {
        callQualityManager.setHighStreamQuality();
      }
      else
      {
        callQualityManager.setLowStreamQuality();
      }
    }
  }

  return (
    <AgoraUI
      joined={callQualityManager.joined}
      handleJoinCall={callQualityManager.joinChannel}
      handleLeaveCall={callQualityManager.leaveChannel}
      remoteUids={callQualityManager.remoteUIDs}
      setUserRole={callQualityManager.setUserRole}
      additionalContent={
        <View>
          {/* Input field for channel name */}
          <TextInput
            placeholder="Type a channel name here"
            onChangeText={(text) => callQualityManager.setChannelName(text)}
            style={{
              alignSelf: 'center',
              borderColor: 'black', // Set the border color to black
              borderWidth: 1, // Add a border width to make it visible
            }}
          />
          {/* Display network quality */}
          <Text> Network Quality: {callQualityManager.networkQuality}</Text>
          {/* Button to start/stop echo test */}
          <View style={{ padding: 2 }}>
            <Button title={isEchoTestRunning ? "Stop Test" : "Start Echo Test"} onPress={startAndStopEchoTest} />
          </View>
          {/* Button to switch remote stream quality */}
          <View style={{ padding: 2 }}>
            <Button title={isHighVideoQuality ? "Low Video Quality" : "High Video Quality"} onPress={setRemoteStreamQuality} />
          </View>
        </View>
      }
    />
  );
};

export default EnsureCallQuality;
