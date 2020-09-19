import React, {FC, useState} from "react";
import {BottomSheet, Button, Icon, ListItem} from "react-native-elements";
import {View} from "../styles/Themed";
import {doShare} from "../../external/ShareManager";

interface Props {
    stopCode: string,
    stopName: any,
}

const StopActionSheet: FC<Props> = (props) => {
    const [show, setShow] = useState<boolean>(false);
    const actionList = [
        {
            title: 'Save',
            iconName: 'saved',
        },
        {
            title: 'Share',
            iconName: 'share',
            onPress: () => shareApp(),
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
            onPress: () => setShow(false),
        }
    ]

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
                    console.log('fuck');
                }}
            />
            <BottomSheet
                isVisible={show}
                modalProps={{}}>
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
                    const onPress = (l.onPress) ? l.onPress : () => {
                    }

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
                            {iconName && <Icon name={iconName} type={'material-community'}/>}
                        </ListItem>
                    )
                })}
            </BottomSheet>
        </View>
    );
}

export default StopActionSheet;
