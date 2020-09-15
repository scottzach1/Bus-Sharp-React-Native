import React, {Component} from "react";
import {View} from "react-native";
import {Card} from "react-native-elements";
import SettingsFeedbackEntry from "../components/settings/SettingsFeedbackEntry";

interface Props {
}

interface State {
}

class SettingsScreen extends Component<Props, State> {
    render() {
        return (
            <View>
                <Card>
                    <Card.Title>General</Card.Title>
                    <Card.Divider/>
                    <SettingsFeedbackEntry/>
                </Card>
            </View>
        );
    }
}

export default SettingsScreen;