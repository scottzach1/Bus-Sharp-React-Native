import React, {Component} from "react";
import {StackNavigationProp} from "@react-navigation/stack";
import {Route, ScrollView} from "react-native";
import {AuthenticationResponse, signInWithCredentials, signInWithGoogle} from "../external/FirebaseManager";
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

/**
 * This screen is responsible for handling any user login activities. This can include with credentials (username +
 * password) or via the login with Google button. The user should also be able to use this screen to navigate to the
 * sign up screen and the forgot password screen.
 *
 * Sadly login with Google is currently broken :'/.
 */
class AccountLoginScreen extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMessage: null
        };
    }

    /**
     * Attempt to configure sign in with Google authentication (in case user clicks button).
     *
     * This requires configuration but sadly wasn't working as we appear to require a different API key.
     * See here: https://rnfirebase.io/auth/social-auth#google
     */
    componentDidMount() {
        GoogleSignin.configure({
            // webClientId: "483376447021-ev7ocmauqblulvsfppk05pokj638uamg.apps.googleusercontent.com",
        });
    }

    /**
     * Authenticates the user with Firebase using email and password credentials. This is handled by the FirebaseManager.
     * Any errors are propagated to the users via the `errorMessage` state.
     */
    async loginWithUserCredentials() {
        this.setState({errorMessage: null});

        const resp: AuthenticationResponse = await signInWithCredentials(this.state.email, this.state.password);

        this.setState({errorMessage: resp.errorMessage});
    }

    /**
     * Provides a mobile popup to the user prompting whether they want to sign in with a Google Account. Although the
     * popup works correctly sadly authentication permission has been blocked. See `componentDidMount()`.
     */
    async loginWithGoogle() {
        const resp = await signInWithGoogle();

        this.setState({
            errorMessage: resp.errorMessage
        });
    }

    /**
     * Renders the Account Login screen.
     */
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
                        <AccountActionButton type={"login"} onPress={() => this.loginWithUserCredentials()}/>
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
