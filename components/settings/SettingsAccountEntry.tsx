import {StackNavigationProp} from "@react-navigation/stack";
import React, {FC, useContext} from "react";
import {Icon, ListItem} from "react-native-elements";
import {UserContext} from "../../providers/UserProvider";

interface Props {
    navigation: StackNavigationProp<any>,
}

/**
 * This component represents an entry within the settings screen linking to the relevant account page. This is decided
 * based on the user context (provided by UserProvider). This will link to the login screen if the user is not
 * authenticated, otherwise the account info screen.
 */
const SettingsAccountEntry: FC<Props> = (props) => {
    const context = useContext(UserContext);

    const userLoaded: boolean = Boolean(context?.uid);

    const doPress = () => {
        const pageName = (userLoaded) ? 'Info' : 'Login';
        props.navigation.navigate('SettingsAccount' + pageName + 'Screen');
    }

    // Render styled clickable list item.
    return (
        <ListItem
            key={"settings-account-entry"}
            onPress={() => doPress()}
        >
            <Icon
                name={(userLoaded) ? "account" : "account-outline"}
                type={"material-community"}
            />
            <ListItem.Content>
                <ListItem.Title>
                    {(userLoaded) ? "Account" : "Login / Signup"}
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron/>
        </ListItem>
    );
}

export default SettingsAccountEntry;
