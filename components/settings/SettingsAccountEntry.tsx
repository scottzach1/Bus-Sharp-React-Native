import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {Icon, ListItem} from "react-native-elements";
import {UserContext} from "../../providers/UserProvider";

interface Props {
    navigation: StackNavigationProp<any>,
}

interface State {
}

class SettingsAccountEntry extends Component<Props, State> {
    static contextType = UserContext;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {}
    }

    doPress() {
        const pageName = (this.context?.uid) ? 'Info' : 'Login';
        this.props.navigation.navigate('SettingsAccount' + pageName + 'Screen');
    }


    render() {
        const userLoaded: boolean = this.context?.uid;

        return (
            <ListItem
                key={"settings-account-entry"}
                onPress={() => this.doPress()}
            >
                <Icon
                    name={(userLoaded) ? "account" : "account-outline"}
                    type={"material-community"}
                />
                <ListItem.Content>
                    <ListItem.Title>
                        {userLoaded ? "Account" : "Login / Signup"}
                    </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron/>
            </ListItem>
        );
    }
}

export default SettingsAccountEntry;