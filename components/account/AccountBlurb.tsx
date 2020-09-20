import {View} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import React, {FC} from "react";
import {Card, Text} from "react-native-elements";

interface Props {
    navigation: StackNavigationProp<any>,
    type: 'login' | 'signup' | 'reset',
}

/**
 * This component is responsible for providing the quick links within the account authentication screens. Each of the
 * links will provide a description and navigate to the respective authentication pages.
 *
 * The context of the component will be provided by the strict property `type` within the Props interface.
 *
 * NOTE: This must be called within a `Card` component from `react-native-elements`.
 *
 * @param props - `Props` interface defined above.
 */
const AccountBlurb: FC<Props> = (props) => {

    let message: string, screen: string;

    switch (props.type) {
        case "signup":
            screen = "SettingsAccountSignupScreen";
            message = "Don't have an account?";
            break;
        case "reset":
            screen = "SettingsAccountPasswordResetScreen";
            message = "Forgot your password?";
            break;
        case "login":
            screen = "SettingsAccountLoginScreen";
            message = "Already have an account?";
            break;
    }

    // Render Styled Card Contents.
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
