import React, {FC} from "react";
import {Icon, ListItem} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";

interface Props {
    navigation: StackNavigationProp<any>,
}

const SettingsTwitterFeedEntry: FC<Props> = (props) => {
    return (
        <ListItem
            key={"settings-twitter-entry"}
            onPress={() => props.navigation.navigate('SettingsTwitterScreen')}
        >
            <Icon name={"twitter"} type={"material-community"}/>
            <ListItem.Content>
                <ListItem.Title>
                    Twitter Updates Feed
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron/>
        </ListItem>
    )
}

export default SettingsTwitterFeedEntry;