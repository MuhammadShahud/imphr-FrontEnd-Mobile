import { Body, Button, Container, Content, Icon, Input, Item, ListItem, Text, Title, View } from 'native-base';
import React from 'react';
import { FlatList, Linking, Modal, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeModal from 'react-native-modal';
import MyHeader from '../components/MyHeader';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from "@react-native-community/slider";
import HTML from 'react-native-render-html';
import * as RNIap from 'react-native-iap';
import { connect } from 'react-redux';
import { UpdateAction } from '../redux/actions';




class Home extends React.Component {

    state = {
        disclaimerModal: false,
        pagesContent: {
            guidelines: '',
            terms: '',
            privacy: '',
            disclaimer: '',
            about: ''
        },
        loading: true,
    }

    async componentDidMount() {
        await this.setupListeners();
        await this.getPages();
        if (this.props.user)
            RNIap.initConnection().then((value) => {
                this.getPurchases();
            })
    }

    setupListeners = async () => {
        if (Platform.OS == "android") {
            const url = await Linking.getInitialURL();
            // console.warn(url);
            if (url) {
                this.navigate(url);
            }
        } else {
            Linking.addEventListener('url', this.handleOpenURL);
        }
    }

    handleOpenURL = (event) => { // D
        if (event.url) {
            this.navigate(event.url);
        }
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    navigate = (url) => { // E
        const { navigate } = this.props.navigation;
        let pageParts = url.split("://")[1];
        let pageName = pageParts.split("/")[1];
        if (pageName == "answers") {
            // let test_id = pageParts.split("/")[2];
            let question_ids = pageParts.split("/")[2];
            question_ids = question_ids.split(",");
            navigate("Answers", {
                // test_id,
                question_ids
            });
        }
    }

    getPages = async () => {
        const res = await config.getApi(config.apiPages(), config.defaultHeaders);
        await AsyncStorage.setItem("@IMPHR:pages", JSON.stringify(res.data));
        this.setState({ pagesContent: res.data, loading: false, disclaimerModal: true });
    }

    getPurchases = async () => {
        try {
            const purchases = await RNIap.getAvailablePurchases();
            if (purchases.length > 0) {
                purchases.forEach(purchase => {
                    if (this.props.user.user.subscription_id == purchase.productId) {
                        let user = { user: { ...this.props.user.user, subscription_id: purchase.productId } };
                        this.props.UpdateUser(user)
                    }
                })
            }
            else {
                let user = { user: { ...this.props.user.user, subscription_id: null } };
                this.props.UpdateUser(user)
            }


        } catch (err) {
            console.warn(err); // standardized err.code and err.message available
        }
    }

    render() {
        if (this.state.loading) {
            return config.loadingComponent("Home", this.props.navigation, false, true);
        }
        return (
            <Container>
                <MyHeader title="Home" navigation={this.props.navigation} drawer />
                <Content contentContainerStyle={{ padding: 20 }} >
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Tests")} >
                        <View style={{ backgroundColor: "#000", width: '100%', height: 200, alignItems: "center", justifyContent: "center" }} >
                            <Icon name="file-signature" type="FontAwesome5" style={{ color: config.primaryColor }} />
                            <Text style={{ color: "#FFF", fontSize: 22, marginTop: 10 }} >Routine Tests</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("IMPHR")} style={{ marginTop: 20 }} >
                        <View style={{ backgroundColor: "#000", width: '100%', height: 200, alignItems: "center", justifyContent: "center" }} >
                            <Icon name="help-with-circle" type="Entypo" style={{ color: config.primaryColor }} />
                            <Text style={{ color: "#FFF", fontSize: 22, marginTop: 10 }} >Is My Pregnancy High Risk?</Text>
                        </View>
                    </TouchableOpacity>
                </Content>
                <ReactNativeModal transparent isVisible={this.state.disclaimerModal} style={{ marginHorizontal: 0 }} >
                    <LinearGradient colors={[config.gradientLightColor, config.gradientDarkColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '100%' }} >
                        <View style={{ backgroundColor: 'transparent', paddingHorizontal: 30, paddingVertical: 80, width: '100%' }} >
                            <Text style={{ color: "#FFF", textAlign: "center", width: '100%', fontSize: 24 }} >Disclaimer</Text>
                            <ScrollView style={{ height: 200 }} >
                                <HTML source={{ html: this.state.pagesContent.disclaimer }} baseFontStyle={{ color: "#FFF" }} />
                                {/* <Text style={{ color: "rgba(255,255,255,0.7)", textAlign: "center", width: '100%', marginTop: 10 }} note >{this.state.pagesContent.disclaimer}</Text> */}
                            </ScrollView>
                            <View style={{ alignSelf: "center", marginTop: 20, marginHorizontal: 50 }} >
                                <Button style={{ backgroundColor: "#FFF", width: '100%' }} block >
                                    <Text style={{ color: "#000", width: '100%', textAlign: 'center' }} onPress={() => this.setState({ disclaimerModal: false })} >I Agree</Text>
                                </Button>
                            </View>
                        </View>
                    </LinearGradient>
                </ReactNativeModal>
            </Container>
        )
    }

}

const styles = StyleSheet.create({
    testItem: { backgroundColor: '#EFEFEF', marginLeft: 0, paddingHorizontal: 20, marginBottom: 5, borderWidth: 0 }
})

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => ({
    UpdateUser: (user) => dispatch(UpdateAction(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
