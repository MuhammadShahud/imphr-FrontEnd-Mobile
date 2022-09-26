import React, { Component, useEffect, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer"
import Splash from "./pages/Splash";
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Questions from './pages/Questions';
import Answers from './pages/Answers';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Guidelines from './pages/Guidelines';
import config from './config';
import { View } from 'native-base';
import { Image, LayoutAnimation, Platform, StyleSheet, UIManager } from 'react-native';
import Video from 'react-native-video';
import RoutineTests from './pages/RoutineTests';
import IMPHR from './pages/IMPHR';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SubscriptionPlan from './pages/SubscriptionPlan';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { LoginAction } from './redux/actions';
import Logout from './pages/Logout';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStackNavigator = () => (
    <Stack.Navigator headerMode="none">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
)

const HomeStackNavigator = () => (
    <Stack.Navigator headerMode="none" >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Tests" component={RoutineTests} />
        <Stack.Screen name="IMPHR" component={IMPHR} />
        <Stack.Screen name="Questions" component={Questions} />
        <Stack.Screen name="Answers" component={Answers} />
    </Stack.Navigator>
)

const DrawerNavigator = () => (
    <Drawer.Navigator
        drawerPosition="right"
        drawerStyle={{ backgroundColor: config.gradientLightColor, width: '70%' }}
        drawerContentOptions={{ labelStyle: { color: "#FFF", alignSelf: "center" } }}
    >
        <Drawer.Screen name="Home" component={HomeStackNavigator} />
        <Drawer.Screen name="Guidelines" component={Guidelines} options={{ title: "Why You Need This App" }} />
        <Drawer.Screen name="About" component={About} options={{ title: "About Us" }} />
        <Drawer.Screen name="Subscriptions" component={SubscriptionPlan} options={{ title: "Subscriptions" }} />
        {/*<Drawer.Screen name="Contact" component={Contact} options={{ title: "Contact Us" }} /> */}
        <Drawer.Screen name="Terms" component={Terms} options={{ title: "Terms & Conditions" }} />
        <Drawer.Screen name="Privacy" component={Privacy} options={{ title: "Privacy Policy" }} />
        <Drawer.Screen name="Logout" component={Logout} options={{ title: "Login/Logout" }} />
    </Drawer.Navigator>
);


class Navigation extends Component {
    state = {
        splash: true,
        ads: [],
        currentIndex: 0,
        adsFreq: 0,
        video_ads: [],
        currentVideoIndex: 0,
        videoAdsFreq: 0,
        playingVideo: false
    }

    constructor() {
        super();
        if (Platform.OS == "android" && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    componentDidMount() {
        this.getVideoAds();
        this.getAds();
    }

    changeVideoAd = () => {
        setInterval(() => {
            if (this.state.video_ads.length - 1 != this.state.currentVideoIndex) {
                this.setState({ currentVideoIndex: this.state.currentVideoIndex + 1, playingVideo: true })
            }
            else {
                this.setState({ currentVideoIndex: 0, playingVideo: true })
            }
        }, this.state.videoAdsFreq);
    }

    getVideoAds = async () => {
        const res = await config.getApi(config.apiAds() + "?type=Video", config.defaultHeaders);
        if (res.success) {
            this.setState({ video_ads: res.data.ads, videoAdsFreq: res.data.time });
            this.changeVideoAd();
        }
    }

    getAds = async () => {
        const res = await config.getApi(config.apiAds(), config.defaultHeaders);
        if (res.success == true) {
            this.setState({ ads: res.data.ads, adsFreq: res.data.time });
            this.changeAd();
            this.getUser();
            setTimeout(() => {
                this.setState({ splash: false })
            }, 3000);
        }
    }

    changeAd = () => {
        setInterval(() => {
            if (this.state.ads.length - 1 != this.state.currentIndex) {
                this.setState({ currentIndex: this.state.currentIndex + 1 })
            }
            else {
                this.setState({ currentIndex: 0 })
            }
        }, this.state.adsFreq);
    }

    getUser = async () => {
        await AsyncStorage.getItem("IMPHR@USER", (error, result) => {
            if (!error) {
                if (result) {
                    let user = JSON.parse(result);
                    this.props.Login({ user })
                }
            }
        });
    }

    render() {
        let banner = null;
        let video = null;
        let topBanner = null;
        if (!this.state.splash) {
            banner = (
                <View style={{ height: 50, width: '100%', borderTopColor: "#ccc", borderTopWidth: 1 }} >
                    <Image
                        source={{ uri: config.imagesUrl + this.state.ads[this.state.currentIndex]?.file }} style={{ flex: 1 }}
                        progressiveRenderingEnabled={true}
                    />
                </View>
            );
        }
        if (!this.state.splash && this.state.ads[this.state.currentIndex + 1]) {
            topBanner = (
                <View style={{ height: 50, width: '100%', borderTopColor: "#ccc", borderTopWidth: 1 }} >
                    <Image
                        source={{ uri: config.imagesUrl + this.state.ads[this.state.currentIndex + 1]?.file }} style={{ flex: 1 }}
                        progressiveRenderingEnabled={true}
                    />
                </View>
            );
        }
        if (!this.state.splash && this.state.playingVideo && this.state.video_ads[this.state.currentVideoIndex]) {
            video = (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: "#000" }]} >
                    <Video
                        controls={false}
                        source={{ uri: config.imagesUrl + this.state.video_ads[this.state.currentVideoIndex]?.file }}
                        // onVideoEnd={() => this.setState({ playingVideo: false })}
                        onEnd={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
                            this.setState({ playingVideo: false })
                        }}
                        style={{ flex: 1 }}
                        resizeMode="contain"
                    />
                </View>
            );
        }
        return (
            <View style={{ flex: 1 }} >
                {
                    this.props.user?.user?.subscription_id ? null :
                        topBanner}
                <View style={{ flex: 1 }} >
                    <NavigationContainer>
                        <Stack.Navigator headerMode="none" >
                            {this.state.splash ? (
                                <Stack.Screen name="Splash" component={Splash} />
                            ) : this.props.logged_in ?
                                (
                                    <Stack.Screen name="Home" component={DrawerNavigator} />
                                ) : (
                                    <Stack.Screen name="Auth" component={AuthStackNavigator} />
                                )}
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
                {this.props.user?.user?.subscription_id ? null : banner}
                {this.props.user?.user?.subscription_id ? null : video}
            </View>
        );
    }
}


