import { useState, useRef } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import config from "../agora-manager/config";
import {
    VideoContentHint,
    IRtcEngineEx,
    VideoSourceType,
    LocalVideoStreamState,
    LocalVideoStreamError,
    createAgoraRtcEngine
} from "react-native-agora";
import { Alert, Platform } from "react-native";

const ProductWorkflowManager = () => {
    const agoraManager = AgoraManager();
    const { agoraEngineRef, joined, remoteUIDs } = agoraManager;

    const agoraEngineRefEx = useRef<IRtcEngineEx>();
    const [volume, setVolume] = useState(50);
    const [isSharingScreen, setScreenCapture] = useState(false);

    // State for managing the channel name
    const [channelName, setChannelName] = useState("");

    const joinChannel = async () => {
        try {
            await agoraManager.setupAgoraEngine();
            agoraEngineRefEx.current = createAgoraRtcEngine() as IRtcEngineEx;

            if (Platform.OS === 'android') {
                agoraEngineRefEx.current.loadExtensionProvider('agora_screen_capture_extension');
            }

            agoraEngineRefEx.current?.registerEventHandler({
                onLocalVideoStateChanged(
                    source: VideoSourceType,
                    state: LocalVideoStreamState,
                    _error: LocalVideoStreamError,
                ) {
                    handleLocalVideoStateChange(source, state);
                },
            });

            await agoraManager.fetchRTCToken(channelName);
            await agoraManager.joinChannel();
        } catch (error) {
            console.error("Error joining channel:", error);
        }
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

    const startScreenCapture = () => {

        if(agoraManager.joined === false)
        {
            Alert.alert("Join the channel to start screen sharing");
            return;
        }
        agoraEngineRef.current?.startScreenCapture({
            captureVideo: true,
            captureAudio: true,
            videoParams: {
                dimensions: { width: 1280, height: 720 },
                frameRate: 15,
                bitrate: 0,
                contentHint: VideoContentHint.ContentHintMotion,
            },
            audioParams: {
                sampleRate: 16000,
                channels: 2,
                captureSignalVolume: 100,
            },
        });
        agoraEngineRef.current?.startPreview(VideoSourceType.VideoSourceScreen);
        setScreenCapture(true);
    };

    const stopScreenSharing = () => {
        agoraEngineRef.current?.stopScreenCapture();
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
