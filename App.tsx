import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import GetStartedSDK from './src/get-started-sdk/getStartedSDK';
import config from './src/agora-manager/config';
import AuthenticationWorkflow from './src/authentication-workflow/authenticationWorkflow';
import EnsureCallQuality from './src/ensure-call-quality/ensureCallQuality';
import AudioAndVoiceEffects from './src/audio-and-voice-effects/audioAndVoiceEffects';
import ProductWorkflow from './src/product-workflow/productWorkflow';
import PlayMedia from './src/play-media/playMedia';

const App = () => {
  const [selectedValues, setSelectedValues] = useState({
    selectedProduct: 'Video Calling',
    selectedSampleCode: '',
  });

  const handleProductChange = (itemValue: string) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      selectedProduct: itemValue,
    }));
    config.product = itemValue;
  };

  const handleSampleCodeChange = (itemValue: string) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      selectedSampleCode: itemValue,
    }));
  };

  return (
    <SafeAreaView>
      <Picker
        selectedValue={selectedValues.selectedProduct}
        onValueChange={handleProductChange}
      >
        <Picker.Item label="Video Calling" value="Video Calling" />
        <Picker.Item label="ILS" value="ILS" />
      </Picker>
      <Picker
        selectedValue={selectedValues.selectedSampleCode}
        onValueChange={handleSampleCodeChange}
      >
        <Picker.Item label="Select a sample code:" value="" />
        <Picker.Item label="Get Started" value="getStarted" />
        <Picker.Item label="Authentication Workflow" value="authenticationWorkflow"/> 
        <Picker.Item label="Ensure Call Quality" value="callQuality"/> 
        <Picker.Item label="Audio and Voice Effects" value = "audioEffects"/>
        <Picker.Item label="Share screen, mute, and volume control" value = "productWorkflow"/>
        <Picker.Item label="Stream Media to a Channel" value = "playMedia"/>

      </Picker>
      {selectedValues.selectedSampleCode === 'getStarted' && (
        <GetStartedSDK />
      )}
      {selectedValues.selectedSampleCode === 'authenticationWorkflow' && (
        <AuthenticationWorkflow />
      )}
      {selectedValues.selectedSampleCode === 'callQuality' && (
        <EnsureCallQuality />
      )}
      {
        selectedValues.selectedSampleCode === 'audioEffects' && (
          <AudioAndVoiceEffects />
      )}
      {
        selectedValues.selectedSampleCode === 'productWorkflow' && (
          <ProductWorkflow />
      )}
      {
        selectedValues.selectedSampleCode === 'playMedia'  && (
          <PlayMedia/>
      )}
   </SafeAreaView>
  );
};

export default App;
