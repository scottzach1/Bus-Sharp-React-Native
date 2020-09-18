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
import ErrorCard from "../components/common/ErrorCard";
import AccountRedirectWrapper from "../navigation/AccountRedirectWrapper";
import {GoogleSignin} from "@react-native-community/google-signin";
import AccountBlurb from "../components/account/AccountBlurb";

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

    componentDidMount() {
        GoogleSignin.configure({
            // webClientId: "483376447021-ev7ocmauqblulvsfppk05pokj638uamg.apps.googleusercontent.com",
        });
    }

    async signupWithUserCredentials() {
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
            <AccountRedirectWrapper route={this.props.route} navigation={this.props.navigation}>
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
                        <AccountActionButton type={"signup"} submit={() => this.signupWithUserCredentials()}/>
                    </Card>
                    <Card>
                        <AccountBlurb type={"login"} navigation={this.props.navigation}/>
                        <Card.Divider/>
                        <Text style={{alignSelf: "center"}}>Alternatively, you may</Text>
                        <Text> </Text>
                        <LoginWithGoogleButton type={"signup"} onPress={() => signInWithGoogle()}/>
                    </Card>
                    <ErrorCard
                        errorMessage={this.state.errorMessage}
                        clearMessage={() => this.setState({errorMessage: null})}
                    />
                </ScrollView>
            </AccountRedirectWrapper>
        );
    }
}

export default AccountSignupScreen;