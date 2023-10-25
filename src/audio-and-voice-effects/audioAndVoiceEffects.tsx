import React, { useState, useEffect } from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { View, Text, Button, TextInput, Switch } from "react-native";
import { AudioMixingStateType } from 'react-native-agora';
import AudioAndVoiceEffectsManager from "./audioAndVoiceEffectsManager";

const AudioAndVoiceEffects = () => {
  const audioAndVoiceEffectsManager = AudioAndVoiceEffectsManager();

  const effectCaptions = [
    'Apply voice effect',
    'Voice effect: Chat Beautifier',
    'Voice effect: Singing Beautifier',
    'Audio effect: Hulk',
    'Audio effect: Voice Changer',
    'Audio effect: Voice Equalization',
  ];

  // State variables
  const [channelName, setChannelName] = useState("");
  const [mixingBtnTxt, setMixingBtnTxt] = useState("Mix audio file");

  useEffect(() => 
  {
    if(audioAndVoiceEffectsManager.audioMixingState == AudioMixingStateType.AudioMixingStatePaused)
    {
      setMixingBtnTxt("Resume audio mixing");
    }
    else if(audioAndVoiceEffectsManager.audioMixingState == AudioMixingStateType.AudioMixingStatePlaying)
    {
      setMixingBtnTxt("Pause audio mixing");
    }
    else 
    {
      setMixingBtnTxt("Mix Audio File"); // Provide a default value when audioMixingState is null
    }
  }, [audioAndVoiceEffectsManager.audioMixingState]);

  const playSoundEffect = () => {
    if (!audioAndVoiceEffectsManager.isEffectPlaying) {
      audioAndVoiceEffectsManager.playSoundEffect();
    } else {
      audioAndVoiceEffectsManager.stopSoundEffect();
    }
  }
  const joinChannel = () =>
  {
    audioAndVoiceEffectsManager.fetchRTCToken(channelName);
    audioAndVoiceEffectsManager.Join();
  }
  return (
    <AgoraUI
      joined={audioAndVoiceEffectsManager.joined}
      handleJoinCall={joinChannel}
      handleLeaveCall={audioAndVoiceEffectsManager.Leave}
      remoteUids={audioAndVoiceEffectsManager.remoteUIDs}
      setUserRole={audioAndVoiceEffectsManager.setUserRole}
      additionalContent={
        <View>
          <TextInput
            placeholder="Type a channel name here"
            value={channelName}
            onChangeText={(text) => setChannelName(text)}
            style={{
              alignSelf: 'center',
              borderColor: 'black',
              borderWidth: 1,
            }}
          />
          <View>
            <Button title={mixingBtnTxt} onPress={audioAndVoiceEffectsManager.startAudioMixing} />
            <Button title={audioAndVoiceEffectsManager.isEffectPlaying ? "Stop audio effect" : "Play audio effect"} onPress={playSoundEffect} />
            <Button title={effectCaptions[audioAndVoiceEffectsManager.voiceEffectIndex]} onPress={audioAndVoiceEffectsManager.applyVoiceEffect} />
          </View>
          <View>
            <Text>Enable speakerphone</Text>
            <Switch
              onValueChange={(newValue) => audioAndVoiceEffectsManager.changeAudioRoute(newValue)}
            />
          </View>
        </View>
      }
    />
  );
};

export default AudioAndVoiceEffects;
