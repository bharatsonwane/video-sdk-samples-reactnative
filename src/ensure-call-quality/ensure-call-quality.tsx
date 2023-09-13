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
  EchoTestConfiguration
} from 'react-native-agora';
import config from "../agora-manager/config";

const EnsureCallQuality = () => {
  const agoraManager = AgoraManager();
  const [quality, setQuality] = useState(''); // Indicates network quality
  const [isHighQuality, setVideoQuality] = useState(false); // Quality of the remote video stream being played.
  const [isEchoTestRunning, SetEchoTest] = useState(false); // A variable to track the echo test state.
  const [channelName, setChannelName] = useState("");

  const startProbeTest = () => {
    // Configure a LastmileProbeConfig instance.
    var probeConfig = new LastmileProbeConfig();
    // Probe the uplink network quality.
    probeConfig.probeUplink = true;
    // Probe the downlink network quality.
    probeConfig.probeDownlink = true;
    // The expected uplink bitrate (bps). The value range is [100000,5000000].
    probeConfig.expectedUplinkBitrate = 100000;
    // The expected downlink bitrate (bps). The value range is [100000,5000000].
    probeConfig.expectedDownlinkBitrate = 100000;
    agoraManager.agoraEngineRef.current?.startLastmileProbeTest(probeConfig);
  };

  // Initialize Agora SDK engine for video
  const setupVideoSDKEngine = async () => {
    await agoraManager.setupVideoSDKEngine();
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
        'Specify\\a\\path\\for\\the\\file\\agorasdk.log'
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
  }

  useEffect(() => {
    setupVideoSDKEngine();
  }, []); // Run only on component mount or when the condition changes

  // Create an instance of the engine  and join the channel
  const handleJoinCall = async () => {
    if(isEchoTestRunning)
    {
        console.log('Please, stop the echo test to join the channel');
        return;
    }
    await agoraManager.fetchRTCToken(channelName);
    await agoraManager.joinCall();
  };

  // Leave the channel and release the engine instance.
  const handleLeaveCall = async () => {
    await agoraManager.leaveCall();
  };

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

  const echoTest = async () => {
    if (agoraManager.agoraEngineRef.current === null) {
      await setupVideoSDKEngine();
    }
    SetEchoTest(!isEchoTestRunning);
    if (!isEchoTestRunning) {
      agoraManager.agoraEngineRef.current?.startEchoTest({
        enableAudio: true,
        token: config.rtcToken,
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
            <Text> Network Quality: {quality}</Text>
            <View style={{ padding: 2 }}>
                <Button title={isEchoTestRunning ? "Stop Test" : "Start echo test"} onPress={echoTest} />
            </View>
            <View style={{ padding: 2 }}>
                <Button title="Switch stream quality" onPress={setRemoteStreamQuality} />
            </View>
        </View>
      }
    />
  );
};

export default EnsureCallQuality;
