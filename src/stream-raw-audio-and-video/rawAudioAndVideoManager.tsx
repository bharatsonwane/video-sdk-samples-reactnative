import { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import {
  RawAudioFrameOpModeType,
  AudioFrame,
  VideoFrame,
  VideoSourceType,
  IVideoFrameObserver,
} from "react-native-agora";

// Constants for audio frame configuration
const SAMPLE_RATE = 16000;
const SAMPLE_NUM_OF_CHANNEL = 1;
const SAMPLES_PER_CALL = 1024;

// Audio frame observer configuration
const iAudioFrameObserver = {
  onPlaybackAudioFrameBeforeMixing: (channelId: string, uID: number, audioFrame: AudioFrame) => {
    return false;
  },
};

class VideoFrameObserver implements IVideoFrameObserver
{
  onCaptureVideoFrame(
    sourceType: VideoSourceType,
    videoFrame: VideoFrame
  ): boolean {
      return true;
  };

  onPreEncodeVideoFrame(
    sourceType: VideoSourceType,
    videoFrame: VideoFrame
  ): boolean{
    return true;
  };

  onMediaPlayerVideoFrame (
    videoFrame: VideoFrame,
    mediaPlayerId: number
  ) : boolean
  {
    return true;
  };

  onRenderVideoFrame (
    channelId: string,
    remoteUid: number,
    videoFrame: VideoFrame
  ) :boolean {
    return true;
  };

  onTranscodedVideoFrame (videoFrame: VideoFrame) : boolean{
    return true;
  };
}
  
const RawAudioAndVideoManager = () => {
  // Initialize Agora manager
  const agoraManager = AgoraManager();
  const { agoraEngineRef, joined, remoteUIDs } = agoraManager;
  const [channelName, setChannelName] = useState("");
  // Cleanup function for unmounting
  useEffect(() => {
    return () => {
      //agoraEngineRef.current?.getMediaEngine().unregisterVideoFrameObserver();
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
      await configureRawAudioAndVideo();
      await agoraManager.fetchRTCToken(channelName);
      await agoraManager.joinChannel();
    } catch (error) {
      console.error("Error joining channel:", error);
    }
  };

  // Function to configure raw audio and video
  const configureRawAudioAndVideo = async () => {
    // Register audio and video frame observers
    agoraEngineRef.current?.getMediaEngine()?.registerVideoFrameObserver(new VideoFrameObserver);
    agoraEngineRef.current?.getMediaEngine()?.registerAudioFrameObserver(iAudioFrameObserver);

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
  };
};

export default RawAudioAndVideoManager;
