import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";

/**
 * This component represents an entry within the settings screen containing the version number. This has been separated
 * into its own component to tidy the code within the parent component.
 */
const SettingsVersionEntry: FC = () => {
    // Return styled list item.
    return (
        <ListItem key={"settings-version-entry"}>
            <Icon name={"react"} type={"material-community"}/>
            <ListItem.Content>
                <ListItem.Title>
                    Version 0.0.1 (alpha)
                </ListItem.Title>
            </ListItem.Content>
        </ListItem>
    );
}

export default SettingsVersionEntry;
