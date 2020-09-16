import {Route, ScrollView} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {Card} from "react-native-elements";
import SettingsFeedbackEntry from "../components/settings/SettingsFeedbackEntry";
import SettingsSourceCodeEntry from "../components/settings/SettingsSourceCodeEntry";
import SettingsAccountEntry from "../components/settings/SettingsAccountEntry";
import SettingsTwitterFeedEntry from "../components/settings/SettingsTwitterFeedEntry";
import SettingsAboutDevsEntry from "../components/settings/SettingsAboutDevsEntry";
import SettingsVersionEntry from "../components/settings/SettingsVersionEntry";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
}

class SettingsScreen extends Component<Props, State> {
    render() {
        return (
            <ScrollView>
                <Card>
                    <Card.Title>General</Card.Title>
                    <Card.Divider/>
                    <SettingsFeedbackEntry/>
                    <SettingsSourceCodeEntry/>
                    <SettingsAccountEntry navigation={this.props.navigation}/>
                    <SettingsTwitterFeedEntry navigation={this.props.navigation}/>
                    {/*<SettingsShareEntry/>*/}
                </Card>
                <Card>
                    <Card.Title>About</Card.Title>
                    <Card.Divider/>
                    <SettingsVersionEntry/>
                    <SettingsAboutDevsEntry/>
                </Card>
            </ScrollView>
        );
    }
}

export default SettingsScreen;