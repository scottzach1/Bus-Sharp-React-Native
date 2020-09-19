import React, {FC} from "react";
import {BottomSheet, Icon, ListItem} from "react-native-elements";
import {StyleProp, TextStyle, ViewStyle} from "react-native";

interface Props {
    isVisible: boolean,
    close: () => void,
    actionList: CustomBottomSheetProp[],
}

const CustomBottomSheet: FC<Props> = (props) => {
    const items = [
        ...props.actionList,
        // Add cancel button
        new CustomBottomSheetProp(
            'Cancel',
            () => props.close(),
            'cancel',
            'white',
            {
                color: 'white',
            },
            {
                backgroundColor: 'red',
            },
        )
    ];

    return (
        <BottomSheet
            isVisible={props.isVisible}
            modalProps={{
                onRequestClose: () => props.close(),
                onDismiss: () => props.close(),
            }}>
            {items.map((l, i) => (
                <ListItem
                    key={`action-sheet-${l.title}-${i}`}
                    containerStyle={l.containerStyle}
                    onPress={() => l.onPress()}
                >
                    <ListItem.Content>
                        <ListItem.Title style={l.titleStyle}>
                            {l.title}
                        </ListItem.Title>
                    </ListItem.Content>
                    {l.iconName && <Icon name={l.iconName} type={'material-community'} color={l.iconColor}/>}
                </ListItem>
            ))
            }
        </BottomSheet>
    );
}

export class CustomBottomSheetProp {
    public title: string;
    public titleStyle: StyleProp<TextStyle>;
    public containerStyle: StyleProp<ViewStyle>;
    public iconName: string;
    public iconColor: string | undefined;
    public onPress: () => void;

    constructor(title: string, onPress?: () => void | Promise<void> | undefined, iconName?: string, iconColor?: string | undefined, titleStyle?: StyleProp<TextStyle> | undefined, containerStyle?: StyleProp<ViewStyle> | undefined) {
        this.title = title;
        this.onPress = (onPress) ? onPress : () => {
        };
        this.iconName = (iconName) ? iconName : 'Unknown';
        this.iconColor = iconColor;
        this.titleStyle = (titleStyle) ? titleStyle : {};
        this.titleStyle = {
            // Inject some extra styles - Sadly they aren't working :'(
            textAlign: 'center',
            justifyContent: "center",
            textAlignVertical: "center",
            ...((titleStyle) ? titleStyle : {} as Object),
        }
        this.containerStyle = (containerStyle) ? containerStyle : {};
    }
}

export default CustomBottomSheet;
