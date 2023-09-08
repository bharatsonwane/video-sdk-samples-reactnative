import { useState } from 'react';
import {
    createAgoraRtcEngine,
    ChannelProfileType,
    ClientRoleType,
    IRtcEngine,
} from 'react-native-agora';
import { PermissionsAndroid, Platform } from 'react-native';
import config from './config';

const AgoraManager = () => {
    const [agoraEngine, setAgoraEngine] = useState<IRtcEngine|null>(null);
    const [joined, setJoined] = useState(false);
    const [remoteUid, setRemoteUid] = useState(null);

    const getPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const result = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                ]);
                if (
                    result['android.permission.RECORD_AUDIO'] === 'granted' &&
                    result['android.permission.CAMERA'] === 'granted'
                ) {
                    console.log('Permissions granted');
                } else {
                    console.log('Permissions denied');
                }
            } catch (error) {
                console.error('Permission request error:', error);
            }
        }
    };

    const setupVideoSDKEngine = async () => {
        try {
            await getPermission();

            const engine = createAgoraRtcEngine();
            engine.registerEventHandler({
                onJoinChannelSuccess: () => {
                    onJoinChannelSuccess();
                },
                onUserJoined: (_connection, Uid) => {
                    onUserJoined(Uid);
                },
                onUserOffline: (_connection, Uid) => {
                    onUserOffline(Uid);
                },
            });

            engine.initialize({
                appId: config.appId,
                channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
            });
            engine.setChannelProfile(
                ChannelProfileType.ChannelProfileLiveBroadcasting
            );
            engine.enableVideo();

            setAgoraEngine(engine);
            console.log('Engine initialized');
        } catch (e) {
            console.error('Error initializing engine:', e);
        }
    };

    const joinCall = async () => {
        if (agoraEngine === null) {
            return;
        }
        try {
            agoraEngine.startPreview();
            agoraEngine.joinChannel(
                config.token,
                config.channelName,
                config.uid,
                {
                    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                }
            );
            setJoined(true);
        } catch (e) {
            console.log(e);
        }
    };

    const leaveCall = async () => {
        try {
            await agoraEngine?.leaveChannel();
            setRemoteUid(null);
            setJoined(false);
            console.log('You left the channel');
        } catch (error) {
            console.error('Failed to leave channel:', error);
        }
    };

    const showMessage = (msg: any) => {
        console.log(msg);
    };

    const onJoinChannelSuccess = () => {
        showMessage('Successfully joined the channel ' + config.channelName);
        setJoined(true);
    };

    const onUserJoined = (Uid: any) => {
        showMessage('Remote user joined with uid ' + Uid);
        setRemoteUid(Uid);
    };

    const onUserOffline = (Uid: any) => {
        showMessage('Remote user left the channel. uid: ' + Uid);
        setRemoteUid(Uid);
    };

    return {
        agoraEngine,
        joinCall,
        leaveCall,
        joined,
        remoteUid,
        setupVideoSDKEngine
    };
};

export default AgoraManager;
