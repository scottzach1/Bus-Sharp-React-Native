import React, {FC} from "react";
import {Switch} from "react-native";
import {ListItem} from "react-native-elements";

interface Props {
    title: string,
    toggled: boolean
    onPress: () => void
}

/**
 * This component stores a toggle with a name within a ListItem. This is useful for providing a tidy and consistent
 * toggle button with a much larger hit box.
 *
 * @param props - `Props` interface defined above.
 */
const ToggleListItem: FC<Props> = (props) => {
    // Return styled ListItem containing label and toggle.
    return (
        <ListItem onPress={() => props.onPress()}>
            <ListItem.Content>
                <ListItem.Title>
                    {props.title}
                </ListItem.Title>
            </ListItem.Content>
            <Switch value={props.toggled} onValueChange={() => props.onPress()}/>
        </ListItem>
    );
}

export default ToggleListItem;
