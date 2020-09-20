import {ActivityIndicator, Route} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import React, {Component} from "react";
import {UserContext} from "../providers/UserProvider";
import {Card} from "react-native-elements";
import {checkAccountPath} from "./LinkingConfiguration";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

/**
 * This component acts as a dynamic routing handler to check the user does not access an account screen whilst they are
 * in an invalid user state. An invalid user state would be where the user is authenticated and trying to access an
 * authentication screen (login, signup, reset password), or is trying to view the account info screen whilst signed in.
 *
 * These redirects will happen dynamically and when the user account context changes (by using UserProvider).
 */
class AccountRedirectWrapper extends Component<Props, {}> {
    static contextType = UserContext;

    componentDidMount() {
        this.checkValidScreen();
    }

    checkValidScreen() {
        checkAccountPath(this.context, this.props.navigation, this.props.route);
    }

    generateWaitingCard() {
        return (
            <Card>
                <ActivityIndicator/>
            </Card>
        );
    }

    render() {
        this.checkValidScreen();

        return (typeof this.context === 'undefined') ?
            this.generateWaitingCard() : this.props.children;
    }
}

export default AccountRedirectWrapper;
