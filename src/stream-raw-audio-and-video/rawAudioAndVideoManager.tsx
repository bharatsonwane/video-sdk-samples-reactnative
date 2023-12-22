import { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import {
  RawAudioFrameOpModeType,
  AudioFrame,
  VideoFrame,
  VideoPixelFormat,
  VideoSourceType,
} from "react-native-agora";

// Constants for audio frame configuration
const SAMPLE_RATE = 16000;
const SAMPLE_NUM_OF_CHANNEL = 1;
const SAMPLES_PER_CALL = 1024;

// Audio frame observer configuration
const iAudioFrameObserver = {
  onPlaybackAudioFrameBeforeMixing: (channelId: string, uID: number, audioFrame: AudioFrame) => {
    console.log(channelId, uID, audioFrame);
    return true;
  },
};

// Video frame observer configuration
const iVideoFrameObserver = {
  onCaptureVideoFrame: (sourceType: VideoSourceType, videoFrame: VideoFrame) => {
    console.log(videoFrame);

    // Example: Cropping the video frame by removing the top 100 pixels
    const croppedVideoFrame = cropVideoFrame(videoFrame, 0, 100);

    // Continue processing or rendering with the croppedVideoFrame

    return true;
  },
  onPreEncodeVideoFrame: (sourceType:VideoSourceType, videoFrame: VideoFrame) => {
    console.log(videoFrame);
    return false;
  },
  onScreenCaptureVideoFrame: (videoFrame: VideoFrame) => {
    console.log(videoFrame);
    return false;
  },
  onPreEncodeScreenVideoFrame: (videoFrame: VideoFrame) => {
    console.log(videoFrame);
    return false;
  },
  onMediaPlayerVideoFrame: (videoFrame: VideoFrame, id: number) => {
    console.log(id, videoFrame);
    return false;
  },
  onRenderVideoFrame: (channelID: string, remoteUid: number, videoFrame: VideoFrame) => {
    console.log(channelID, remoteUid, videoFrame);
    return false;
  },
};

const cropVideoFrame = (videoFrame: VideoFrame, cropTop: number, cropBottom: number) => {
    const { width, height, rotation, yBuffer, uBuffer, vBuffer } = videoFrame;
  
    if (width === undefined || height === undefined || yBuffer === undefined || uBuffer === undefined || vBuffer === undefined) {
      // Handle the case where essential properties are undefined
      console.error("Invalid video frame properties");
      return null; // or provide a default value
    }
  
    const croppedHeight = height - cropTop - cropBottom;
    const croppedYBuffer = new Uint8Array(croppedHeight * width);
    const croppedUBuffer = new Uint8Array(croppedHeight / 2 * width / 2);
    const croppedVBuffer = new Uint8Array(croppedHeight / 2 * width / 2);
  
    // Copy the cropped portion of the Y buffer
    for (let y = cropTop; y < height - cropBottom; y++) {
      const srcOffset = y * width;
      const destOffset = (y - cropTop) * width;
      croppedYBuffer.set(yBuffer.subarray(srcOffset, srcOffset + width), destOffset);
    }
  
    // Copy the cropped portion of the U buffer
    for (let y = cropTop / 2; y < (height - cropBottom) / 2; y++) {
      const srcOffset = y * width / 2;
      const destOffset = (y - cropTop / 2) * width / 2;
      croppedUBuffer.set(uBuffer.subarray(srcOffset, srcOffset + width / 2), destOffset);
    }
  
    // Copy the cropped portion of the V buffer
    for (let y = cropTop / 2; y < (height - cropBottom) / 2; y++) {
      const srcOffset = y * width / 2;
      const destOffset = (y - cropTop / 2) * width / 2;
      croppedVBuffer.set(vBuffer.subarray(srcOffset, srcOffset + width / 2), destOffset);
    }
  
    return {
      width,
      height: croppedHeight,
      rotation,
      yBuffer: croppedYBuffer,
      uBuffer: croppedUBuffer,
      vBuffer: croppedVBuffer,
    };
  };
  
const RawAudioAndVideoManager = () => {
  // Initialize Agora manager
  const agoraManager = AgoraManager();
  const { agoraEngineRef, joined, remoteUIDs } = agoraManager;
  const [channelName, setChannelName] = useState("");

  // Cleanup function for unmounting
  useEffect(() => {
    return () => {
      agoraEngineRef.current?.getMediaEngine().unregisterVideoFrameObserver(iVideoFrameObserver);
      agoraEngineRef.current?.getMediaEngine().unregisterAudioFrameObserver(iAudioFrameObserver);
      // Release the engine when the component unmounts
      agoraManager.destroyEngine();
    };
  }, []);

  // Function to join the channel
  const joinChannel = async () => {
    try {
      // Setup Agora engine, fetch RTC token, and join channel
      await agoraManager.setupAgoraEngine();
      await agoraManager.fetchRTCToken(channelName);
      await agoraManager.joinChannel();
    } catch (error) {
      console.error("Error joining channel:", error);
    }
  };

  // Function to configure raw audio and video
  const configureRawAudioAndVideo = async () => {
    // Register audio and video frame observers
    agoraEngineRef.current?.getMediaEngine()?.registerAudioFrameObserver(iAudioFrameObserver);
    agoraEngineRef.current?.getMediaEngine()?.registerVideoFrameObserver(iVideoFrameObserver);

    // Set audio frame parameters for recording, playback, and mixed audio
    agoraEngineRef.current?.setRecordingAudioFrameParameters(
      SAMPLE_RATE,
      SAMPLE_NUM_OF_CHANNEL,
      RawAudioFrameOpModeType.RawAudioFrameOpModeReadWrite,
      SAMPLES_PER_CALL
    );
    agoraEngineRef.current?.setPlaybackAudioFrameParameters(
      SAMPLE_RATE,
      SAMPLE_NUM_OF_CHANNEL,
      RawAudioFrameOpModeType.RawAudioFrameOpModeReadWrite,
      SAMPLES_PER_CALL
    );
    agoraEngineRef.current?.setMixedAudioFrameParameters(
      SAMPLE_RATE,
      SAMPLE_NUM_OF_CHANNEL,
      SAMPLES_PER_CALL
    );
  };

  // Function to leave the channel
  const leaveChannel = async () => {
    try {
      // Leave the channel and destroy the engine
      await agoraManager.leaveChannel();
      agoraManager.destroyEngine();
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };

  // Return relevant functions and state for the component
  return {
    agoraEngineRef,
    join: joinChannel,
    leave: leaveChannel,
    joined,
    fetchRTCToken: agoraManager.fetchRTCToken,
    remoteUIDs,
    setUserRole: agoraManager.setUserRole,
    setChannelName,
    configureRawAudioAndVideo,
  };
};

export default RawAudioAndVideoManager;
