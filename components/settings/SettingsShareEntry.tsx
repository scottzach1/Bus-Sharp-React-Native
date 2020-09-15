import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";
import {Share} from "react-native";
// @ts-ignore Unfortunately it doesn't seem to find the import. Works totally fine however.
import Toast from "react-native-toast-message";

const SettingsShareEntry: FC = () => {
    const onShare = async () => {
        try {
            const result = await Share.share({
                title: "Bus Sharp",
                message: "Bus Sharp | The new way to track public transport in Wellington. Visit https://welly.live!",
                url: "https://welly.live",
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type.
                    console.log('success');
                } else {
                    // shared
                    console.log('success alt');
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed, copy to clip board.
            }
        } catch (e) {
            // Failed to open share API, resort to clipboard share.
            navigator.clipboard.writeText('https://welly.live')
                .then(() => {
                    Toast.show({
                        position: 'bottom',
                        type: 'info',
                        text1: 'Copied to clipboard',
                        visibilityTime: 4000,
                        autoHide: true
                    })
                })
                .catch(() => {
                    Toast.show({
                        position: 'bottom',
                        type: 'error',
                        text1: 'Failed to share or copy to clipboard',
                        visibilityTime: 4000,
                        autoHide: true
                    })
                })
        }
    }

    return (
        <ListItem key={"settings-feedback-entry"} onPress={() => onShare()}>
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