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
    serviceCode: string,
    serviceName: any,
    saved: boolean,
    toggleSaved: () => void,
}

const ServiceActionButton: FC<Props> = (props) => {
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
    ];

    const shareApp = async () => {
        const url = `https://welly.live/service/${props.serviceCode}`;

        console.log("URL", url)

        await doShare(
            `Bus Sharp | Service ${props.serviceCode}`,
            `Bus Sharp | ${props.serviceName} - (${props.serviceCode}),  ${url}!`,
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

export default ServiceActionButton;
