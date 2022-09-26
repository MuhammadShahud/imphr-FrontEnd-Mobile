import { Container } from 'native-base';
import React from 'react';
import MyHeader from '../components/MyHeader';

class Contact extends React.Component {

    render() {
        return (
            <Container>
                <MyHeader title="Contact Us" navigation={this.props.navigation} drawer />
            </Container>
        )
    }

}

export default Contact;