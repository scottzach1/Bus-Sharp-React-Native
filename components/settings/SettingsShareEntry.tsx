import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";
import {doShare} from "../../external/ShareManager";

/**
 * This component represents an entry within the settings screen. When clicked, this will call the `ShareManager`
 * and attempt to share the app via the React Share API, with the clipboard as a fallback.
 */
const SettingsShareEntry: FC = () => {
    // Call ShareManager and attempt to use the React Share API (clipboard otherwise).
    const shareApp = async () => {
        await doShare(
            `Bus Sharp`,
            `Bus Sharp | The new way to track public transport in Wellington. Visit 'https://welly.live'!`,
            `https://welly.live`,
        );
    }
    // Return styled clickable list item.
    return (
        <ListItem key={"settings-share-entry"} onPress={() => shareApp()}>
            <Icon name={"share"} type={"material-community"}/>
            <ListItem.Content>
                <ListItem.Title>
                    Share
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron/>
        </ListItem>
    )
}

export default SettingsShareEntry;
