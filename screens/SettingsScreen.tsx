import React, {Component} from "react";
import {Card} from "react-native-elements";
import SettingsFeedbackEntry from "../components/settings/SettingsFeedbackEntry";
import {View} from "../components/common/Themed";
import SettingsSourceCodeEntry from "../components/settings/SettingsSourceCodeEntry";
import SettingsShareEntry from "../components/settings/SettingsShareEntry";
import SettingsTwitterFeedEntry from "../components/settings/SettingsTwitterFeedEntry";
import {Route} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import SettingsVersionEntry from "../components/settings/SettingsVersionEntry";
import SettingsAboutDevsEntry from "../components/settings/SettingsAboutDevsEntry";
import SettingsAccountEntry from "../components/settings/SettingsAccountEntry";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
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
                    <SettingsSourceCodeEntry/>
                    <SettingsAccountEntry navigation={this.props.navigation}/>
                    <SettingsTwitterFeedEntry navigation={this.props.navigation}/>
                    <SettingsShareEntry/>
                </Card>
                <Card>
                    <Card.Title>About</Card.Title>
                    <Card.Divider/>
                    <SettingsVersionEntry/>
                    <SettingsAboutDevsEntry/>
                </Card>
            </View>
        );
    }
}

export default SettingsScreen;