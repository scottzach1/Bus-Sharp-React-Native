import React, {FC} from "react";
import {Icon, ListItem, ThemeProvider} from "react-native-elements";

const theme = {
    colors: {
        platform: {
            "default": {
                "grey": "#FFF"
            }
        }
    }
};

const SettingsFeedbackEntry: FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <ListItem key={"settings-feedback-entry"} onPress={() => window.location.href="mailto:feedback@welly.live"}>
                <Icon name={"material-community-help-circle"}/>
                <ListItem.Content>
                    <ListItem.Title>
                        Help and Feedback
                    </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron/>
            </ListItem>
        </ThemeProvider>
    )
}

export default SettingsFeedbackEntry;