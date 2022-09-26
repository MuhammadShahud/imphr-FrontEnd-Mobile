import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Text, TextInput, Image, Platform, KeyboardAvoidingView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyHeader from '../components/MyHeader';
import config from '../config';
import { Button, Icon } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginAction, LogoutAction } from '../redux/actions';
import { connect } from 'react-redux';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loading: false
        };
    }


    Login = async () => {
        this.setState({ loading: true })
        var formData = {};
        formData["email"] = this.state.email;
        formData["password"] = this.state.password;
        const res = await config.postApi(config.apiLogin(), config.defaultHeaders, JSON.stringify(formData));
        if (res) {
            let user = { user: res.data, token: res.token };
            AsyncStorage.setItem("IMPHR@USER", JSON.stringify(user));
            this.props.Login(user)
        }
        this.setState({ loading: false, });
    }

    Validations = () => {
        if (this.state.email == "" || this.state.password == "") {
            alert("Please fill all fields");
            return;
        }
        this.Login();
    }


    render() {
        return (
            <KeyboardAvoidingView style={{flex:1}} behavior="padding">
            <View style={styles.container}>
                <View style={{ padding: 15 }}>
                    <Button transparent onPress={() => this.props.Login(null)} >
                        <Icon name="arrow-back" style={{color:config.primaryColor}} />
                    </Button>
                </View>
                <View style={{ flex: 2, backgroundColor: "#fff", paddingHorizontal: "5%", justifyContent: "center" }}>
                    <Image source={require('../assets/logo.png')} style={{ width: "70%", height: 180, tintColor: "#db028f", alignSelf: "center", marginBottom: 30 }} resizeMode="stretch" />
                    <TextInput
                        onChangeText={(email) => this.setState({ email })}
                        style={[styles.textfield, { marginVertical: 10 }]}
                        placeholder="Email"
                        placeholderTextColor="#bbb"
                    />
                    <TextInput
                        onChangeText={(password) => this.setState({ password })}
                        style={[styles.textfield, { marginBottom: 17 }]}
                        placeholder="Password"
                        placeholderTextColor="#bbb"
                        secureTextEntry
                    />
                    <LinearGradient colors={[config.gradientLightColor, config.gradientDarkColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonCon}>
                        <TouchableOpacity onPress={this.Validations} disabled={this.state.loading} style={styles.button}>
                            <Text style={{ color: this.state.loading ? "#cccc" : "#fff", fontSize: 17 }}>LOGIN</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <TouchableOpacity style={{ alignSelf: "center", marginTop: 20 }} onPress={() => this.props.navigation.navigate("Signup")}>
                        <Text>Don't have an account? <Text style={{ color: "#db028f", fontWeight: "bold" }}>SIGNUP</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    textfield: {
        shadowColor: "#ccc",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        shadowOffset: {
            width: 3,
            height: 3
        },
        elevation: 5,
        backgroundColor: "#fff",
        borderRadius: 5,
        paddingHorizontal: 10,
        ...Platform.OS == "ios" ?
            {
                height: 50
            } : {}
    },
    button: {
        padding: 15,
        ...Platform.OS == "android" ?
            {
                flex: 1,
            } : {},
        justifyContent: "center",
        alignItems: "center",
    },
    buttonCon: {
        borderRadius: 5,
        justifyContent: "center",
        overflow: "hidden"
    }
});

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => ({
    Login: (user) => dispatch(LoginAction(user)),
});



export default connect(mapStateToProps, mapDispatchToProps)(Login);
