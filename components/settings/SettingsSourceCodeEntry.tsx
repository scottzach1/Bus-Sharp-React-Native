import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";

const SettingsSourceCodeEntry: FC = () => {
    const url = "https://gitlab.ecs.vuw.ac.nz/late-for-the-bus/bus-sharp-react-native";

    return (
        <ListItem key={"settings-feedback-entry"} onPress={() => window.location.href = url}>
            <Icon name={"gitlab"} type={"material-community"}/>
            <ListItem.Content>
                <ListItem.Title>
                    View Source Code
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron/>
        </ListItem>
    )
}

export default SettingsSourceCodeEntry;