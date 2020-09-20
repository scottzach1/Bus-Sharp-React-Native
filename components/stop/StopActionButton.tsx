import React, {FC, useState} from "react";
import {Button} from "react-native-elements";
import {View} from "../styles/Themed";
import {doShare} from "../../external/ShareManager";
import {StackNavigationProp} from "@react-navigation/stack";
import {Route} from "react-native";
import CustomBottomSheet, {CustomBottomSheetProp} from "../common/CustomBottomSheet";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
    stopCode: string,
    stopName: any,
    saved: boolean,
    toggleSaved: () => void,
}

/**
 * This component is responsible for handling the different actions regarding a stop. This component consists of a
 * button that when pressed, will load a bottom sheet with the user actions.
 *
 * NOTE: This only works on mobile.
 *
 * @param props - `Props` interface defined above.
 */
const StopActionButton: FC<Props> = (props) => {
    // State whether to show sheet.
    const [showSheet, setShowSheet] = useState<boolean>(false);

    // Components to pass the sheet.
    const actionList: CustomBottomSheetProp[] = [
        new CustomBottomSheetProp(
            'Save',
            () => props.toggleSaved(),
            (props.saved) ? "star" : "star-outline",
        ),
        new CustomBottomSheetProp(
            'Share',
            () => shareApp(),
            'share',
        ),
        new CustomBottomSheetProp(
            'View on Map',
            () => {
                console.log('TODO: This needs to be implemented, perhaps an optional URL prop?')
            },
            'map'
        ),
    ];

    // Handles sharing the specific stop via the share manager.
    const shareApp = async () => {
        const url = `https://welly.live/stop/${props.stopCode}`;

        await doShare(
            `Bus Sharp | Stop ${props.stopCode}`,
            `Bus Sharp | ${props.stopName} - (${props.stopCode}),  '${url}'!`,
            url,
        );
    }

    // Returns a button controlling an bottom sheet encompassed within a view.
    return (
        <View>
            <Button
                title={"Actions"}
                onPress={() => {
                    setShowSheet(true);
                }}
            />
            <CustomBottomSheet
                isVisible={showSheet}
                close={() => setShowSheet(false)}
                actionList={actionList}
            />
        </View>
    );
}

export default StopActionButton;
