import React, {Component} from "react";
import {Text, View} from "react-native";

interface Props {
}

interface State {
}

class AccountLoginScreen extends Component<Props, State> {
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Account Login!</Text>
            </View>
        );
    }
}

export default AccountLoginScreen;