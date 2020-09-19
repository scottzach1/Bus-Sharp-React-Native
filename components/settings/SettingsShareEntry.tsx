import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";
import {doShare} from "../../external/ShareManager";

const SettingsShareEntry: FC = () => {
    const shareApp = async () => {
        await doShare(
            `Bus Sharp`,
            `Bus Sharp | The new way to track public transport in Wellington. Visit 'https://welly.live'!`,
            `https://welly.live`,
        );
    }

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
