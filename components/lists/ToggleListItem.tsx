import React, {FC} from "react";
import {Switch} from "react-native";
import {ListItem} from "react-native-elements";

interface Props {
    title: string,
    toggled: boolean
    onPress: () => void
}

const ToggleListItem: FC<Props> = (props) => {
    return (
        <ListItem onPress={() => props.onPress()}>
            <ListItem.Content>
                <ListItem.Title>
                    {props.title}
                </ListItem.Title>
            </ListItem.Content>
            <Switch value={props.toggled}/>
        </ListItem>
    );
}

export default ToggleListItem;
