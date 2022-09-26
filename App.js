import { Root } from 'native-base';
import React from 'react';
import { StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import config from './src/config';
import Navigation from './src/Navigation';
import { store } from './src/redux/store';

const App = () => (
  <LinearGradient colors={[config.gradientLightColor, config.gradientDarkColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} >
    <SafeAreaView style={{ flex: 1 }} >
      <StatusBar translucent backgroundColor="transparent" />
      <Provider store={store}>
        <Root>
          <Navigation />
        </Root>
      </Provider>
    </SafeAreaView>
  </LinearGradient>
)

export default App;