import React, {FC, useState} from "react";
import {Button} from "react-native-elements";
import {View} from "../styles/Themed";
import {doShare} from "../../external/ShareManager";
import {StackNavigationProp} from "@react-navigation/stack";
import {Route} from "react-native";
import CustomBottomSheet, {CustomBottomSheetProp} from "../common/CustomBottomSheet";
import {navigateToStopMap} from "../../navigation/LinkingConfiguration";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
    stopCode: string,
    stopName: any,
    saved: boolean,
    toggleSaved: () => void,
}

const StopActionButton: FC<Props> = (props) => {
    const [showSheet, setShowSheet] = useState<boolean>(false);
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
                console.log(props.route)
                navigateToStopMap(props.stopCode, props.navigation, props.route);
            },
            'map'
        ),
    ];

    const shareApp = async () => {
        const url = `https://welly.live/stop/${props.stopCode}`;

        await doShare(
            `Bus Sharp | Stop ${props.stopCode}`,
            `Bus Sharp | ${props.stopName} - (${props.stopCode}),  '${url}'!`,
            url,
        );
    }

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
