import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackActions } from '@react-navigation/routers';
import React, { Component } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { connect } from 'react-redux';
import config from '../config'
import { LogoutAction } from '../redux/actions';

class Logout extends Component {
    componentDidMount(){
        this.props.navigation.addListener('focus', () => {
            AsyncStorage.removeItem("IMPHR@USER");
            this.props.Logout()   
          });
    }
    render() {
        return (
            <View style={{ justifyContent: "center", alignItems: "center",flex:1 }}>
                <ActivityIndicator size={70} color={config.primaryColor} />
            </View>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    Logout: () => dispatch(LogoutAction())
});



export default connect(null,mapDispatchToProps)(Logout);
