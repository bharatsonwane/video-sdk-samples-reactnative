import React from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { View, Text, Button, TextInput, Switch } from "react-native";
import ProductWorkflowManager from "./productWorkflowManager";
import { VideoSourceType, RenderModeType, RtcSurfaceView } from 'react-native-agora';

const ProductWorkflow = () => {
    const productWorkflowManager = ProductWorkflowManager();

    return (
        <AgoraUI
            joined={productWorkflowManager.joined}
            handleJoinCall={productWorkflowManager.Join}
            handleLeaveCall={productWorkflowManager.Leave}
            remoteUids={productWorkflowManager.remoteUIDs}
            setUserRole={productWorkflowManager.setUserRole}
            additionalContent={
                <View>
                    <TextInput
                        placeholder="Type a channel name here"
                        onChangeText={(text) => productWorkflowManager.setChannelName(text)}
                        style={{
                            alignSelf: 'center',
                            borderColor: 'black',
                            borderWidth: 1,
                            height: 40
                        }}
                        placeholderTextColor={"white"}
                    />
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
                            <Button title="+" onPress={productWorkflowManager.increaseVolume} />

                            <Text style = {{color: "white"}}> Volume: {productWorkflowManager.volume} </Text>
                            <Button title="-" onPress={productWorkflowManager.decreaseVolume} />
                        </View>
                        <Button
                            title={productWorkflowManager.isSharingScreen ? "Stop Sharing" : "Share Screen"}
                            onPress={productWorkflowManager.isSharingScreen ? productWorkflowManager.stopScreenSharing :productWorkflowManager.startScreenCapture}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 10, color: "white" }}>Mute Remote User:</Text>
                        <Switch
                            onValueChange={(newValue) => productWorkflowManager.mute(newValue)}
                        />
                    </View>
                    {productWorkflowManager.isSharingScreen && (
                        <RtcSurfaceView
                            style={{ width: '100%', height: 200 }}
                            canvas={{
                                uid: 0,
                                sourceType: VideoSourceType.VideoSourceScreen,
                                renderMode: RenderModeType.RenderModeFit,
                            }}
                        />
                    )}
                </View>
            }
        />
    );
};

export default ProductWorkflow;
