import React from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { View, Button, TextInput, Image } from "react-native";
import CustomAudioVideoManager from "./customAudioVideoManager";

const CustomAudioVideo = () => {
  const customAudioVideoManager = CustomAudioVideoManager();

  return (
    <AgoraUI
      joined={customAudioVideoManager.joined}
      handleJoinCall={customAudioVideoManager.join}
      handleLeaveCall={customAudioVideoManager.leave}
      remoteUids={customAudioVideoManager.remoteUIDs}
      setUserRole={customAudioVideoManager.setUserRole}
      additionalContent={
        <View>
          <TextInput
            placeholder="Type a channel name here"
            onChangeText={(text) =>  customAudioVideoManager.setChannelName(text)}
            style={{
              alignSelf: 'center',
              borderColor: 'white',
              borderWidth: 1,
              height: 40
            }}
            placeholderTextColor={"white"}
          />
          <View>
            <Button
              title="Push Image"
              onPress={customAudioVideoManager.pushVideoFrame}
            />
          </View>
        </View>
      }
    />
  );
};

export default CustomAudioVideo;
