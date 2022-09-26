import { Container, Content } from 'native-base';
import React from 'react';
import { Text } from 'react-native';
import MyHeader from '../components/MyHeader';
import config from '../config';
import HTML from 'react-native-render-html';

class Privacy extends React.Component {

    constructor() {
        super();
        this.state = {
            privacy: '',
            loading: true
        }
    }

    async componentDidMount() {
        try {
            const pages = await config.getPagesContent();
            this.setState({ privacy: pages.privacy });
        } catch (error) {
            console.warn(error);
        }
    }

    render() {
        return (
            <Container>
                <MyHeader title="Privacy Policy" navigation={this.props.navigation} back={true} drawer={true} />
                <Content contentContainerStyle={{ padding: 20 }} >
                    <HTML source={{ html: this.state.privacy }} />
                    {/* <Text style={{ textAlign: 'center' }} >
                        {this.state.privacy}
                    </Text> */}
                </Content>
            </Container>
        )
    }
}

export default Privacy;