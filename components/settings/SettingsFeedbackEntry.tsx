import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";

/**
 * This component represents and entry within the settings screen containing a clickable mail link to send an email
 * with feedback.
 */
const SettingsFeedbackEntry: FC = () => {
    const mailto = "mailto:feedback@welly.live"; // BROKEN on mobile, switch to `<Hyperlink/>`

    // Render styled clickable list item.
    return (
        <ListItem key={"settings-feedback-entry"} onPress={() => window.location.href = mailto}>
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
