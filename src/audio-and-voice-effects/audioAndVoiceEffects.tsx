import React, { useState, useEffect } from "react";
import AgoraUI from "../agora-manager/agoraUI";
import { View, Text, Button, TextInput, Switch } from "react-native";
import { AudioMixingStateType } from 'react-native-agora';
import AudioAndVoiceEffectsManager from "./audioAndVoiceEffectsManager";

const effectCaptions = [
  'Apply voice effect',
  'Voice effect: Chat Beautifier',
  'Voice effect: Singing Beautifier',
  'Audio effect: Hulk',
  'Audio effect: Voice Changer',
  'Audio effect: Voice Equalization',
];

const AudioAndVoiceEffects = () => {
  const audioAndVoiceEffectsManager = AudioAndVoiceEffectsManager();
  const [mixingBtnTxt, setMixingBtnTxt] = useState("Mix audio file");

  useEffect(() => {
    const { audioMixingState } = audioAndVoiceEffectsManager;
    if (audioMixingState === AudioMixingStateType.AudioMixingStatePaused) {
      setMixingBtnTxt("Resume audio mixing");
    } else if (audioMixingState === AudioMixingStateType.AudioMixingStatePlaying) {
      setMixingBtnTxt("Pause audio mixing");
    } else {
      setMixingBtnTxt("Mix Audio File");
    }
  }, [audioAndVoiceEffectsManager.audioMixingState]);

  const playSoundEffect = () => {
    if (audioAndVoiceEffectsManager.joined) {
      if (!audioAndVoiceEffectsManager.isEffectPlaying) {
        audioAndVoiceEffectsManager.playSoundEffect();
      } else {
        audioAndVoiceEffectsManager.stopSoundEffect();
      }
    } else {
      console.log("Please join the channel to try voice effect");
    }
  };

  return (
    <AgoraUI
      joined={audioAndVoiceEffectsManager.joined}
      handleJoinCall={audioAndVoiceEffectsManager.Join}
      handleLeaveCall={audioAndVoiceEffectsManager.Leave}
      remoteUids={audioAndVoiceEffectsManager.remoteUIDs}
      setUserRole={audioAndVoiceEffectsManager.setUserRole}
      additionalContent={
        <View>
          <TextInput
            placeholder="Type a channel name here"
            placeholderTextColor={'white'}
            onChangeText={(text) => audioAndVoiceEffectsManager.setChannelName(text)}
            style={{
              alignSelf: 'center',
              borderColor: 'white',
              borderWidth: 1,
              height: 40
            }}
          />
          <View>
            <Button title={mixingBtnTxt} onPress={audioAndVoiceEffectsManager.startAudioMixing} />
            <Button title={audioAndVoiceEffectsManager.isEffectPlaying ? "Stop audio effect" : "Play audio effect"} onPress={playSoundEffect} />
            <Button title={effectCaptions[audioAndVoiceEffectsManager.voiceEffectIndex]} onPress={audioAndVoiceEffectsManager.applyVoiceEffect} />
          </View>
          <View>
            <Text style = {{color: "white"}}>Enable speakerphone</Text>
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
