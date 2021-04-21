import React from 'react';
import { 
  StatusBar
} from 'react-native';

import { 
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';

import AppLoading from 'expo-app-loading';

import Routes from './src/routes/index';

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  if(!fontsLoaded) {
    return (
      <>
        <StatusBar 
          barStyle='dark-content' 
          backgroundColor='transparent'
        />
        <AppLoading/>
      </>
    );
  };

  return (
    <>
      <StatusBar 
        barStyle='dark-content' 
        backgroundColor='transparent'
      />
      <Routes />
    </>
  );
};
