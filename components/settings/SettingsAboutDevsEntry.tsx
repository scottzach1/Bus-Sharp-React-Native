import {ListItem} from "react-native-elements";
import React, {FC} from "react";

const SettingsAboutDevsEntry: FC = () => {
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