import { Container, Content } from 'native-base';
import React from 'react';
import { Linking, Text } from 'react-native';
import MyHeader from '../components/MyHeader';
import config from '../config';
import HTML from 'react-native-render-html';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'

class Terms extends React.Component {

    constructor() {
        super();
        this.state = {
            terms: '',
            loading: true
        }
    }

    async componentDidMount() {
        try {
            const pages = await config.getPagesContent();
            this.setState({ terms: pages.terms });
        } catch (error) {
            console.warn(error);
        }
    }

    openLink = async (link) => {
        try {
            const url = link;
            if (await InAppBrowser.isAvailable()) {
                const result = await InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'cancel',
                    preferredBarTintColor: config.gradientLightColor,
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    animated: true,
                    modalPresentationStyle: 'fullScreen',
                    modalTransitionStyle: 'coverVertical',
                    modalEnabled: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    toolbarColor: '#6200EE',
                    secondaryToolbarColor: 'black',
                    navigationBarColor: 'black',
                    navigationBarDividerColor: 'white',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false,
                    // Specify full animation resource identifier(package:anim/name)
                    // or only resource name(in case of animation bundled with app).
                    animations: {
                        startEnter: 'slide_in_right',
                        startExit: 'slide_out_left',
                        endEnter: 'slide_in_left',
                        endExit: 'slide_out_right'
                    },
                    headers: {
                        'my-custom-header': 'my custom header value'
                    }
                })
                Alert.alert(JSON.stringify(result))
            }
            else Linking.openURL(url)
        } catch (error) {
            Alert.alert(error.message)
        }
    }

    render() {
        return (
            <Container>
                <MyHeader title="Terms &amp; Conditions" navigation={this.props.navigation} back={true} drawer={true} />
                <Content contentContainerStyle={{ padding: 20 }} >
                    <HTML
                        onLinkPress={(e, href) => {
                            console.warn("asdsadasd")
                            this.openLink(href)
                        }}
                        source={{ html: this.state.terms }} />
                    {/* <Text style={{ textAlign: 'center' }} >
                        {this.state.terms}
                    </Text> */}
                </Content>

            </Container>
        )
    }
}

export default Terms;