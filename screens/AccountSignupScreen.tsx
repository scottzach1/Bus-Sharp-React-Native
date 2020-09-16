import {StackNavigationProp} from "@react-navigation/stack";
import {Route, ScrollView} from "react-native";
import React, {Component} from "react";
import {Text} from "../components/styles/Themed";
import AuthenticationResponse, {createUserWithCredentials, signInWithGoogle} from "../external/Firebase";
import {Card} from "react-native-elements";
import EmailInput from "../components/account/EmailInput";
import PasswordInput from "../components/account/PasswordInput";
import AccountActionButton from "../components/account/AccountActionButton";
import LoginWithGoogleButton from "../components/account/LoginWithGoogleButton";
import DisplayNameInput from "../components/account/DisplayNameInput";
import ErrorCard from "../components/account/ErrorCard";

interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    displayName: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    errorMessage: string | null,
}

class AccountSignupScreen extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            displayName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            errorMessage: null
        };
    }

    async signup() {
        this.setState({
            errorMessage: null,
        });

        const resp: AuthenticationResponse = await createUserWithCredentials(
            this.state.email,
            this.state.password,
            this.state.passwordConfirmation,
            this.state.displayName,
        );

        if (resp.success) {
            this.setState({
                email: '',
                password: '',
                passwordConfirmation: '',
                displayName: '',
            });
        } else {
            this.setState({
                errorMessage: resp.errorMessage,
            });
        }
    }

    render() {
        return (
            <ScrollView>
                <Card>
                    <Card.Title>Sign In</Card.Title>
                    <Card.Divider/>
                    <DisplayNameInput setEmail={(name) => this.setState({displayName: name})}/>
                    <EmailInput setEmail={(email) => this.setState({email: email})}/>
                    <PasswordInput
                        setPassword={(password) => this.setState({password: password})}
                    />
                    <PasswordInput
                        setPassword={(password) => this.setState({passwordConfirmation: password})}
                        confirmation={true}
                    />
                    <AccountActionButton type={"signup"} submit={() => this.signup()}/>
                </Card>
                <Card>
                    <Card.Title>
                        <Text>Already have an account? </Text>
                    </Card.Title>
                    <Card.Title onPress={() => this.props.navigation.navigate('SettingsAccountLoginScreen')}>
                        <Text style={{textDecorationLine: "underline"}}>Click here</Text>.
                    </Card.Title>
                    <Card.Divider/>
                    <Text style={{alignSelf: "center"}}>Alternatively, you may</Text>
                    <Text> </Text>
                    <LoginWithGoogleButton type={"signup"} onPress={signInWithGoogle}/>
                </Card>
                <ErrorCard errorMessage={this.state.errorMessage}/>
            </ScrollView>
        );
    }
}

export default AccountSignupScreen;