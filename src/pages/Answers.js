import { Button, Container, Footer, FooterTab, Icon, Toast, View } from 'native-base';
import React from 'react';
import { Alert, FlatList, Share, Text, Dimensions } from 'react-native';
import MyHeader from '../components/MyHeader';
import config from '../config';
import { captureScreen } from 'react-native-view-shot';
import RNPrint from 'react-native-print';
import HTML from 'react-native-render-html';

const { width, height } = Dimensions.get("window");

class Answers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            question_ids: props.route.params.question_ids,
            answers: [],
        }
    }

    componentDidMount() {
        this.getContent();
        this.getAnswers();
    }

    getContent = async () => {
        const page = await config.getPagesContent();
        this.setState({ pages: page });
    }

    getAnswers = async () => {
        let data = {
            question_ids: []
        };
        let question_ids = [];
        this.state.question_ids.map(question_id => {
            if (question_id) {
                question_ids.push(question_id.toString().trim());
            }
        });
        data['question_ids'] = question_ids;
        if (data.question_ids.length > 0) {
            const res = await config.postApi(config.apiAnswers(), config.defaultHeaders, JSON.stringify(data));
            this.setState({ answers: res.data, loading: false });
        }
        else {
            Alert.alert("Message", 'No Questions were selected!', [{
                text: "Ok",
                onPress: () => this.props.navigation.goBack()
            }])
        }
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ width: '90%', alignSelf: "center", paddingHorizontal: 10, paddingVertical: 20, marginBottom: 5 }} >
                {/* <Text style={{ textAlign: "center", color: config.primaryColor, width: '100%', backgroundColor: 'blue' }} > */}
                <HTML source={{ html: "Question #" + item.question.question_number + ": " + item.answer_question }} baseFontStyle={{ color: config.primaryColor }} containerStyle={{ width: '100%' }} />
                {/* </Text> */}
                <HTML source={{ html: "Answer: " + item.answer }} containerStyle={{ marginTop: 5, width: '100%' }} />
            </View>
        )
    }

    share = async () => {
        await Share.share({
            message: "Disease info share " + "http://imphr/answers/" + this.state.question_ids.join(","),
            url: "http://imphr/answers/" + this.state.question_ids.join(","),
            title: "Share"
        });
        Toast.show({ text: "Shared Successfully!", textStyle: { alignSelf: "center" } });
    }

    print = async () => {
        const photoUri = await captureScreen();
        const html = `<div style='display:flex;flex:1;align-items:center;justify-content:center;height:100%' ><img src='${photoUri}' style='height:${height};width:${width};object-fit:contain;' /></div>`;
        await RNPrint.print({ html });
        Toast.show({ text: "Done!", textStyle: { alignSelf: "center" } });
    }

    render() {
        if (this.state.loading) {
            return config.loadingComponent("Answers", this.props.navigation, true, true);
        }
        return (
            <Container>
                <MyHeader title="Answers" navigation={this.props.navigation} back={true} drawer={true} />
                <Text style={{ width: '100%', backgroundColor: "#F2F6F6", color: config.primaryColor, fontWeight: 'bold', textAlign: 'center', paddingVertical: 10 }} >Your overall testing plan</Text>
                {/* <ViewShot ref={ref => this.viewShot = ref} options={{ format: "jpg", quality: 0.9 }} > */}
                <View style={{ padding: 20 }}  >
                    <HTML source={{ html: this.state.pages.answers_info }} />
                </View>
                <FlatList
                    style={{ backgroundColor: "#FFFAF8" }}
                    data={this.state.answers}
                    keyExtractor={item => item.id.toString()}
                    renderItem={this._renderItem}
                />
                {/* </ViewShot> */}
                <Footer>
                    <FooterTab style={{ backgroundColor: "#FFF" }} >
                        <Button onPress={this.print} >
                            <Icon name="printer" style={{ color: "#000" }} type="AntDesign" />
                            <Text>Print</Text>
                        </Button>
                    </FooterTab>
                    <FooterTab style={{ backgroundColor: "#FFF" }}>
                        <Button onPress={this.share} >
                            <Icon name="sharealt" style={{ color: "#000" }} type="AntDesign" />
                            <Text>Share</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

export default Answers;