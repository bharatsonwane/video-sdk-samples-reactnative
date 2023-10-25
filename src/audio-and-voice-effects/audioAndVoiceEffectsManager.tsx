import { useState } from "react";
import AgoraManager from "../agora-manager/agoraManager";
import config from "../agora-manager/config";

import {AudioProfileType, AudioMixingReasonType ,VoiceConversionPreset,AudioEqualizationBandFrequency,AudioScenarioType,AudioEffectPreset, VoiceBeautifierPreset, AudioMixingStateType} from "react-native-agora";
const AudioAndVoiceEffectsManager = () => 
{
    const [audioMixingState, setMixingState] = useState<AudioMixingStateType| null>(null);
    const [isEffectPlaying, setAudioEffectState] = useState(false);
    const agoraManager = AgoraManager();
    const [voiceEffectIndex, setVoiceEffectIndex] = useState(0);

    // Create an instance of the engine and join the channel
    const joinChannel = async () => 
    {
        setupAgoraEngine();
        await agoraManager.joinChannel();
    };

    // Leave the channel and release the engine instance.
    const leaveChannel = async () => 
    {
        agoraManager.destroyEngine();
        await agoraManager.leaveChannel();
    };

    const stopAudioMixing = () =>
    {
        var res = agoraManager.agoraEngineRef.current?.stopAudioMixing();
        console.log(res);
    }
    //
    const stopSoundEffect = () =>
    {
        agoraManager.agoraEngineRef.current?.stopEffect(config.soundEffectId);
    }
    
    // Method to start audio mixing
    const startAudioMixing = () =>
    {
        if(audioMixingState === AudioMixingStateType.AudioMixingStatePaused)
        {
            agoraManager.agoraEngineRef.current?.resumeAudioMixing();
        }
        else if(audioMixingState === AudioMixingStateType.AudioMixingStatePlaying)
        {
            agoraManager.agoraEngineRef.current?.pauseAudioMixing();
        }
        else
        {
            agoraManager.agoraEngineRef.current?.startAudioMixing(config.audioFilePath, true, 1, 0);
        }
    }
    const onAudioEffectFinished = (soundId: number) => {
        console.log("Audio effect finished");
        setAudioEffectState(false);
    };
    
    const onAudioMixingStateChanged = ( state: AudioMixingStateType, reason: AudioMixingReasonType)  => 
    {
        if(state === AudioMixingStateType.AudioMixingStateStopped)
        {
            stopAudioMixing();
        }
        setMixingState(state);
    };
    const setupAgoraEngine =  async () =>
    {
        await agoraManager.setupAgoraEngine();

        // Specify the audio profile and scenario
        agoraManager.agoraEngineRef.current?.setAudioProfile(
            AudioProfileType.AudioProfileMusicHighQualityStereo,
            AudioScenarioType.AudioScenarioGameStreaming);
            
        // Preload audio effect
        agoraManager.agoraEngineRef.current?.preloadEffect(config.soundEffectId, config.soundEffectFilePath);

        agoraManager.agoraEngineRef.current?.registerEventHandler(
            {
                onAudioEffectFinished: onAudioEffectFinished,
                onAudioMixingStateChanged: onAudioMixingStateChanged
            });
    }
    const applyVoiceEffect = () => {
        if (!agoraManager.joined) {
            return;
        }
    
        var index = voiceEffectIndex + 1;
        if (index > 5) {
            index = 0;
        }
        setVoiceEffectIndex(index);
        
        // Turn off all previous effects
        agoraManager.agoraEngineRef.current?.setVoiceBeautifierPreset(
            VoiceBeautifierPreset.VoiceBeautifierOff,
        );
        agoraManager.agoraEngineRef.current?.setAudioEffectPreset(
            AudioEffectPreset.AudioEffectOff,
        );
        agoraManager.agoraEngineRef.current?.setVoiceConversionPreset(
            VoiceConversionPreset.VoiceConversionOff,
        );
    
        if (index === 1) {
            agoraManager.agoraEngineRef.current?.setVoiceBeautifierPreset(
                VoiceBeautifierPreset.ChatBeautifierMagnetic,
        );
        } else if (index === 2) {
            agoraManager.agoraEngineRef.current?.setVoiceBeautifierPreset(
                VoiceBeautifierPreset.SingingBeautifier,
        );
        } else if (index === 3) {
            agoraManager.agoraEngineRef.current?.setAudioEffectPreset(
                AudioEffectPreset.VoiceChangerEffectHulk,
        );
        } else if (index === 4) {
            agoraManager.agoraEngineRef.current?.setVoiceConversionPreset(
                VoiceConversionPreset.VoiceChangerBass,
        );
        } else if (index === 5) {
            // Sets local voice equalization.
            // The first parameter sets the band frequency.
            // Each value represents the center frequency of the band:
            // 31, 62, 125, 250, 500, 1k, 2k, 4k, 8k, and 16k Hz.
            // The second parameter sets the gain of each band between -15 and 15 dB.
            // The default value is 0.
            agoraManager.agoraEngineRef.current?.setLocalVoiceEqualization(
                AudioEqualizationBandFrequency.AudioEqualizationBand1k, //Band frequency
                3, //Band gain
            );
            agoraManager.agoraEngineRef.current?.setLocalVoicePitch(0.5);
        } else if (index === 0) {
            // Remove previous effect
            agoraManager.agoraEngineRef.current?.setLocalVoicePitch(1.0);
            agoraManager.agoraEngineRef.current?.setLocalVoiceEqualization(
                AudioEqualizationBandFrequency.AudioEqualizationBand1k, //Band frequency
                0, //Band gain
            );
        }
    };
    
    const changeAudioRoute = (newValue: boolean) => {
    agoraManager.agoraEngineRef.current?.setDefaultAudioRouteToSpeakerphone(false); // Disable the default audio route.
    agoraManager.agoraEngineRef.current?.setEnableSpeakerphone(newValue); // Enable or disable the speakerphone temporarily.
    }
    const playSoundEffect = () =>
    {
        agoraManager.agoraEngineRef.current?.playEffect(
            config.soundEffectId,
            config.soundEffectFilePath,
            0, //loopCount
            1, // pitch
            0, // pan
            100, //gain
            true, //publish
        );
        setAudioEffectState(true);
    }
    const stopAllEffect = () =>
    {
        agoraManager.agoraEngineRef.current?.setVoiceBeautifierPreset(
            VoiceBeautifierPreset.VoiceBeautifierOff,
        );
        agoraManager.agoraEngineRef.current?.setAudioEffectPreset(
            AudioEffectPreset.AudioEffectOff,
        );
        agoraManager.agoraEngineRef.current?.setVoiceConversionPreset(
            VoiceConversionPreset.VoiceConversionOff
        );    
    }

  return {
    agoraEngineRef: agoraManager.agoraEngineRef.current,
    Join: joinChannel,
    Leave: leaveChannel,
    joined: agoraManager.joined,
    fetchRTCToken: agoraManager.fetchRTCToken,
    startAudioMixing,
    stopAudioMixing,
    applyVoiceEffect,
    playSoundEffect,
    stopSoundEffect,
    changeAudioRoute,
    audioMixingState,
    remoteUIDs: agoraManager.remoteUIDs,
    setUserRole: agoraManager.setUserRole,
    isEffectPlaying,
    stopAllEffect,
    voiceEffectIndex
  };
};

export default AudioAndVoiceEffectsManager;

 