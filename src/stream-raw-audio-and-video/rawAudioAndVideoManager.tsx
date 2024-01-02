import { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import {
  RawAudioFrameOpModeType,
  AudioFrame,
  VideoFrame,
  VideoSourceType,
  IVideoFrameObserver,
  IAudioFrameObserver,
} from "react-native-agora";

// Constants for audio frame configuration
const SAMPLE_RATE = 16000;
const SAMPLE_NUM_OF_CHANNEL = 1;
const SAMPLES_PER_CALL = 1024;

// Audio frame observer configuration
class AudioFrameObserver implements IAudioFrameObserver {
  // Callback for handling audio frames before mixing
  onPlaybackAudioFrameBeforeMixing(channelId: string, userID: number, audioFrame: AudioFrame): boolean { return false;}
  // Modify the recorded audio frame as needed and return true to apply the changes.
  onRecordAudioFrame(channelId: string, audioFrame: AudioFrame): boolean { return false;};
  onPlaybackAudioFrame(channelId: string, audioFrame: AudioFrame): boolean { return false;};
  onMixedAudioFrame(channelId: string, audioFrame: AudioFrame): boolean {return false};
  onEarMonitoringAudioFrame(audioFrame: AudioFrame): boolean {return false};
}

// Video frame observer configuration
class VideoFrameObserver implements IVideoFrameObserver {
  // Property to control cropping, initialized in the constructor
  public shouldCrop: boolean;

  // Constructor to initialize properties
  constructor() {
    this.shouldCrop = true;
  }

  // Function to toggle cropping
  toggleCropping = () => {
    this.shouldCrop = !this.shouldCrop;
  };

  // Callback for handling captured video frames
  onCaptureVideoFrame(sourceType: VideoSourceType, videoFrame: VideoFrame): boolean {
    // Check if cropping is enabled 
    if (this.shouldCrop) {
      const cropX = 10; // Starting X coordinate for cropping
      const cropY = 20; // Starting Y coordinate for cropping
      const cropWidth = 20; // Width of the cropped area
      const cropHeight = 20; // Height of the cropped area

      // Create a new video frame with cropped dimensions
      videoFrame = this.createCroppedVideoFrame(
        videoFrame,
        cropX,
        cropY,
        cropWidth,
        cropHeight
      );
    }

    return false; // Return false to continue default processing
  }

  // Other video frame callbacks...
  onPreEncodeVideoFrame(sourceType: VideoSourceType, videoFrame: VideoFrame): boolean {
    return false;
  }

  onMediaPlayerVideoFrame(videoFrame: VideoFrame, mediaPlayerId: number): boolean {
    return false;
  }

  onRenderVideoFrame(channelId: string, remoteUid: number, videoFrame: VideoFrame): boolean {
    return false;
  }

  onTranscodedVideoFrame(videoFrame: VideoFrame): boolean {
    return false;
  }

  // Function to create a cropped video frame
  createCroppedVideoFrame = (
    originalFrame: VideoFrame,
    cropX: number,
    cropY: number,
    cropWidth: number,
    cropHeight: number
  ) => {
    // Create a new VideoFrame instance
    const croppedFrame = new VideoFrame();

    // Set properties of the cropped frame
    croppedFrame.type = originalFrame.type;
    croppedFrame.width = cropWidth;
    croppedFrame.height = cropHeight;
    croppedFrame.yStride = originalFrame.yStride;
    croppedFrame.uStride = originalFrame.uStride;
    croppedFrame.vStride = originalFrame.vStride;
    croppedFrame.yBuffer = originalFrame.yBuffer;
    croppedFrame.uBuffer = originalFrame.uBuffer;
    croppedFrame.vBuffer = originalFrame.vBuffer;
    croppedFrame.rotation = originalFrame.rotation;
    croppedFrame.renderTimeMs = originalFrame.renderTimeMs;
    croppedFrame.avsync_type = originalFrame.avsync_type;
    croppedFrame.metadata_buffer = originalFrame.metadata_buffer;
    croppedFrame.metadata_size = originalFrame.metadata_size;
    croppedFrame.textureId = originalFrame.textureId;
    croppedFrame.matrix = originalFrame.matrix;
    croppedFrame.alphaBuffer = originalFrame.alphaBuffer;
    croppedFrame.pixelBuffer = originalFrame.pixelBuffer;

    // Perform cropping (adjust the pointers and dimensions)
    croppedFrame.width = cropWidth;
    croppedFrame.height = cropHeight;
    croppedFrame.yBuffer = originalFrame.yBuffer?.subarray(
      cropY * originalFrame.yStride,
      (cropY + cropHeight) * originalFrame.yStride
    );
    croppedFrame.uBuffer = originalFrame.uBuffer?.subarray(
      (cropY / 2) * originalFrame.uStride,
      ((cropY / 2) + cropHeight / 2) * originalFrame.uStride
    );
    croppedFrame.vBuffer = originalFrame.vBuffer?.subarray(
      (cropY / 2) * originalFrame.vStride,
      ((cropY / 2) + cropHeight / 2) * originalFrame.vStride
    );

    return croppedFrame;
  };
}

// Raw Audio and Video Manager component
const RawAudioAndVideoManager = () => {
  // Initialize Agora manager
  const agoraManager = AgoraManager();
  const audioFrameObserver = new AudioFrameObserver();
  const videoFrameObserver = new VideoFrameObserver();
  const { agoraEngineRef, joined, remoteUIDs } = agoraManager;
  const [channelName, setChannelName] = useState("");

  // Cleanup function for unmounting
  useEffect(() => {
    return () => {
      unregisterFrameObservers();
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

  // Function to unregister frame observers
  const unregisterFrameObservers = () => {
    agoraEngineRef.current?.getMediaEngine().unregisterVideoFrameObserver(videoFrameObserver);
    agoraEngineRef.current?.getMediaEngine().unregisterAudioFrameObserver(audioFrameObserver);
  };

  // Function to configure raw audio and video
  const configureRawAudioAndVideo = async () => {
    // Register audio and video frame observers
    agoraEngineRef.current?.getMediaEngine()?.registerVideoFrameObserver(videoFrameObserver);
    agoraEngineRef.current?.getMediaEngine()?.registerAudioFrameObserver(audioFrameObserver);
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
      unregisterFrameObservers();
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
    toggleCropping: videoFrameObserver.toggleCropping,
    isCropping: videoFrameObserver.shouldCrop,
  };
};

export default RawAudioAndVideoManager;
