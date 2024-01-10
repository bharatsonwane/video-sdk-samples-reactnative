import { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import {
  ExternalVideoSourceType,
  VideoBufferType,
  VideoPixelFormat,
} from "react-native-agora";
import config from "../agora-manager/config";
import ImageTools from "react-native-image-tool"
import { Alert } from "react-native";


const CustomAudioVideoManager = () => {
  const agoraManager = AgoraManager();
  const { agoraEngineRef, joined, remoteUIDs } = agoraManager;
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    return () => {
      // Release the engine when the component unmount.
      agoraManager.destroyEngine();
    };
  }, []);

  const setExternalVideoSource = () => {
    agoraEngineRef.current
      ?.getMediaEngine()
      .setExternalVideoSource(true, false, ExternalVideoSourceType.VideoFrame);
  };

  const pushVideoFrame = () => {
    if (!agoraManager.joined) {
      Alert.alert('Join a channel first to push the image');
      return;
    }
      ImageTools.GetImageRGBAs(config.imagePath).then((value: any) => {
        console.log(value);
        agoraEngineRef.current?.getMediaEngine().pushVideoFrame({
          type: VideoBufferType.VideoBufferRawData,
          format: VideoPixelFormat.VideoPixelRgba,
          buffer: value.rgba,
          stride: value.width,
          height: value.height,
        });
      });
    };

  const joinChannel = async () => {
    try {
      await agoraManager.setupAgoraEngine();
      setExternalVideoSource();
      await agoraManager.fetchRTCToken(channelName);
      await agoraManager.joinChannel();
    } catch (error) {
      console.error("Error joining channel:", error);
    }
  };

  const leaveChannel = async () => {
    try {
      await agoraManager.leaveChannel();
      agoraManager.destroyEngine();
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };

  return {
    agoraEngineRef,
    join: joinChannel,
    leave: leaveChannel,
    joined,
    fetchRTCToken: agoraManager.fetchRTCToken,
    remoteUIDs,
    setUserRole: agoraManager.setUserRole,
    setChannelName,
    pushVideoFrame,
  };
};

export default CustomAudioVideoManager;