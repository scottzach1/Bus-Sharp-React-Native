import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";
import {Share, ToastAndroid} from "react-native";

const SettingsShareEntry: FC = () => {
    const onShare = async () => {
        try {
            const result = await Share.share({
                title: "Bus Sharp",
                message: "The new way to track public transport in Wellington.",
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
                // .then(() => this.setState({showToast: true}))
                .catch((e) => console.error(e))
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