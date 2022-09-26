import React from 'react';
import { Container, Spinner, View } from "native-base";
import { Alert } from "react-native";
import MyHeader from "./components/MyHeader";
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
    primaryColor: "#C31E85",
    headerColor: "#ED167F",
    statusBarColor: "#C31E85",
    gradientLightColor: "#EC1980",
    gradientDarkColor: "#8D288E",
    // apiBaseUrl: "http://192.168.0.114/imphr/api/",
    // imagesUrl: "http://192.168.0.114/imphr/public/uploaded_data/",
    //apiBaseUrl: "http://202.142.180.146:90/imphr/api/",
    //imagesUrl: 'http://202.142.180.146:90/imphr/public/uploaded_data/',
    apiBaseUrl: "https://ismypregnancyhighrisk.com/api/",
    imagesUrl: "https://ismypregnancyhighrisk.com/public/uploaded_data/",
    apiTests: () => config.apiBaseUrl + "tests",
    apiTestDetails: (id) => config.apiBaseUrl + "tests/" + id,
    apiAnswers: () => config.apiBaseUrl + "answers",
    apiPages: () => config.apiBaseUrl + "pages",
    apiAds: () => config.apiBaseUrl + "ads",
    apiQuestions: () => config.apiBaseUrl + "questions",
    apiLogin: () => config.apiBaseUrl + "login",
    apiSignup: () => config.apiBaseUrl + "signup",
    apiSubscribe: () => config.apiBaseUrl + "plan_subscribe",
    apiUpdateUser: () => config.apiBaseUrl + "user_update",
    defaultHeaders: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    getApi: async (url, headers) => {
        try {
            const res = await fetch(url, {
                headers
            });
            const resJson = await res.json();
            if (resJson.success) {
                return resJson;
            }
            else {
                setTimeout(() => {
                    Alert.alert("Error", resJson.message);
                }, 500);
                return false;
            }
        } catch (error) {
            console.warn(error.message);
        }
    },
    postApi: async (url, headers, data) => {
        try {
            const res = await fetch(url, {
                headers,
                body: data,
                method: "POST"
            });
            const resJson = await res.json();
            if (resJson.success) {
                return resJson;
            }
            else {
                console.warn(resJson);
                setTimeout(() => {
                    Alert.alert("Error", resJson.message);
                }, 500);
                return false;
            }
        } catch (error) {
            console.warn(error.message);
        }
    },
    loadingComponent: (title, navigation, back, drawer) => {
        return (
            <Container>
                <MyHeader title={title} navigation={navigation} back={back} drawer={drawer} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Spinner size="large" color={config.primaryColor} />
                </View>
            </Container>
        )
    },
    getPagesContent: async () => {
        const pages = JSON.parse(await AsyncStorage.getItem("@IMPHR:pages"));
        return pages;
    }
};

export default config;