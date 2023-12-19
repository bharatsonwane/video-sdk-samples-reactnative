import React from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { View, Button, TextInput } from "react-native";
import VirtualBackgroundManager from "./virtualBackgroundManager";

const VirtualBackground = () => {
  const {
    joined,
    join,
    leave,
    remoteUIDs,
    setUserRole,
    changeBackground,
    setChannelName
  } = VirtualBackgroundManager();

  return (
    <>
    <AgoraUI
      joined={joined}
      handleJoinCall={join}
      handleLeaveCall={leave}
      remoteUids={remoteUIDs}
      setUserRole={setUserRole}
      additionalContent={
        <View>
          <TextInput
            placeholder="Type a channel name here"
            placeholderTextColor={'white'}
            onChangeText={(text) => setChannelName(text)}
            style={{
              alignSelf: 'center',
              borderColor: 'white',
              borderWidth: 1,
            }}
          />
          <View>
            <Button
              title="Change background"
              onPress={changeBackground}
            />
          </View>
        </View>
      }
    />
    </>
  );
};

export default VirtualBackground;
