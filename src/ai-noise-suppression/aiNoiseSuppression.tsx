import React from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { View, TextInput } from "react-native";
import AINoiseSuppressionManager from "./aiNoiseSuppressionManager";

const AINoiseSuppression = () => {
  const cloudProxyManager = AINoiseSuppressionManager();

  return (
    <AgoraUI
      joined={cloudProxyManager.joined}
      handleJoinCall={cloudProxyManager.join}
      handleLeaveCall={cloudProxyManager.leave}
      remoteUids={cloudProxyManager.remoteUIDs}
      setUserRole={cloudProxyManager.setUserRole}
      additionalContent={
        <View>
          <TextInput
            placeholder="Type a channel name here"
            onChangeText={(text) =>  cloudProxyManager.setChannelName(text)}
            style={{
              alignSelf: 'center',
              borderColor: 'white',
              borderWidth: 1,
              height: 40
            }}
            placeholderTextColor={"white"}
          />
        </View>
      }
    />
  );
};

export default AINoiseSuppression;
