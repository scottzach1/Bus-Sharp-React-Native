import {View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import React, {FC} from "react";
import {Card, Text} from "react-native-elements";

interface Props {
    navigation: StackNavigationProp<any>,
    type: 'login' | 'signup' | 'reset',
}

const AccountBlurb: FC<Props> = (props) => {

    let message: string, screen: string;

    switch (props.type) {
        case "signup":
            screen = "SettingsAccountSignupScreen";
            message = "Don't have an account?";
            break;
        case "reset":
            screen = "SettingsAccountPasswordResetScreen";
            message = "Don't have an account?";
            break;
        case "login":
            screen = "SettingsAccountLoginScreen";
            message = "Already have an account?";
            break;
    }

    return (
        <View>
            <Card.Title>
                <Text>{`${message} `}</Text>
            </Card.Title>
            <Card.Title onPress={() => props.navigation.navigate(screen)}>
                <Text style={{textDecorationLine: "underline"}}>Click here</Text>.
            </Card.Title>
        </View>
    )
}

export default AccountBlurb;