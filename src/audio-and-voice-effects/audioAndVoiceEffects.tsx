import React, { useState, useEffect } from "react";
import AgoraUI, { styles } from "../agora-manager/agoraUI";
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

const AudioEffectsScreen = () => {
  const audioAndVoiceEffectsManager = AudioAndVoiceEffectsManager();
  const [mixingBtnTxt, setMixingBtnTxt] = useState("Mix audio file");

  useEffect(() => {
    const { audioMixingState } = audioAndVoiceEffectsManager;
    switch (audioMixingState) {
      case AudioMixingStateType.AudioMixingStatePaused:
        setMixingBtnTxt("Resume audio mixing");
        break;
      case AudioMixingStateType.AudioMixingStatePlaying:
        setMixingBtnTxt("Pause audio mixing");
        break;
      default:
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
      console.error("Please join the channel to try voice effect");
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
            style={styles.input}
          />
          <View>
            <Button title={mixingBtnTxt} onPress={audioAndVoiceEffectsManager.startAudioMixing} />
            <Button title={audioAndVoiceEffectsManager.isEffectPlaying ? "Stop audio effect" : "Play audio effect"} onPress={playSoundEffect} />
            <Button title={effectCaptions[audioAndVoiceEffectsManager.voiceEffectIndex]} onPress={audioAndVoiceEffectsManager.applyVoiceEffect} />
          </View>
          <View>
            <Text style={{ color: "white" }}>Enable speakerphone</Text>
            <Switch
              onValueChange={(newValue) => audioAndVoiceEffectsManager.changeAudioRoute(newValue)}
            />
          </View>
        </View>
      }
    />
  );
};

export default AudioEffectsScreen;
