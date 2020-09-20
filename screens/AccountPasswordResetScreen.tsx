import React, {FC, useState} from "react";
import {Route, ScrollView} from "react-native";
import {Card} from "react-native-elements";
import EmailInput from "../components/account/EmailInput";
import {Text} from "../components/styles/Themed";
import AccountActionButton from "../components/account/AccountActionButton";
import {resetAccountPassword} from "../external/FirebaseManager";
import ErrorCard from "../components/common/ErrorCard";
import SuccessCard from "../components/common/SuccessCard";
import {StackNavigationProp} from "@react-navigation/stack";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

/**
 * This screen is responsible for handling the password reset functionality for a user who is not currently signed in.
 *
 * This screen contains a single text box (email) and a button when pressed, the user will be prompted to check their
 * email. If any error is detected (i.e), no user account then the user will be presented with an error message.
 */
const AccountPasswordResetScreen: FC<Props> = () => {
    const [email, setEmail] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    /**
     * Handles the password reset functionality by interacting with the FirebaseManager.
     *
     * Any errors are propagated to the users via the `errorMessage` state.
     */
    const resetPassword = async () => {
        const resp = await resetAccountPassword(email);
        if (resp.success)
            setSuccessMessage("Success! Check your inbox for a reset link.")
        else
            setErrorMessage(resp.errorMessage);
    }

    /**
     * Renders the Account Password Reset screen.
     */
    return (
        <ScrollView>
            {/* Main view */}
            <Card>
                <Card.Title>Password Reset</Card.Title>
                <Card.Divider/>
                <EmailInput setEmail={(val) => setEmail(val)} key={"pass-reset-email-input"}/>
                <Text/>
                <AccountActionButton type={"reset"} onPress={() => resetPassword()}/>
            </Card>
            {/* Notify the user off success / failure. */}
            <ErrorCard errorMessage={errorMessage} clearMessage={() => setErrorMessage(null)}/>
            <SuccessCard successMessage={successMessage} clearMessage={() => setSuccessMessage(null)}/>
        </ScrollView>
    );
}

export default AccountPasswordResetScreen;
