import { Container, Content } from 'native-base';
import React from 'react';
import { Text } from 'react-native';
import MyHeader from '../components/MyHeader';
import config from '../config';
import HTML from 'react-native-render-html';

class Guidlines extends React.Component {

    constructor() {
        super();
        this.state = {
            guidelines: '',
            loading: true
        }
    }

    async componentDidMount() {
        try {
            const pages = await config.getPagesContent();
            this.setState({ guidelines: pages.guidelines });
        } catch (error) {
            console.warn(error);
        }
    }

    render() {
        return (
            <Container>
                <MyHeader title="Why You Need This App" navigation={this.props.navigation} back={true} drawer={true} />
                <Content contentContainerStyle={{ padding: 20 }} >
                    <HTML source={{ html: this.state.guidelines }} />
                </Content>
            </Container>
        )
    }
}

export default Guidlines;