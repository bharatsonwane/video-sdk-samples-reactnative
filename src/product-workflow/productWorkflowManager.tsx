import { useState, useEffect } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import {
    VideoContentHint,
    VideoSourceType,
    LocalVideoStreamState,
    LocalVideoStreamError,
    showRPSystemBroadcastPickerView,
    ChannelMediaOptions
} from "react-native-agora";
import { Alert, Platform } from "react-native";

const ProductWorkflowManager = () => {
    const agoraManager = AgoraManager();
    const { agoraEngineRef, joined, remoteUIDs } = agoraManager;

    const [volume, setVolume] = useState(50);
    const [isSharingScreen, setScreenCapture] = useState(false);

    // State for managing the channel name
    const [channelName, setChannelName] = useState("");

    useEffect(() => {
        return () => {
            // Release the engine when component unmount.
            agoraManager.destroyEngine();
        };
    }, []);

    const SetupAgoraEngine = async ()  => {

        await agoraManager.setupAgoraEngine();

        if (Platform.OS === 'android') {
            agoraEngineRef.current?.loadExtensionProvider('agora_screen_capture_extension');
        }

        agoraEngineRef.current?.registerEventHandler({
            onLocalVideoStateChanged(
                source: VideoSourceType,
                state: LocalVideoStreamState,
                _error: LocalVideoStreamError,
            ) {
                handleLocalVideoStateChange(source, state);
            },
        });
    }
    const joinChannel = async () => {
        try {
            await SetupAgoraEngine();
            await agoraManager.fetchRTCToken(channelName);
            await agoraManager.joinChannel();
        } catch (error) {
            console.error("Error joining channel:", error);
        }
    };

    const updateChannelPublishOptions = (publishScreenTrack: boolean) => {
        const channelOptions = new ChannelMediaOptions();
        channelOptions.publishScreenCaptureAudio = publishScreenTrack;
        channelOptions.publishScreenCaptureVideo = publishScreenTrack;
        channelOptions.publishScreenTrack = publishScreenTrack;
        channelOptions.publishMicrophoneTrack = !publishScreenTrack;
        channelOptions.publishCameraTrack = !publishScreenTrack;
        agoraEngineRef.current?.updateChannelMediaOptions(channelOptions);
      };
    
    const handleLocalVideoStateChange = (source: VideoSourceType, state: LocalVideoStreamState) => {
        if (source === VideoSourceType.VideoSourceScreen) {
            switch (state) {
                case LocalVideoStreamState.LocalVideoStreamStateStopped:
                case LocalVideoStreamState.LocalVideoStreamStateFailed:
                    break;
                case LocalVideoStreamState.LocalVideoStreamStateCapturing:
                case LocalVideoStreamState.LocalVideoStreamStateEncoding:
                    setScreenCapture(true);
                    break;
            }
        }
    };

    const increaseVolume = () => {
        if(agoraManager.joined)
        {
            if (volume !== 100) {
                setVolume(volume + 5);
            }
            agoraEngineRef.current?.adjustRecordingSignalVolume(volume);
        }
        else
        {
            Alert.alert("Join channel to adjust the local audio volume");
        }
    };

    const mute = (mute: boolean) => {
        if(agoraManager.joined === false)
        {
            Alert.alert("Join the channel to mute and unmute the remote user");
            return;
        }
        if (remoteUIDs.length !== 0) {
            agoraEngineRef.current?.muteRemoteAudioStream(remoteUIDs[0], mute);
        }
        else {
            Alert.alert("No remote user in the channel");
        }
    };

    const startScreenCapture = async () => {
        if(agoraManager.joined === false)
        {
            Alert.alert("Join the channel to start screen sharing");
            return;
        }
        const screenCaptureCapability = agoraEngineRef.current?.queryScreenCaptureCapability();
        if (typeof screenCaptureCapability !== 'undefined' && screenCaptureCapability >= 0) {

            agoraEngineRef.current?.startScreenCapture({
                captureVideo: true,
                audioParams: {
                    sampleRate: 16000,
                    channels: 2,
                    captureSignalVolume: 100,
                },
                captureAudio: true,
                videoParams: {
                    dimensions: { width: 1280, height: 720 },
                    frameRate: 15,
                    bitrate: 0,
                    contentHint: VideoContentHint.ContentHintMotion,
                },
            });
            agoraEngineRef.current?.startPreview(VideoSourceType.VideoSourceScreen);
            if (Platform.OS === 'ios') {
                // Show the picker view for screen share, ⚠️ only support for iOS 12+
                await showRPSystemBroadcastPickerView(true);
            }
            setScreenCapture(true);
            updateChannelPublishOptions(true);
        }
        else {
            Alert.alert("Screen sharing is not supported on your device");
        }
    };

    const stopScreenSharing = () => {
        agoraEngineRef.current?.stopScreenCapture();
        updateChannelPublishOptions(false);
        setScreenCapture(false);
    };

    const decreaseVolume = () => {
        if(agoraManager.joined)
        {
            if (volume !== 0) {
                setVolume(volume - 5);
            }
            agoraEngineRef.current?.adjustRecordingSignalVolume(volume);
        }
        else
        {
            Alert.alert("Join channel to adjust the local audio volume");
        }
    };

    const leaveChannel = async () => {
        try {
            agoraManager.leaveChannel();
            agoraManager.destroyEngine();
        } catch (error) {
            console.error("Error leaving channel:", error);
        }
    };

    return {
        agoraEngineRef: agoraEngineRef,
        Join: joinChannel,
        Leave: leaveChannel,
        joined: joined,
        fetchRTCToken: agoraManager.fetchRTCToken,
        increaseVolume,
        decreaseVolume,
        startScreenCapture,
        stopScreenSharing,
        remoteUIDs: remoteUIDs,
        setUserRole: agoraManager.setUserRole,
        mute,
        setChannelName,
        isSharingScreen,
        volume
    };
};

export default ProductWorkflowManager;
