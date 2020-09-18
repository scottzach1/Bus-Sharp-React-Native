import React, {Component} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {Route, ScrollView} from "react-native";
import AuthenticationResponse, {signInWithCredentials, signInWithGoogle} from "../external/Firebase";
import {Card, Text} from "react-native-elements";
import EmailInput from "../components/account/EmailInput";
import PasswordInput from "../components/account/PasswordInput";
import AccountActionButton from "../components/account/AccountActionButton";
import LoginWithGoogleButton from "../components/account/LoginWithGoogleButton";
import ErrorCard from "../components/common/ErrorCard";
import AccountRedirectWrapper from "../navigation/AccountRedirectWrapper";
import {GoogleSignin} from "@react-native-community/google-signin";
import AccountBlurb from "../components/account/AccountBlurb";


interface Props {
    route: Route,
    navigation: StackNavigationProp<any>,
}

interface State {
    email: string,
    password: string,
    errorMessage: string | null
}

class AccountLoginScreen extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMessage: null
        };
    }

    componentDidMount() {
        GoogleSignin.configure({
            // webClientId: "483376447021-ev7ocmauqblulvsfppk05pokj638uamg.apps.googleusercontent.com",
        });
    }

    async loginWithUserCredentials() {
        this.setState({errorMessage: null});

        const resp: AuthenticationResponse = await signInWithCredentials(this.state.email, this.state.password);

        if (resp.success)
            this.setState({email: '', password: ''});
        else
            this.setState({errorMessage: resp.errorMessage});
    }

    async loginWithGoogle() {
        const resp = await signInWithGoogle();

        this.setState({
            errorMessage: resp.errorMessage
        });
    }

    render() {
        return (
            <AccountRedirectWrapper route={this.props.route} navigation={this.props.navigation}>
                <ScrollView>
                    {/* LOGIN CARD */}
                    <Card>
                        <Card.Title>Sign In</Card.Title>
                        <Card.Divider/>
                        <EmailInput setEmail={(email) => this.setState({email: email})}/>
                        <PasswordInput setPassword={(password) => this.setState({password: password})}/>
                        <AccountActionButton type={"login"} submit={() => this.loginWithUserCredentials()}/>
                    </Card>
                    <Card>
                        {/* ACCOUNT ACTION LINKS */}
                        <AccountBlurb type={"signup"} navigation={this.props.navigation}/>
                        <AccountBlurb type={"reset"} navigation={this.props.navigation}/>
                        <Card.Divider/>
                        <Text style={{alignSelf: "center"}}>Alternatively, you may</Text>
                        <Text/>
                        {/* LOGIN WITH GOOGLE */}
                        <LoginWithGoogleButton type={"login"} onPress={signInWithGoogle}/>
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

export default AccountLoginScreen;