import { Container, Content } from 'native-base';
import React from 'react';
import MyHeader from '../components/MyHeader';
import config from '../config';
import HTML from 'react-native-render-html';

class About extends React.Component {

    constructor() {
        super();
        this.state = {
            about: '',
            loading: true
        }
    }

    async componentDidMount() {
        const pages = await config.getPagesContent();
        console.warn(pages);
        this.setState({ about: pages.about });
    }

    render() {
        return (
            <Container>
                <MyHeader title="About Us" navigation={this.props.navigation} drawer />
                <Content contentContainerStyle={{ padding: 20 }} >
                    <HTML source={{ html: this.state.about }} />
                </Content>
            </Container>
        )
    }

}

export default About;