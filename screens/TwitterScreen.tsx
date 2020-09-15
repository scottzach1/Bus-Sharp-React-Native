import React, {Component} from "react";
import TwitterFeedContainer from "../components/twitter/TwitterFeedContainer";
import {Card} from "react-native-elements";
import {ScrollView} from "react-native";

interface Props {
}

interface State {
}

class TwitterScreen extends Component<Props, State> {
    render() {
        return (
            <ScrollView>
                <Card>
                    <Card.Title>
                        Metlink Wellington
                    </Card.Title>
                    <Card.Divider/>
                    <TwitterFeedContainer/>
                </Card>
            </ScrollView>
        );
    }
}

export default TwitterScreen;