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