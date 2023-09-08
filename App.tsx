import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import GetStartedSDK from './src/get-started-sdk/getStartedSDK';

const App = () => {
  const [selectedValue, setSelectedValue] = useState('option1');

  return (
    <SafeAreaView style = {{alignContent: 'flex-end', alignItems: 'stretch'}}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue: string) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Select an option:" value="" />
        <Picker.Item label="Get Started" value="getStarted" />
        {/* Add more options as needed */}
      </Picker>
      {selectedValue === 'getStarted' && (
          <GetStartedSDK />
        )}
    </SafeAreaView>

  );
};

export default App;
