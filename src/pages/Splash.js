import React from 'react';
import { View } from "native-base";
import config from '../config';
import { Image } from 'react-native';

const Splash = () => (
    <View style={{ flex: 1, backgroundColor: config.primaryColor }} >
        <Image source={require('../assets/splash.png')} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
    </View>
);

export default Splash;