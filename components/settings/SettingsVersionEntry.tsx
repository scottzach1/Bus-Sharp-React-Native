import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";

const SettingsVersionEntry: FC = () => {
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