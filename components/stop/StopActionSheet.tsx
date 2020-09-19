import React, {FC, useState} from "react";
import {BottomSheet, Button, Icon, ListItem} from "react-native-elements";
import {View} from "../styles/Themed";
import {doShare} from "../../external/ShareManager";
import {StackNavigationProp} from "@react-navigation/stack";
import {Route} from "react-native";

interface Props {
    navigation: StackNavigationProp<any>,
    route: Route,
    stopCode: string,
    stopName: any,
    saved: boolean,
    toggleSaved: () => void,
}

const StopActionSheet: FC<Props> = (props) => {
    const [show, setShow] = useState<boolean>(false);
    const actionList = [
        {
            title: 'Save',
            iconName: (props.saved) ? "star" : "star-outline",
            onPress: () => props.toggleSaved(),
        },
        {
            title: 'Share',
            iconName: 'share',
            onPress: () => shareApp(),
        },
        {
            title: 'View on Map',
            iconName: 'map',
            onPress: () => {
                console.log('TODO: This needs to be implemented, perhaps an optional URL prop?')
            },
        },
        {
            title: 'Cancel',
            iconName: 'cancel',
            containerStyle: {
                backgroundColor: 'red',
            },
            titleStyle: {
                color: 'white',
            },
            iconColor: 'white',
            onPress: () => setShow(false),
        }
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
                    setShow(true);
                }}
            />
            <BottomSheet
                isVisible={show}
                modalProps={{
                    onRequestClose: () => setShow(false),
                    onDismiss: () => setShow(false),
                }}>
                {actionList.map((l, i) => {
                    interface StyleProp {
                        [key: string]: any
                    }

                    const title = l.title;
                    let titleStyle: StyleProp = (l.titleStyle) ? l.titleStyle : {};
                    // None of these work :'(
                    titleStyle.textAlign = 'center';
                    titleStyle.justifyContent = 'center';
                    titleStyle.textAlignVertical = 'center';
                    const containerStyle: StyleProp = (l.containerStyle) ? l.containerStyle : {};
                    const iconName = l.iconName;
                    const iconColor = l.iconColor;
                    const onPress = (l.onPress) ? l.onPress : () => {
                    };

                    return (
                        <ListItem
                            key={`action-sheet-${title}-${i}`}
                            containerStyle={containerStyle}
                            onPress={() => onPress()}
                        >
                            <ListItem.Content>
                                <ListItem.Title style={titleStyle}>
                                    {title}
                                </ListItem.Title>
                            </ListItem.Content>
                            {iconName && <Icon name={iconName} type={'material-community'} color={iconColor}/>}
                        </ListItem>
                    )
                })}
            </BottomSheet>
        </View>
    );
}

export default StopActionSheet;
