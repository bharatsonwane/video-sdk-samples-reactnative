import React from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { View, TextInput } from "react-native";
import GeofencingManager from "./geofencingManager";

const Geofencing = () => {
  const geofencingManager = GeofencingManager();

  return (
    <AgoraUI
      joined={geofencingManager.joined}
      handleJoinCall={geofencingManager.join}
      handleLeaveCall={geofencingManager.leave}
      remoteUids={geofencingManager.remoteUIDs}
      setUserRole={geofencingManager.setUserRole}
      additionalContent={
        <View>
          <TextInput
            placeholder="Type a channel name here"
            onChangeText={(text) =>  geofencingManager.setChannelName(text)}
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

export default Geofencing;
