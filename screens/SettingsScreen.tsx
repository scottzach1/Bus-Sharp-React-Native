import React, {Component} from "react";
import {Card, ThemeProvider} from "react-native-elements";
import SettingsFeedbackEntry from "../components/settings/SettingsFeedbackEntry";
import {View} from "../components/common/Themed";
import SettingsSourceCodeEntry from "../components/settings/SettingsSourceCodeEntry";
import SettingsShareEntry from "../components/settings/SettingsShareEntry";

const theme = {
    colors: {
        platform: {
            "default": {
                "grey": "#FFF"
            }
        }
    }
};

interface Props {
}

interface State {
}

class SettingsScreen extends Component<Props, State> {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <View>
                    <Card>
                        <Card.Title>General</Card.Title>
                        <Card.Divider/>
                        <SettingsFeedbackEntry/>
                        <SettingsSourceCodeEntry/>
                        <SettingsShareEntry/>
                    </Card>
                </View>
            </ThemeProvider>
        );
    }
}

export default SettingsScreen;