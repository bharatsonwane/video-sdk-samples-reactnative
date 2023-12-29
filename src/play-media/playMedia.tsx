import React, {useEffect, useState} from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { View, Button, TextInput } from "react-native";
import PlayMediaManager from "./playMediaManager";
import { RtcSurfaceView, VideoSourceType, MediaPlayerState, VideoViewSetupMode } from "react-native-agora";

const PlayMedia = () => {
  const [playMediaBtnTxt, setMediaBtnTxt] = useState("Play Media");
  const {
    joined,
    joinChannel,
    leaveChannel,
    remoteUIDs,
    setUserRole,
    setChannelName,
    isPlaying,
    playMedia,
    mediaPlayerRef,
    mediaPlayerState
  } = PlayMediaManager();

  useEffect(() => {
    if (mediaPlayerState === MediaPlayerState.PlayerStatePlaying) {
        setMediaBtnTxt("Pause Player");
    } 
    else if (mediaPlayerState === MediaPlayerState.PlayerStatePaused) {
        setMediaBtnTxt("Resume Player");
    }
    else if(mediaPlayerState === MediaPlayerState.PlayerStateOpening) {
        setMediaBtnTxt("Opening Media File...");
    }
    else {
        setMediaBtnTxt("Open Media File");
    }
  }, [mediaPlayerState]);

  return (
    <>
    <AgoraUI
      joined={joined}
      handleJoinCall={joinChannel}
      handleLeaveCall={leaveChannel}
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
          <View>
            <Button
              title={playMediaBtnTxt}
              onPress={playMedia}
            />
          </View>
        </View>
      }
    />
    <View style = {{padding: 10}}>
    {isPlaying && (
        <RtcSurfaceView
            style={{ width: '100%', height: 200,  }}
            canvas={{
                uid: mediaPlayerRef.current?.getMediaPlayerId(),
                sourceType: VideoSourceType.VideoSourceMediaPlayer,
                setupMode:  VideoViewSetupMode.VideoViewSetupAdd,
                mediaPlayerId: mediaPlayerRef.current?.getMediaPlayerId()
            }}
        />
    )}
    </View>
    </>
  );
};

export default PlayMedia;
