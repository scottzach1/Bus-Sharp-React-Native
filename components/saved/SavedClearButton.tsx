import React, {FC} from "react";
import {Button} from "react-native-elements";
import {Alert, Platform} from "react-native";


interface Props {
    doClear: () => void
    type: "stops" | "services"
}

const SavedClearButton: FC<Props> = (props) => {

    const typeName = (props.type === "stops") ? "Stops" : "Services";

    const confirmClearButton = () => {
        if (Platform.OS !== 'web') {
            // Show fancy alert (not supported on web)
            Alert.alert(
                `Clear Saved ${typeName}.`,
                'Are you sure?'
                ,
                [{
                    text: 'Yes',
                    onPress: () => props.doClear()
                }, {
                    text: 'Cancel',
                    onPress: () => {
                    },
                    style: "cancel"
                }],
            );
        } else {
            // Fallback for web.
            props.doClear();
        }
    }

    return (
        <Button title={`Clear ${typeName}`} onPress={() => confirmClearButton()}/>
    );
}

export default SavedClearButton;