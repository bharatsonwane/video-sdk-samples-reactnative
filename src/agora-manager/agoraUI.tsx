import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { RtcSurfaceView } from 'react-native-agora';

const styles = StyleSheet.create({
    videoView: { width: '90%', height: 200 },
});

// Define the type for the component's props
interface AgoraUIProps {
    joined: boolean;
    remoteUid: number | null;
    handleLeaveCall: () => void;
    handleJoinCall: () => void;
}

const AgoraUI: React.FC<AgoraUIProps> = ({
    joined,
    remoteUid,
    handleLeaveCall,
    handleJoinCall,
}: AgoraUIProps) => {
    return (
        <View style = {{alignContent: 'center'}}>
            <View>  
                <Button
                    title={joined ? 'Leave' : 'Join'}
                    onPress={joined ? handleLeaveCall : handleJoinCall}
                />
            </View>
            <ScrollView style ={{padding: 10}}>
                {joined ? (
                    <React.Fragment key={0}>
                        <Text>Local user uid: {0}</Text>
                        <RtcSurfaceView
                            canvas={{ uid: 0 }}
                            style={styles.videoView}
                        />
                    </React.Fragment>
                ) : (
                    <Text>Join a channel</Text>
                )}
                {joined && remoteUid !== null ? (
                    <React.Fragment key={remoteUid}>
                        <Text>Remote user uid: {remoteUid}</Text>
                        <RtcSurfaceView
                            canvas={{ uid: remoteUid }}
                            style={styles.videoView}
                        />
                    </React.Fragment>
                ) : (
                    <Text>Waiting for a remote user to join</Text>
                )}
            </ScrollView>
        </View>
    );
};

export default AgoraUI;
