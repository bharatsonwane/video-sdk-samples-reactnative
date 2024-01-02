import React from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { View, TextInput, Button } from "react-native";
import RawAudioAndVideoManager from "./rawAudioAndVideoManager";

const RawAudioAndVideo = () => {
  const rawAudioAndVideoManager = RawAudioAndVideoManager();

  return (
    <AgoraUI
      joined={rawAudioAndVideoManager.joined}
      handleJoinCall={rawAudioAndVideoManager.join}
      handleLeaveCall={rawAudioAndVideoManager.leave}
      remoteUids={rawAudioAndVideoManager.remoteUIDs}
      setUserRole={rawAudioAndVideoManager.setUserRole}
      additionalContent={
        <View>
          <TextInput
            placeholder="Type a channel name here"
            onChangeText={(text) =>  rawAudioAndVideoManager.setChannelName(text)}
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
              title={rawAudioAndVideoManager.isCropping ? "Zoom Out": "Zoom In"}
              onPress={rawAudioAndVideoManager.toggleCropping}
            />
          </View>
        </View>
      }
    />
  );
};

export default RawAudioAndVideo;
