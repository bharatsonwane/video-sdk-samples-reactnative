import React from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { View, TextInput } from "react-native";
import MediaEncryptionManager from "./mediaEncryptionManager";

const MediaEncryption = () => {
  const mediaEncryptionManager = MediaEncryptionManager();

  return (
    <AgoraUI
      joined={mediaEncryptionManager.joined}
      handleJoinCall={mediaEncryptionManager.join}
      handleLeaveCall={mediaEncryptionManager.leave}
      remoteUids={mediaEncryptionManager.remoteUIDs}
      setUserRole={mediaEncryptionManager.setUserRole}
      additionalContent={
        <View>
          <TextInput
            placeholder="Type a channel name here"
            onChangeText={(text) =>  mediaEncryptionManager.setChannelName(text)}
            style={{
              alignSelf: 'center',
              borderColor: 'white',
              borderWidth: 1,
              height: 30
            }}
            placeholderTextColor={"white"}
          />
        </View>
      }
    />
  );
};

export default MediaEncryption;
