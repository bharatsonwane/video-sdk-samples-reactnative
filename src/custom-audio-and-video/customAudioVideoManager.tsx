import { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import ImagePicker, { ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker'; // Import the library
import {
  ExternalVideoSourceType,
  VideoBufferType,
  VideoPixelFormat,
  IRtcEngineEx,
  createAgoraRtcEngine,
  ChannelProfileType,
  AreaCode
} from "react-native-agora";
import config from "../agora-manager/config";
import { Alert } from "react-native";

const CustomAudioVideoManager = () => {
  const agoraManager = AgoraManager();
  const { agoraEngineRef, joined, remoteUIDs } = agoraManager;
  const [channelName, setChannelName] = useState("");
  const [selectedImageUri, setImageUri] = useState<string | undefined>("");

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
    if (!config.imagePath) {
      console.error('filePath is invalid');
      return;
    }

    // Use react-native-image-picker to pick an image from the library
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };

    ImagePicker.launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log(`ImagePicker Error: ${response.errorCode}, ${response.errorMessage}`);
      } else {
        // Use the selected image for further processing
        setImageUri(response.assets?.[0].uri);
        if (selectedImageUri) {
          // Convert the image to Uint8Array
          fetch(selectedImageUri)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
              const uint8Array = new Uint8Array(buffer);
              agoraEngineRef.current?.getMediaEngine().pushVideoFrame({
                type: VideoBufferType.VideoBufferRawData,
                format: VideoPixelFormat.VideoPixelRgba,
                buffer: uint8Array,
                stride: response.assets?.[0].width || 0,
                height: response.assets?.[0].height || 0,
              });
            })
            .catch((error) => {
              console.error('Error converting image to Uint8Array:', error);
            });
        } else {
          console.error('Selected image URI is undefined');
        }
      }
    });
  };


  const setupAgoraEngine = async () => {
    agoraEngineRef.current = createAgoraRtcEngine() as IRtcEngineEx;

    const channelProfile =
      config.product !== "ILS"
        ? ChannelProfileType.ChannelProfileLiveBroadcasting
        : ChannelProfileType.ChannelProfileCommunication;

    if (config.appId === "") {
      Alert.prompt("Please specify a valid app ID to initialize the engine instance");
      return;
    }

    agoraEngineRef.current.initialize({
      appId: config.appId,
      channelProfile: channelProfile,
      areaCode: AreaCode.AreaCodeAs
    });

    agoraEngineRef.current.enableVideo();
    console.log('Engine initialized');
  };

  const joinChannel = async () => {
    try {
      await setupAgoraEngine();
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
    selectedImageUri
  };
};

export default CustomAudioVideoManager;
