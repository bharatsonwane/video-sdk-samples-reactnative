import React, { useState } from "react";
import AgoraUI from "../agora-manager/agoraUI";
import Slider from "@react-native-community/slider"; // Correct import
import { View, TextInput } from "react-native";
import SpatialAudioManager from "./spatialAudioManager";

const SpatialAudio = () => {
  const {
    joined,
    join,
    leave,
    remoteUIDs,
    setUserRole,
    setChannelName,
    updateRemoteSpatialAudioPosition
  } = SpatialAudioManager();

  const [distanceUnit, setDistanceUnit] = useState(50); // Initial value for the audio range

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
                height: 40
              }}
            />
            <Slider
              style={{ width: 200, marginTop: 20, alignSelf: 'center' }}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={distanceUnit}
              onValueChange={(sourceDistance: number) => updateRemoteSpatialAudioPosition(sourceDistance)}
            />
          </View>
        }
      />
    </>
  );
};

export default SpatialAudio;
