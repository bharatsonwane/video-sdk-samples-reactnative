import React, { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import AgoraUI from "../agora-manager/agoraUI";
import { View, Text, Button, TextInput } from "react-native";
import {
  AudioProfileType,
  AudioScenarioType,
  FrameRate,
  VideoDimensions,
  OrientationMode,
  DegradationPreference,
  VideoMirrorModeType,
  LastmileProbeConfig,
  VideoEncoderConfiguration,
  VideoStreamType,
  CompressionPreference,
  QualityType,
  LogLevel,
} from 'react-native-agora';
import config from "../agora-manager/config";

const EnsureCallQuality = () => {
  const agoraManager = AgoraManager();

  // State variables
  const [quality, setQuality] = useState(''); // Indicates network quality
  const [isHighQuality, setVideoQuality] = useState(false); // Quality of the remote video stream being played.
  const [isEchoTestRunning, SetEchoTest] = useState(false); // A variable to track the echo test state.
  const [channelName, setChannelName] = useState("");

  // Function to start a network probe test
  const startProbeTest = () => {
    // Configure a LastmileProbeConfig instance.
    var probeConfig = new LastmileProbeConfig();
    probeConfig.probeUplink = true; // Probe the uplink network quality.
    probeConfig.probeDownlink = true; // Probe the downlink network quality.
    probeConfig.expectedUplinkBitrate = 100000; // Expected uplink bitrate (bps).
    probeConfig.expectedDownlinkBitrate = 100000; // Expected downlink bitrate (bps).
    agoraManager.agoraEngineRef.current?.startLastmileProbeTest(probeConfig);
  };

  // Function to set up the video SDK engine
  const setupVideoSDKEngine = async () => {
    await agoraManager.setupAgoraEngine();
    if (agoraManager.agoraEngineRef.current !== null) {
      // Enable the dual stream mode
      agoraManager.agoraEngineRef.current.enableDualStreamMode(true);
      // Specify the audio scenario and audio profile.
      agoraManager.agoraEngineRef.current.setAudioProfile(
        AudioProfileType.AudioProfileMusicHighQualityStereo,
        AudioScenarioType.AudioScenarioGameStreaming,
      );
      // Set the video profile
      var videoConfig = new VideoEncoderConfiguration();
      // Set mirror mode
      videoConfig.mirrorMode = VideoMirrorModeType.VideoMirrorModeAuto;
      // Set framerate
      videoConfig.frameRate = FrameRate.FrameRateFps10;
      // Set bitrate
      videoConfig.bitrate = 100000;
      // Set dimensions
      videoConfig.dimensions = new VideoDimensions();
      // Set orientation mode
      videoConfig.orientationMode = OrientationMode.OrientationModeAdaptive;
      // Set degradation preference
      videoConfig.degradationPreference =
        DegradationPreference.MaintainBalanced;
      // Set compression preference
      if (videoConfig.advanceOptions !== undefined) {
        videoConfig.advanceOptions.compressionPreference =
          CompressionPreference.PreferLowLatency;
      }
      // Apply the configuration
      agoraManager.agoraEngineRef.current.setVideoEncoderConfiguration(videoConfig);

      // Start the probe test
      startProbeTest();

      // Configure the log file.
      agoraManager.agoraEngineRef.current?.setLogFile(
        '<Specify the log directory path>\\agorasdk.log'
      );
      agoraManager.agoraEngineRef.current.setLogFileSize(256); // Ranges from 128 - 20480kb.
      agoraManager.agoraEngineRef.current.setLogLevel(LogLevel.LogLevelWarn);
      agoraManager.agoraEngineRef.current.registerEventHandler(
        {
          onConnectionStateChanged: (connection, state, reason) => {
            console.log(
              'Connection state changed' +
              '\n New state: ' +
              state +
              '\n Reason: ' +
              reason,
            );
          },
          onLastmileQuality: Quality => {
            updateNetworkStatus(Quality);
          },
          onLastmileProbeResult: result => {
            agoraManager.agoraEngineRef.current?.stopLastmileProbeTest();
            // The result object contains the detailed test results that help you
            // manage call quality, for example, the downlink jitter.
            console.log('Downlink jitter: ' + result.downlinkReport?.jitter);
            agoraManager.agoraEngineRef.current?.release();
            agoraManager.agoraEngineRef.current = null;
          },
          onNetworkQuality(_connection, _Uid, _txQuality, rxQuality) {
            // Use downlink network quality to update the network status
            updateNetworkStatus(rxQuality);
          },
          onRtcStats: (_connection, rtcStats) => {
            console.log(rtcStats.userCount + ' user(s)');
            console.log('Packet loss rate: ' + rtcStats.rxPacketLossRate);
          },
          onRemoteVideoStateChanged: (
            _connection,
            Uid,
            state,
            reason,
            elapsed,
          ) => {
            console.log(
              'Remote video state changed: \n Uid =' +
              Uid +
              ' \n NewState =' +
              state +
              ' \n reason =' +
              reason +
              ' \n elapsed =' +
              elapsed,
            );
          },
          onRemoteVideoStats: (_connection, stats) => {
            console.log(
              'Remote Video Stats: ' +
              '\n User id =' +
              stats.uid +
              '\n Received bitrate =' +
              stats.receivedBitrate +
              '\n Total frozen time =' +
              stats.totalFrozenTime,
            );
          },
        }
      );
    }
  };

  // Initialize the video SDK engine when the component mounts
  useEffect(() => {
    setupVideoSDKEngine();
  }, []); // Run only on component mount or when the condition changes

  // Function to join a call
  const handleJoinCall = async () => {
    if (isEchoTestRunning) {
      console.log('Please, stop the echo test to join the channel');
      return;
    }
    await agoraManager.fetchRTCToken(channelName);
    await agoraManager.joinCall();
  };

  // Function to leave a call
  const handleLeaveCall = async () => {
    await agoraManager.leaveCall();
  };

  // Function to update network quality based on the QualityType
  const updateNetworkStatus = (Quality: QualityType) => {
    if (Quality > 0 && Quality < 3) {
      setQuality('Excellent');
    } else if (Quality <= 4) {
      setQuality('Poor');
    } else if (Quality <= 6) {
      setQuality('Bad');
    } else {
      setQuality('');
    }
  };

  // Function to switch remote video stream quality
  const setRemoteStreamQuality = () => {
    if (agoraManager.remoteUids[0] === null) {
      console.log("No remote user in the channel");
      return;
    }
    setVideoQuality(!isHighQuality);

    const streamType = isHighQuality
      ? VideoStreamType.VideoStreamHigh
      : VideoStreamType.VideoStreamLow;

    agoraManager.agoraEngineRef.current?.setRemoteVideoStreamType(
      agoraManager.remoteUids[0],
      streamType
    );

    console.log(
      `Switching to ${isHighQuality ? 'high-quality' : 'low-quality'} video`
    );
  };

  // Function to start or stop the echo test
  const echoTest = async () => {
    if (agoraManager.agoraEngineRef.current === null) {
      await setupVideoSDKEngine();
    }
    SetEchoTest(!isEchoTestRunning);
    if (!isEchoTestRunning) {
      agoraManager.agoraEngineRef.current?.startEchoTest({
        enableAudio: true,
        token: config.token,
        channelId: config.channelName,
        intervalInSeconds: 2,
      });
      console.log('Echo test started');
    } else {
      agoraManager.agoraEngineRef.current?.stopEchoTest();
      agoraManager.agoraEngineRef.current?.release();
      agoraManager.agoraEngineRef.current = null;
      console.log('Echo test stopped');
    }
  };

  return (
    <AgoraUI
      joined={agoraManager.joined}
      handleJoinCall={handleJoinCall}
      handleLeaveCall={handleLeaveCall}
      remoteUids={agoraManager.remoteUids}
      setUserRole={agoraManager.setUserRole}
      additionalContent={
        <View>
          {/* Input field for channel name */}
          <TextInput
            placeholder="Type a channel name here"
            value={channelName}
            onChangeText={(text) => setChannelName(text)}
            style={{
              alignSelf: 'center',
              borderColor: 'black', // Set the border color to black
              borderWidth: 1, // Add a border width to make it visible
            }}
          />
          {/* Display network quality */}
          <Text> Network Quality: {quality}</Text>
          {/* Button to start/stop echo test */}
          <View style={{ padding: 2 }}>
            <Button title={isEchoTestRunning ? "Stop Test" : "Start echo test"} onPress={echoTest} />
          </View>
          {/* Button to switch remote stream quality */}
          <View style={{ padding: 2 }}>
            <Button title="Switch stream quality" onPress={setRemoteStreamQuality} />
          </View>
        </View>
      }
    />
  );
};

export default EnsureCallQuality;
