import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";

/**
 * This component represents an entry within the settings screen containing a clickable link to direct the users to the
 * source code.
 */
const SettingsSourceCodeEntry: FC = () => {
    // BROKEN on mobile, switch to `<Hyperlink/>`
    const url = "https://gitlab.ecs.vuw.ac.nz/late-for-the-bus/bus-sharp-react-native";

    // Render styled clickable list item.
    return (
        <ListItem key={"settings-sourcecode-entry"} onPress={() => window.location.href = url}>
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
