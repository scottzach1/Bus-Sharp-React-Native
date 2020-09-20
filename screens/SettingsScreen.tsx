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
import SettingsShareEntry from "../components/settings/SettingsShareEntry";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
}

/**
 * This screen is responsible for handling any settings related options for the app, as well as link to hidden
 * perspectives of the app (Twitter), access Account screens for data syncing and notify the user of any updates.
 */
class SettingsScreen extends Component<Props, State> {
    render() {
        return (
            <ScrollView>
                {/* Settings Options and Links */}
                <Card>
                    <Card.Title>General</Card.Title>
                    <Card.Divider/>
                    <SettingsFeedbackEntry/>
                    <SettingsSourceCodeEntry/>
                    <SettingsAccountEntry navigation={this.props.navigation}/>
                    <SettingsTwitterFeedEntry navigation={this.props.navigation}/>
                    <SettingsShareEntry/>
                </Card>
                {/* Display information about the app */}
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
