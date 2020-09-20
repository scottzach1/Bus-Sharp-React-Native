import React, {FC} from "react";
import {BottomSheet, Icon, ListItem} from "react-native-elements";
import {StyleProp, TextStyle, ViewStyle} from "react-native";

interface Props {
    isVisible: boolean,
    close: () => void,
    actionList: CustomBottomSheetProp[],
}

/**
 * This component is responsible for rendering a bottom sheet. The bottom sheet pops up from the bottom of the screen
 * and renders the `CustomBottomSheetProp` objects defined at footer of the file.
 *
 * This component will automatically inject a 'cancel' button and perform any additional styles not defined within the
 * props.
 *
 * NOTE: This only works on mobile!
 *
 * @param props - `Props` interface defined above.
 */
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

    // Styled bottom sheet containing the entries specified within the `CustomBottomSheetProp` props.
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

/**
 * Defines an entry for the custom bottom sheet prop.
 */
export class CustomBottomSheetProp {
    public title: string;
    public titleStyle: StyleProp<TextStyle>;
    public containerStyle: StyleProp<ViewStyle>;
    public iconName: string;
    public iconColor: string | undefined;
    public onPress: () => void;

    /**
     * Creates a new prop that represents a new entry within a CustomBottomSheet.
     *
     * @param title - Name of the action.
     * @param onPress (optional) - Action preformed when the entry is clicked.
     * @param iconName (optional) - Name of the icon to render (defaults to question mark).
     * @param iconColor (optional) - Color of the icon to render.
     * @param titleStyle - (optional) - Styles to pass the title (See line `23` for example).
     * @param containerStyle - (optional) - Styles to pass the container (See line `23` for example).
     */
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
