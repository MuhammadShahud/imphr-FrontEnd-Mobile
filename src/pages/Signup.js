import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Text, TextInput, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyHeader from '../components/MyHeader';
import config from '../config';
import { Button, Icon } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginAction } from '../redux/actions';
import { connect } from 'react-redux';

export class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            c_password: "",
            loading: false
        };
    }

    Signup = async () => {
        this.setState({ loading: true })
        var formData = {};
        formData["email"] = this.state.email;
        formData["name"] = this.state.name;
        formData["password"] = this.state.password;
        const res = await config.postApi(config.apiSignup(), config.defaultHeaders, JSON.stringify(formData));
        if (res) {
            let user = { user: res.data, token: res.token };
            AsyncStorage.setItem("IMPHR@USER", JSON.stringify(user));
            this.props.Login(user)
        }
        this.setState({ loading: false, });
    }

    Validations = () => {
        if (this.state.password != this.state.c_password) {
            alert("Password not match");
            return;
        }
        if (this.state.name == "" || this.state.email == "" || this.state.password == "" || this.state.c_password == "") {
            alert("Please fill all fields");
            return;
        }
        this.Signup();
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={{ padding: 15 }}>
                    <Button transparent onPress={() => this.props.navigation.goBack()} >
                        <Icon name="arrow-back" style={{color:config.primaryColor}} />
                    </Button>
                </View>
                <ScrollView>
                    <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: "5%", justifyContent: "center", marginVertical: 30 }}>
                        <Image source={require('../assets/logo.png')} style={{ width: "70%", height: 180, tintColor: "#db028f", alignSelf: "center", marginBottom: 30 }} resizeMode="stretch" />
                        <TextInput
                            onChangeText={(name) => this.setState({ name })}
                            style={[styles.textfield, { marginVertical: 10 }]}
                            placeholder="Full Name"
                            placeholderTextColor="#bbb"
                        />
                        <TextInput
                            onChangeText={(email) => this.setState({ email })}
                            style={[styles.textfield, { marginVertical: 10 }]}
                            placeholder="Email"
                            placeholderTextColor="#bbb"
                        />
                        <TextInput
                            onChangeText={(password) => this.setState({ password })}
                            style={[styles.textfield, { marginVertical: 10 }]}
                            placeholder="Password"
                            placeholderTextColor="#bbb"
                            secureTextEntry
                        />
                        <TextInput
                            onChangeText={(c_password) => this.setState({ c_password })}
                            style={[styles.textfield, { marginBottom: 17, marginTop: 10 }]}
                            placeholder="Confirm Password"
                            placeholderTextColor="#bbb"
                            secureTextEntry
                        />
                        <LinearGradient colors={[config.gradientLightColor, config.gradientDarkColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonCon}>
                            <TouchableOpacity onPress={this.Validations} disabled={this.state.loading} style={styles.button}>
                                <Text style={{ color: this.state.loading ? "#cccc" : "#fff", fontSize: 17 }}>SIGNUP</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        <TouchableOpacity style={{ alignSelf: "center", marginTop: 20 }} onPress={() => this.props.navigation.navigate("Login")}>
                            <Text>Already have an account? <Text style={{ color: "#db028f", fontWeight: "bold" }}>LOGIN</Text></Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
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
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
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
    Login: (user) => dispatch(LoginAction(user))
});



export default connect(mapStateToProps, mapDispatchToProps)(Signup);