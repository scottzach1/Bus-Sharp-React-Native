import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";

const SettingsFeedbackEntry: FC = () => {
    const mailto = "mailto:feedback@welly.live";

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