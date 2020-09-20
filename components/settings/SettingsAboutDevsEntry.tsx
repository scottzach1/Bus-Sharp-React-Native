import {ListItem} from "react-native-elements";
import React, {FC} from "react";

/**
 * This component represents an entry within the settings screen containing information about the developers.
 */
const SettingsAboutDevsEntry: FC = () => {
    // Render styled clickable list item.
    return (
        <ListItem key={"settings-developers-entry"}>
            <ListItem.Content>
                <ListItem.Title>
                    Developed by Zac Scott and Harrison Cook, aka 'Late For The Bus'.
                </ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
}

export default SettingsAboutDevsEntry;
