import { useState, useEffect, useRef } from 'react';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcConnection,
  UserOfflineReasonType
} from 'react-native-agora';
import { PermissionsAndroid, Platform } from 'react-native';
import config from './config';

const AgoraManager = () => {
  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const [joined, setJoined] = useState(false);
  const [remoteUids, setRemoteUids] = useState<number[]>([]);

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
        const permissionsGranted =
          result['android.permission.RECORD_AUDIO'] === 'granted' &&
          result['android.permission.CAMERA'] === 'granted';

        if (permissionsGranted) {
          console.log('Permissions granted');
        } else {
          console.log('Permissions denied');
        }
      } catch (error) {
        console.error('Permission request error:', error);
      }
    }
  };

  const fetchRTCToken = async (channelName: string) => {
    try {
      if (config.serverUrl !== "") {
        const response = await fetch(
          `${config.serverUrl}/rtc/${channelName}/publisher/uid/${config.uid}/?expiry=${config.tokenExpiryTime}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch RTC token');
        }

        const data = await response.json();
        console.log("RTC token fetched from server:", data.rtcToken);

        config.rtcToken = data.rtcToken;
        config.channelName = channelName;
        return data.rtcToken;
      } else {
        console.log("Add the token server URL to fetch a token.");
        return config.rtcToken;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const initializeAgoraEngine = async () => {
    try {
      await getPermission();

      agoraEngineRef.current = createAgoraRtcEngine();
      agoraEngineRef.current.registerEventHandler({
        onJoinChannelSuccess: onJoinChannelSuccess,
        onUserJoined: onUserJoined,
        onUserOffline: onUserOffline,
      });

      const channelProfile =
        config.product !== "ILS"
          ? ChannelProfileType.ChannelProfileLiveBroadcasting
          : ChannelProfileType.ChannelProfileCommunication;

      agoraEngineRef.current.initialize({
        appId: config.appId,
        channelProfile: channelProfile,
      });

      agoraEngineRef.current.enableVideo();
      console.log('Engine initialized');
    } catch (e) {
      console.error('Error initializing engine:', e);
    }
  };

  const setUserRole = async (role: string) => {
    if (agoraEngineRef.current) {
      const clientRole =
        role === "Host"
          ? ClientRoleType.ClientRoleBroadcaster
          : ClientRoleType.ClientRoleAudience;

      agoraEngineRef.current.setClientRole(clientRole);
    }
  };

  const joinCall = async () => {
    if (agoraEngineRef.current === null) {
      await initializeAgoraEngine();
    }

    try {
      agoraEngineRef.current?.startPreview();
      agoraEngineRef.current?.joinChannel(
        config.rtcToken,
        config.channelName,
        config.uid,
        {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        }
      );
      setJoined(true);
    } catch (e) {
      console.error('Failed to join the call:', e);
    }
  };

  const leaveCall = async () => {
    try {
      await agoraEngineRef.current?.leaveChannel();
      agoraEngineRef.current?.release();
      agoraEngineRef.current = null;
      setRemoteUids([]);
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
  };

  const onUserJoined = (connection: RtcConnection, remoteUid: number, elapsed: number) => {
    showMessage('Remote user joined with uid ' + remoteUid);

    if (!remoteUids.includes(remoteUid)) {
      setRemoteUids([...remoteUids, remoteUid]);
    }
  };

  const onUserOffline = (connection: RtcConnection, remoteUid: number, reason: UserOfflineReasonType) => {
    showMessage('Remote user left the channel. uid: ' + remoteUid + ' , Reason:' + reason);
    setRemoteUids(remoteUids.filter((uid) => uid !== remoteUid));
  };

  useEffect(() => {
    return () => {
      if (agoraEngineRef.current) {
        try {
          agoraEngineRef.current.release();
          console.log('Engine destroyed');
        } catch (error) {
          console.error('Error releasing resources:', error);
        }
      }
    };
  }, []);

  return {
    agoraEngineRef,
    joinCall,
    leaveCall,
    joined,
    remoteUids,
    setUserRole,
    fetchRTCToken,
  };
};

export default AgoraManager;
