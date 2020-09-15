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
        checkAccountPath(this.context, this.props.navigation);
    }

    generateWaitingCard() {
        return (
            <Card>
                <ActivityIndicator/>
            </Card>
        );
    }

    render() {
        checkAccountPath(this.context, this.props.navigation);

        return (typeof this.context === 'undefined') ?
            this.generateWaitingCard() : this.props.children;
    }
}

export default AccountRedirectWrapper;