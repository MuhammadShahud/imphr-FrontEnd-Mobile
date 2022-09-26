import { Body, Button, Container, Content, Icon, Input, Item, ListItem, Text, Title, View } from 'native-base';
import React from 'react';
import { FlatList, Linking, Modal, Platform, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeModal from 'react-native-modal';
import MyHeader from '../components/MyHeader';
import config from '../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from "@react-native-community/slider";
import HTML from 'react-native-render-html';

class RoutineTests extends React.Component {
    state = {
        loading: true,
        page: {}
    }

    componentDidMount() {
        this.getRoutineTest();
    }

    getRoutineTest = async () => {
        const page = await config.getPagesContent();
        this.setState({ page, loading: false });
    }

    render() {
        if (this.state.loading) {
            return config.loadingComponent("Routine Test", this.props.navigation, true, true);
        }
        return (
            <Container>
                <MyHeader title="Routine Test" navigation={this.props.navigation} back={true} drawer={true} />
                <Content contentContainerStyle={{ padding: 20 }} >
                    <HTML source={{ html: this.state.page.routine_test }} />
                </Content>
            </Container>
        )
    }
}

export default RoutineTests;