// const Navigation = () => {
//     let [splash, setSplash] = useState(true);
//     let [ads, setAds] = useState([]);
//     let [currentIndex, setCurrentIndexx] = useState(0);
//     // let [adIndex,setAdIndex]

//     const changeAd = () => {
//         let index = currentIndex;
//         setInterval(() => {
//             if (ads.length - 1 <= index) {
//                 setCurrentIndexx(prevIndex => prevIndex + 1);
//             }
//             else {
//                 setCurrentIndexx(0);
//             }
//         }, 10000);
//     }

//     const getAds = async () => {
//         const res = await config.getApi(config.apiAds(), config.defaultHeaders);
//         if (res.success == true) {
//             setAds(res.data);
//             changeAd();
//             setTimeout(() => {
//                 setSplash(false);
//             }, 3000);
//         }
//     }
//     useEffect(() => {
//         getAds();
//     }, [])
//     return (
//         <View style={{ flex: 1 }} >
//             <View style={{ flex: 1 }} >
//                 <NavigationContainer>
//                     <Stack.Navigator headerMode="none" >
//                         {splash ? (
//                             <Stack.Screen name="Splash" component={Splash} />
//                         ) : (
//                                 <Stack.Screen name="Home" component={DrawerNavigator} />
//                             )}
//                     </Stack.Navigator>
//                 </NavigationContainer>
//             </View>
//             {splash ? null : (
//                 <View style={{ height: 50, width: '100%', borderTopColor: "#ccc", borderTopWidth: 1 }} >
//                     <Image source={{ uri: config.imagesUrl + ads[currentIndex]?.file }} style={{ flex: 1 }} />
//                 </View>
//             )}
//         </View>
//     )
// };

const mapStateToProps = state => ({
    logged_in: state.is_logged_in,
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    Login: (user) => dispatch(LoginAction(user))
});



export default connect(mapStateToProps, mapDispatchToProps)(Navigation);