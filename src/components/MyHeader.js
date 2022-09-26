import { Body, Button, Header, Icon, Left, Right, Title } from 'native-base';
import React from 'react';
import { Dimensions, StatusBar } from "react-native";
import PropTypes from 'prop-types';
import config from '../config';
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");


/**
 * @augments React.Component<Props,State>
 */
class MyHeader extends React.Component {

    render() {
        let left = null, right = null;
        if (this.props.back) {
            left = (
                <Button transparent onPress={() => this.props.navigation.goBack()} >
                    <Icon name="arrow-back" />
                </Button>
            )
        }
        if (this.props.drawer) {
            right = (
                <Button transparent onPress={() => this.props.navigation.openDrawer()} >
                    <Icon name="menu" color='#fff' style={{color:"#fff"}} />
                </Button>
            )
        }
        return (
            <LinearGradient colors={[config.gradientLightColor, config.gradientDarkColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{}} >
                <SafeAreaView>
                    <Header style={{ backgroundColor: "transparent", elevation: 0 }} androidStatusBarColor="transparent" translucent >
                        <Left style={{ flex: 0, width: width * 0.15 }} >{left}</Left>
                        <Body style={{ flex: 0, width: width * 0.7, alignItems: "center" }} >
                            <Title style={{ textAlign: "center",color:"#fff" }} >{this.props.title}</Title>
                        </Body>
                        <Right style={{ flex: 0, width: width * 0.15 }} >{right}</Right>
                    </Header>
                </SafeAreaView>
            </LinearGradient>
        )
    }

}

MyHeader.propTypes = {
    title: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    back: PropTypes.bool,
    drawer: PropTypes.bool
}

export default MyHeader;