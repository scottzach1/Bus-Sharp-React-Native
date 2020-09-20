import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";
import * as WebBrowser from 'expo-web-browser';

/**
 * This component represents and entry within the settings screen containing a clickable mail link to send an email
 * with feedback.
 */
const SettingsFeedbackEntry: FC = () => {
    // Opens link using Expo web browser API.
    const openLink = async () => {
        await WebBrowser.openBrowserAsync("mailto:feedback@welly.live");
    }

    // Render styled clickable list item.
    return (
        <ListItem key={"settings-feedback-entry"} onPress={() => openLink()}>
            <Icon name={"help-circle"} type={"material-community"}/>
            <ListItem.Content>
                <ListItem.Title>
                    Help and Feedback
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron/>
        </ListItem>
    )
}

export default SettingsFeedbackEntry;
