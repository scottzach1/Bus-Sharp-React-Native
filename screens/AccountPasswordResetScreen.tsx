import React, {FC, useState} from "react";
import {Route, ScrollView} from "react-native";
import {Card} from "react-native-elements";
import EmailInput from "../components/account/EmailInput";
import {Text} from "../components/styles/Themed";
import AccountActionButton from "../components/account/AccountActionButton";
import {resetAccountPassword} from "../external/Firebase";
import ErrorCard from "../components/common/ErrorCard";
import SuccessCard from "../components/common/SuccessCard";
import {StackNavigationProp} from "@react-navigation/stack";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

const AccountPasswordResetScreen: FC<Props> = () => {
    const [email, setEmail] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const resetPassword = async () => {
        const resp = await resetAccountPassword(email);
        setErrorMessage(resp.errorMessage);
        if (resp.success) {
            setSuccessMessage("Success! Check your inbox for a reset link.")
        }
    }

    return (
        <ScrollView>
            <Card>
                <Card.Title>Password Reset</Card.Title>
                <Card.Divider/>
                <EmailInput setEmail={(val) => setEmail(val)} key={"pass-reset-email-input"}/>
                <Text/>
                <AccountActionButton type={"reset"} submit={() => resetPassword()}/>
            </Card>
            <ErrorCard errorMessage={errorMessage} clearMessage={() => setErrorMessage(null)}/>
            <SuccessCard successMessage={successMessage} clearMessage={() => setSuccessMessage(null)}/>
        </ScrollView>
    );
}

export default AccountPasswordResetScreen;