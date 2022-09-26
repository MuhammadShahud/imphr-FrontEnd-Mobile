import { Body, Button, Container, Icon, ListItem, View } from 'native-base';
import React from 'react';
import MyHeader from '../components/MyHeader';
import config from '../config';
import HTML from 'react-native-render-html'
import { FlatList, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const submitColors = [config.gradientLightColor, config.gradientDarkColor];
const yesColors = [config.gradientLightColor, config.gradientDarkColor];
const noColors = ['#A5A5A5', '#A5A5A5'];
const startPos = { x: 0, y: 0 };
const endPos = { x: 1, y: 0 };

class IMPHR extends React.Component {
    state = {
        loading: true,
        pages: {},
        questions: [],
        question_ids: []
    }

    componentDidMount() {
        this.getContent();
    }

    getContent = async () => {
        const page = await config.getPagesContent();
        const questions = await config.getApi(config.apiQuestions(), config.defaultHeaders);
        this.setState({ pages: page, questions: questions.data, loading: false });
    }

    _renderItem = ({ item, index }) => {
        let added = this.state.question_ids[index] == item.id;
        return (
            <ListItem>
                <Body>
                    <View style={{ flexDirection: 'row' }} >
                        <Icon name="check" type="Entypo" style={styles.questionIcon} />
                        <View style={{ marginLeft: 10, flex: 1 }} >
                            <Text style={styles.questionNum} >Question # {item.question_number.toString().padStart(2, "0")}</Text>
                            <HTML source={{ html: item.question }} containerStyle={styles.question} />
                            {/* <Text style={styles.question} >{item.question}</Text> */}
                            <View style={styles.buttonsContainer} >
                                <LinearGradient style={styles.yesLinearGradientStyle} colors={added ? yesColors : noColors} start={startPos} end={endPos} >
                                    <Button style={styles.buttonContainer} transparent
                                        onPress={() => {
                                            let allQuestionIds = this.state.question_ids;
                                            allQuestionIds[index] = item.id;
                                            this.setState({ question_ids: allQuestionIds })
                                        }}
                                    >
                                        <Text style={styles.butotnText} >YES</Text>
                                    </Button>
                                </LinearGradient>
                                <LinearGradient style={styles.noLinearGradientStyle} colors={!added ? yesColors : noColors} start={startPos} end={endPos} >
                                    <Button style={styles.buttonContainer} transparent
                                        onPress={() => {
                                            let allQuestionIds = this.state.question_ids;
                                            allQuestionIds[index] = null;
                                            this.setState({ question_ids: allQuestionIds })
                                        }}
                                    >
                                        <Text style={styles.butotnText} >NO</Text>
                                    </Button>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>
                </Body>
            </ListItem>
        );
    }

    submit = () => {
        this.props.navigation.navigate("Answers", { question_ids: this.state.question_ids });
        // console.warn(this.state.test_id);
        // console.warn(this.state.question_ids);
    }

    render() {
        if (this.state.loading) {
            return config.loadingComponent("Is My Pregnancy High Risk", this.props.navigation, true, true);
        }
        return (
            <Container>
                <MyHeader title="Is My Pregnancy High Risk" navigation={this.props.navigation} back={true} drawer={true} />
                <View style={{ padding: 20 }}  >
                    <HTML source={{ html: this.state.pages.questions_info }} />
                </View>
                <FlatList
                    style={{}}
                    data={this.state.questions}
                    keyExtractor={item => item.id.toString()}
                    renderItem={this._renderItem}
                    ListEmptyComponent={() => (
                        <Text style={{ width: '100%', textAlign: "center", marginVertical: 10 }} >No Questions Found</Text>
                    )}
                    ListFooterComponent={() => {
                        if (this.state.questions.length > 0) {
                            return (
                                <LinearGradient colors={submitColors} start={startPos} end={endPos} style={{ marginLeft: 18, marginRight: 18, marginTop: 20 }} >
                                    <Button transparent onPress={this.submit} >
                                        <Text style={styles.butotnText} >SUBMIT</Text>
                                    </Button>
                                </LinearGradient>
                            );
                        }
                        else {
                            return null;
                        }
                    }}
                />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    questionIcon: { color: config.gradientLightColor, fontSize: 20, marginTop: 3 },
    questionNum: { fontWeight: "bold", fontSize: 18 },
    qeustion: { fontWeight: 'bold', fontSize: 15, marginTop: 5 },
    yesLinearGradientStyle: { flex: 1, marginRight: 5 },
    noLinearGradientStyle: { flex: 1, marginLeft: 5 },
    buttonsContainer: { flexDirection: 'row', width: '100%', marginTop: 20 },
    buttonContainer: { flex: 1, alignItems: 'center' },
    butotnText: { color: "#FFF", textAlign: "center", flex: 1 },
    question: { width: '100%' }
});

export default IMPHR;